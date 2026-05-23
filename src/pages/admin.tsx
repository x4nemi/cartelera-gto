import { CosmosAPI } from "@/config/apiClient";
import { useProfiles } from "@/hooks/useProfiles";
import DefaultLayout from "@/layouts/default"
import type { PostData } from "@/types";
import { Spinner } from "@heroui/react";
import { Switch } from "@/compat/heroui";
import { Chip, Input, Tab, Tabs } from "@/compat/heroui";
import { Button } from "@/compat/heroui";
import { addToast, Card, Image, User } from "@/compat/heroui";
import { useEffect, useState } from "react";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

export const Admin = () => {
    const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
    const [pin, setPin] = useState("");
    const [pinError, setPinError] = useState(false);

    if (!authed) {
        const handleSubmit = () => {
            if (pin === ADMIN_PIN) {
                sessionStorage.setItem("admin_auth", "1");
                setAuthed(true);
            } else {
                setPinError(true);
                setPin("");
            }
        };

        return (
            <DefaultLayout>
                <div className="flex flex-col items-center justify-center gap-4 py-20 w-full">
                    <Input
                        type="password"
                        label="PIN de acceso"
                        placeholder="Ingresa el PIN"
                        value={pin}
                        onValueChange={(v) => { setPin(v); setPinError(false); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        isInvalid={pinError}
                        errorMessage={pinError ? "PIN incorrecto" : undefined}
                        className="max-w-xs"
                    />
                    <Button color="accent" variant="tertiary" className="rounded-2xl" onPress={handleSubmit}>
                        Entrar
                    </Button>
                </div>
            </DefaultLayout>
        );
    }

    return <AdminPanel />;
};

/** Posts that the AI flagged as low-confidence and the user opted to send for review. */
const PendingPostsQueue = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actingShortCode, setActingShortCode] = useState<string | null>(null);
    const adminUsername = "admin"; // single admin role today; extend later if needed

    const refresh = async () => {
        setLoading(true);
        try {
            const res = await CosmosAPI.getEvents({ status: "pending", limit: 100 });
            // API returns { items, ... } via PaginatedResponse
            const items = (res as any)?.items ?? (Array.isArray(res) ? res : []);
            setPosts(items);
        } catch (err) {
            console.error("Failed to load pending posts:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleApprove = async (post: PostData) => {
        setActingShortCode(post.shortCode);
        try {
            await CosmosAPI.updateEvent(post.shortCode, "publish", { reviewedBy: adminUsername });
            addToast({
                title: "Publicación aprobada",
                description: `"${post.title || post.shortCode}" ahora aparece en la cartelera.`,
                color: "success",
                timeout: 5000,
                variant: "flat",
            });
            setPosts((prev) => prev.filter((p) => p.shortCode !== post.shortCode));
        } catch (err) {
            console.error(err);
            addToast({ title: "Error al aprobar", color: "danger", variant: "flat" });
        } finally {
            setActingShortCode(null);
        }
    };

    const handleReject = async (post: PostData) => {
        setActingShortCode(post.shortCode);
        try {
            await CosmosAPI.updateEvent(post.shortCode, "dismiss", { reviewedBy: adminUsername });
            addToast({
                title: "Publicación rechazada",
                description: `"${post.title || post.shortCode}" fue descartada.`,
                color: "default",
                timeout: 5000,
                variant: "flat",
            });
            setPosts((prev) => prev.filter((p) => p.shortCode !== post.shortCode));
        } catch (err) {
            console.error(err);
            addToast({ title: "Error al rechazar", color: "danger", variant: "flat" });
        } finally {
            setActingShortCode(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner color="accent" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-10 text-default-500">
                <span className="text-2xl">🎉</span>
                <p className="text-small">No hay publicaciones pendientes de revisión.</p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-3 w-full max-w-2xl">
            {posts.map((post) => {
                const headline = post.title?.trim() || post.caption?.split("\n").map(s => s.trim()).find(Boolean) || "Sin título";
                const confidence = post.aiVerdict?.confidence;
                const reason = post.aiVerdict?.reason;
                const isActing = actingShortCode === post.shortCode;
                return (
                    <Card key={post.shortCode} className="p-3 rounded-3xl shadow-none" >
                        <div className="flex gap-3">
                            <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-content2">
                                {post.images?.[0] && (
                                    <Image
                                        removeWrapper
                                        src={post.images[0]}
                                        alt={headline}
                                        className="w-full h-full object-cover"
                                        classNames={{ img: "rounded-none" }}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                <h3 className="text-small font-semibold leading-tight line-clamp-2">{headline}</h3>
                                <p className="text-tiny text-default-500 truncate">@{post.ownerUsername}</p>
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                    {post.aiVerdict?.isEvent === false && (
                                        <Chip size="sm" variant="soft" color="warning" className="rounded-lg h-5 text-tiny px-1.5">
                                            La IA cree que no es un evento
                                        </Chip>
                                    )}
                                    {confidence !== undefined && (
                                        <Chip size="sm" variant="soft" className="rounded-lg h-5 text-tiny px-1.5">
                                            Confianza {Math.round(confidence * 100)}%
                                        </Chip>
                                    )}
                                </div>
                                {reason && (
                                    <p className="text-tiny text-default-500 italic line-clamp-2 pt-0.5">"{reason}"</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-3">
                            <Button
                                size="sm"
                                variant="tertiary"
                                color="danger"
                                isDisabled={isActing}
                                onPress={() => handleReject(post)}
                                className="rounded-xl"
                            >
                                Rechazar
                            </Button>
                            <Button
                                size="sm"
                                color="accent"
                                isLoading={isActing}
                                onPress={() => handleApprove(post)}
                                className="rounded-xl"
                            >
                                Aprobar
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </ul>
    );
};

const AdminPanel = () => {
    const { users, loading, refresh } = useProfiles("all");

    const [loading2, setLoading2] = useState(false)

    const handleApprove = async (username: string) => {
        const finalUser = {...users.find(u => u.username === username, )!, status: "approved" as const};
        
        try{
            const result = await CosmosAPI.insertUser(finalUser);
            
            setLoading2(true)

            if(result){
                await refresh();
                addToast({
                    title: "Usuario aprobado",
                    description: `El usuario ${username} ha sido aprobado exitosamente.`,
                    timeout: 5000,
                    variant: "flat",
                    color: "success",
                    size: "lg",
                });
            }
        } catch (err) {
            console.error("Error al aprobar usuario:", err);
            alert(`Error al aprobar el usuario ${username}.`);
        } finally {
            setLoading2(false);
        }

    }

    const handleToggleAutoDetect = async (username: string, enabled: boolean) => {
        const user = users.find(u => u.username === username);
        if (!user) return;
        try {
            await CosmosAPI.insertUser({ ...user, autoDetectEnabled: enabled });
            await refresh();
            addToast({
                title: enabled ? "Auto-detección activada" : "Auto-detección desactivada",
                description: `@${username}`,
                timeout: 3000,
                variant: "flat",
                color: enabled ? "success" : "default",
                size: "lg",
            });
        } catch {
            addToast({ title: "Error al actualizar", color: "danger" });
        }
    };

    return (
        <DefaultLayout>
            <section className="w-full items-center flex flex-col px-4">
                <Tabs aria-label="Secciones admin" variant="underlined" className="mt-4">
                    <Tab key="users" title="Usuarios">
                        {loading ? (
                            <p>Cargando usuarios...</p>
                        ) : (
                            <ul className="mt-4 space-y-2 items-center flex flex-col">
                                {users.map(user => (
                                    <Card key={user._id} className="p-4 flex flex-row justify-between items-center gap-5 max-w-xl w-md rounded-3xl shadow-none">
                                        <User
                                            name={user.fullName}
                                            description={user.status === "approved" ? "Aprobado" : user.status === "pending" ? "Pendiente" : user.status === "rejected" ? "Rechazado" : "Borrador"}
                                            avatarProps={{ src: user.profilePicUrl }}
                                        />
                                        <div className="flex items-center gap-3">
                                            {user.status === "approved" && (
                                                <Switch
                                                    size="sm"
                                                    isSelected={!!user.autoDetectEnabled}
                                                    onValueChange={(val) => handleToggleAutoDetect(user.username, val)}
                                                >
                                                    <span className="text-xs">Auto-detectar</span>
                                                </Switch>
                                            )}
                                            {user.status !== "approved" &&
                                                <Button color="accent" variant="tertiary" isLoading={loading2} size="md" onClick={() => handleApprove(user.username)}>Aprobar</Button>
                                            }
                                        </div>
                                    </Card>
                                ))}
                            </ul>
                        )}
                    </Tab>
                    <Tab key="posts" title="Publicaciones">
                        <div className="flex justify-center mt-4">
                            <PendingPostsQueue />
                        </div>
                    </Tab>
                </Tabs>
            </section>
        </DefaultLayout>
    )
}
