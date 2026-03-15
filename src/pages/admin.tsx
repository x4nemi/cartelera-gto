import { CosmosAPI } from "@/config/apiClient";
import { useProfiles } from "@/hooks/useProfiles";
import DefaultLayout from "@/layouts/default"
import { addToast, Button, Card, Input, Switch, User } from "@heroui/react";
import { useState } from "react";

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
                    <Button color="primary" variant="flat" className="rounded-2xl" onPress={handleSubmit}>
                        Entrar
                    </Button>
                </div>
            </DefaultLayout>
        );
    }

    return <AdminPanel />;
};

const AdminPanel = () => {
    const { users, loading, refresh } = useProfiles();

    const [loading2, setLoading2] = useState(false)

    const handleApprove = async (username: string) => {
        const finalUser = {...users.find(u => u.username === username, )!, isApproved: true};
        
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
            <section className="w-full justify-center">

                {/* <h1 className="text-2xl font-bold">Usuarios para aprobar</h1> */}
                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {users.map(user => (
                            <Card key={user._id} className="p-4 flex flex-row justify-between items-center gap-5 w-full">
                                <User
                                    name={user.fullName}
                                    description={user.isApproved ? "Aprobado" : "Pendiente"}
                                    avatarProps={{ src: user.profilePicUrl }}
                                />
                                <div className="flex items-center gap-3">
                                    {user.isApproved && (
                                        <Switch
                                            size="sm"
                                            isSelected={!!user.autoDetectEnabled}
                                            onValueChange={(val) => handleToggleAutoDetect(user.username, val)}
                                        >
                                            <span className="text-xs">Auto-detectar</span>
                                        </Switch>
                                    )}
                                    {!user.isApproved &&
                                        <Button color="primary" variant="flat" isLoading={loading2} size="md" onClick={() => handleApprove(user.username)}>Aprobar</Button>
                                    }
                                </div>
                            </Card>
                        ))}
                    </ul>
                )}
            </section>
        </DefaultLayout>
    )
}
