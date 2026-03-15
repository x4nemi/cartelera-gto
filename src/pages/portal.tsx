import { useRequireUser } from "@/hooks/useRequireUser";
import { useUserPosts } from "@/hooks/useUserPosts";
import { PortalWall } from "@/layouts/portalWall";
import PortalLayout from "@/layouts/portal";
import { Avatar, Button, Card, CardBody, CardFooter, Chip, Image, Link, Skeleton, Spinner, addToast } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import { SadIcon, SparklesIcon } from "@/components/icons";
import { CosmosAPI, PostData } from "@/config/apiClient";
import { useEffect, useState, useCallback } from "react";

export const Portal = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, loading: loadingUser } = useRequireUser(username);
    const { posts, loading: loadingPosts, refresh: refreshPosts } = useUserPosts(username);
    const [pendingEvents, setPendingEvents] = useState<PostData[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);

    // Fetch pending auto-detected events
    const fetchPending = useCallback(async () => {
        if (!username) return;
        setLoadingPending(true);
        try {
            const pending = await CosmosAPI.getPendingEvents(username);
            setPendingEvents(pending);
        } catch {
            // Silently fail — user may not have auto-detect enabled
        } finally {
            setLoadingPending(false);
        }
    }, [username]);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handlePublish = async (shortCode: string) => {
        try {
            await CosmosAPI.updateEvent(shortCode, "publish");
            setPendingEvents((prev) => prev.filter((e) => e.shortCode !== shortCode));
            refreshPosts();
            addToast({ title: "¡Evento publicado!", color: "success" });
        } catch {
            addToast({ title: "Error al publicar", color: "danger" });
        }
    };

    const handleDismiss = async (shortCode: string) => {
        try {
            await CosmosAPI.updateEvent(shortCode, "dismiss");
            setPendingEvents((prev) => prev.filter((e) => e.shortCode !== shortCode));
        } catch {
            addToast({ title: "Error al descartar", color: "danger" });
        }
    };

    const handleEdit = (shortCode: string) => {
        navigate(`/${username}/publicar?draftId=${shortCode}`);
    };

    const sidebar = (
        <div className="flex flex-col gap-4">
            {loadingUser ? (
                <div className="flex flex-col gap-3 items-center w-full rounded-3xl bg-content1 dark:bg-content2 backdrop-blur-sm p-6">
                    <Skeleton className="rounded-full w-24 h-24" />
                    <Skeleton className="h-5 w-40 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg mt-2" />
                </div>
            ) : user && (
                <Card className="w-full rounded-3xl bg-content1 dark:bg-content2 backdrop-blur-sm" shadow="none">
                    <CardBody className="flex flex-col items-center gap-4">
                        <Avatar
                            src={user.profilePicUrl || "/default-avatar.png"}
                            className="w-24 h-24"
                            color="primary"
                        />
                        <div className="flex flex-col gap-1 items-center">
                            {user.fullName && (
                                <h2 className="text-lg font-semibold">{user.fullName}</h2>
                            )}
                            <Link
                                isExternal
                                href={`https://instagram.com/${user.username}`}
                                size="sm"
                                className="text-primary"
                            >
                                @{user.username}
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Button className="rounded-2xl" size="md" color="primary" onPress={() => navigate(`/${username}/publicar`)} variant="flat">Crear publicación</Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );

    return (
        <PortalLayout sidebar={sidebar}>
            {/* Pending auto-detected events */}
            {pendingEvents.length > 0 && (
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <SparklesIcon size={18} className="text-secondary-600" />
                        <h3 className="text-lg font-semibold">
                            {pendingEvents.length} evento{pendingEvents.length !== 1 ? "s" : ""} detectado{pendingEvents.length !== 1 ? "s" : ""}
                        </h3>
                    </div>
                    <p className="text-sm text-foreground-500">
                        Revisamos tus publicaciones y encontramos posibles eventos. Confírmalos para publicarlos.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pendingEvents.map((event) => (
                            <Card key={event.shortCode} className="rounded-3xl" shadow="none">
                                <CardBody className="p-0 overflow-hidden">
                                    {event.displayUrl && (
                                        <Image
                                            removeWrapper
                                            alt="Evento detectado"
                                            className="w-full h-40 object-cover rounded-t-3xl rounded-b-none"
                                            src={event.displayUrl}
                                        />
                                    )}
                                    <div className="p-3 flex flex-col gap-2">
                                        <p className="text-sm line-clamp-2">{event.caption || "Sin descripción"}</p>
                                        {event.dates && event.dates.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {event.dates.slice(0, 4).map((d, i) => {
                                                    const [y, m, day] = d.split("-").map(Number);
                                                    const date = new Date(y, m - 1, day);
                                                    return (
                                                        <Chip key={i} size="sm" variant="flat" color="primary">
                                                            {date.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}
                                                        </Chip>
                                                    );
                                                })}
                                                {event.dates.length > 4 && (
                                                    <Chip size="sm" variant="flat">+{event.dates.length - 4}</Chip>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                                <CardFooter className="flex gap-2 pt-0 px-3 pb-3">
                                    <Button size="sm" color="primary" className="rounded-2xl flex-1" onPress={() => handlePublish(event.shortCode)}>
                                        Publicar
                                    </Button>
                                    <Button size="sm" color="default" variant="flat" className="rounded-2xl flex-1" onPress={() => handleEdit(event.shortCode)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" color="danger" variant="light" className="rounded-2xl" onPress={() => handleDismiss(event.shortCode)}>
                                        Descartar
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {loadingPending && pendingEvents.length === 0 && (
                <div className="flex justify-center py-4 mb-4">
                    <Spinner size="sm" />
                </div>
            )}

            {/* Existing published posts */}
            {loadingPosts ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : posts.length > 0 ? (
                <PortalWall cardsData={posts} onPostUpdated={refreshPosts} />
            ) : (
                <div className="flex flex-col justify-center items-center py-20 text-foreground/50 gap-2">
                    <SadIcon size={48} />
                    <p>Este usuario aún no tiene publicaciones.</p>
                </div>
            )}
        </PortalLayout>
    );
};
