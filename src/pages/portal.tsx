import { useRequireUser } from "@/hooks/useRequireUser";
import { useUserPosts } from "@/hooks/useUserPosts";
import { usePortalSession } from "@/hooks/usePortalSession";
import { PortalWall } from "@/layouts/portalWall";
import PortalLayout from "@/layouts/portal";
import { Card, CardFooter, Chip, Link, Skeleton, Spinner } from "@heroui/react";
import { Button, Tooltip } from "@/compat/heroui";
import { addToast, Avatar, CardBody, Image } from "@/compat/heroui";
import { useNavigate, useParams } from "react-router-dom";
import { SadIcon, SparklesIcon, EditIcon, TrashIcon } from "@/components/icons";
import { CosmosAPI, PostData } from "@/config/apiClient";
import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

export type PortalProps = {
    /** When true, hide all edit/publish/dismiss actions (public profile view). */
    readOnly?: boolean;
};

export const Portal = ({ readOnly = false }: PortalProps = {}) => {
    const { username: usernameParam } = useParams();
    const sessionUsername = usePortalSession();
    // Public route gets the username from the URL; portal-side uses the session.
    const username = usernameParam ?? sessionUsername ?? undefined;
    const navigate = useNavigate();
    const { user, loading: loadingUser } = useRequireUser(username, {
        redirectTo: "/",
        clearSessionOnReject: !usernameParam,
    });
    const { posts, loading: loadingPosts, refresh: refreshPosts } = useUserPosts(username);
    const [pendingEvents, setPendingEvents] = useState<PostData[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);

    // Fetch pending auto-detected events (only when the owner is viewing).
    const fetchPending = useCallback(async () => {
        if (!username || readOnly) return;
        setLoadingPending(true);
        try {
            const pending = await CosmosAPI.getPendingEvents(username);
            setPendingEvents(pending);
        } catch {
            // Silently fail — user may not have auto-detect enabled
        } finally {
            setLoadingPending(false);
        }
    }, [username, readOnly]);

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
            addToast({ title: "Evento descartado", color: "default" });
        } catch {
            addToast({ title: "Error al descartar", color: "danger" });
        }
    };

    const handleEdit = (shortCode: string) => {
        navigate(`/publicar?draftId=${shortCode}`);
    };

    const publishedCount = useMemo(() => posts.length, [posts]);
    const pendingCount = pendingEvents.length;

    const sidebar = (
        <div className="flex flex-col gap-4">
            {loadingUser ? (
                <Card className="w-full rounded-3xl bg-content1 dark:bg-content2" shadow="none">
                    <CardBody className="flex flex-col items-center gap-3 p-6">
                        <Skeleton className="rounded-full w-24 h-24" />
                        <Skeleton className="h-5 w-40 rounded-lg" />
                        <Skeleton className="h-4 w-32 rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-2xl mt-2" />
                    </CardBody>
                </Card>
            ) : user && (
                <Card className="w-full rounded-3xl bg-content1 dark:bg-content2 overflow-hidden" shadow="none">
                    {/* Subtle gradient header */}
                    <div className="h-16 bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-50 dark:from-primary-900/40 dark:via-secondary-900/30 dark:to-primary-900/20" />
                    <CardBody className="flex flex-col items-center gap-3 -mt-12 pb-5">
                        <Avatar
                            src={user.profilePicUrl || "/default-avatar.png"}
                            className="w-24 h-24 ring-4 ring-content1 dark:ring-content2"
                            color="accent"
                        />
                        <div className="flex flex-col gap-0.5 items-center text-center px-3">
                            {user.fullName && (
                                <h2 className="text-lg font-semibold leading-tight">{user.fullName}</h2>
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

                        {user.biography && (
                            <p className="text-xs text-foreground-500 text-center px-4 line-clamp-3 whitespace-pre-line">
                                {user.biography}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 w-full px-4 mt-1">
                            <div className="flex flex-col items-center rounded-2xl bg-default-100 dark:bg-default-50 py-2">
                                <span className="text-lg font-semibold leading-none">{publishedCount}</span>
                                <span className="text-[10px] uppercase tracking-wide text-foreground-500 mt-1">
                                    Publicados
                                </span>
                            </div>
                            <div className="flex flex-col items-center rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 py-2">
                                <span className="text-lg font-semibold leading-none text-secondary-600">
                                    {pendingCount}
                                </span>
                                <span className="text-[10px] uppercase tracking-wide text-foreground-500 mt-1">
                                    Pendientes
                                </span>
                            </div>
                        </div>

                        {/* Auto-detect indicator */}
                        {user.autoDetectEnabled && (
                            <Tooltip content="Detectamos eventos en tus publicaciones nuevas de Instagram automáticamente.">
                                <Chip
                                    size="sm"
                                    variant="soft"
                                    color="secondary"
                                    startContent={<SparklesIcon size={14} />}
                                    className="mt-1"
                                >
                                    Auto-detección activa
                                </Chip>
                            </Tooltip>
                        )}

                        {!readOnly && (
                        <div className="flex flex-col gap-2 w-full px-4 mt-2">
                            <Button
                                className="rounded-2xl font-medium"
                                size="md"
                                color="accent"
                                onPress={() => navigate(`/publicar`)}
                            >
                                Crear publicación
                            </Button>
                        </div>
                        )}
                    </CardBody>
                </Card>
            )}
        </div>
    );

    return (
        <PortalLayout sidebar={sidebar}>
            {/* Pending auto-detected events */}
            {!readOnly && (loadingPending || pendingEvents.length > 0) && (
                <section className="mb-8">
                    <div className="rounded-3xl border border-secondary-200/60 dark:border-secondary-800/40 bg-secondary-50/40 dark:bg-secondary-950/20 p-4 sm:p-5">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="rounded-xl bg-secondary-100 dark:bg-secondary-900/40 p-2 mt-0.5">
                                <SparklesIcon size={18} className="text-secondary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-base sm:text-lg font-semibold">
                                        Eventos detectados
                                    </h3>
                                    {pendingCount > 0 && (
                                        <Chip size="sm" variant="soft" color="secondary">
                                            {pendingCount}
                                        </Chip>
                                    )}
                                </div>
                                <p className="text-xs sm:text-sm text-foreground-500 mt-0.5">
                                    Encontramos posibles eventos en tus publicaciones recientes. Revísalos y publícalos en la cartelera.
                                </p>
                            </div>
                        </div>

                        {loadingPending && pendingEvents.length === 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Card key={i} className="rounded-3xl" shadow="none">
                                        <CardBody className="p-0">
                                            <Skeleton className="w-full h-40 rounded-t-3xl" />
                                            <div className="p-3 flex flex-col gap-2">
                                                <Skeleton className="h-3 w-3/4 rounded-lg" />
                                                <Skeleton className="h-3 w-1/2 rounded-lg" />
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <AnimatePresence mode="popLayout">
                                    {pendingEvents.map((event) => (
                                        <motion.div
                                            key={event.shortCode}
                                            layout
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <Card className="rounded-3xl bg-content1 dark:bg-content2 h-full" shadow="none">
                                                <CardBody className="p-0 overflow-hidden relative">
                                                    {event.images?.[0] ? (
                                                        <div className="relative">
                                                            <Image
                                                                removeWrapper
                                                                alt="Evento detectado"
                                                                className="w-full h-44 object-cover rounded-t-3xl rounded-b-none"
                                                                src={event.images[0]}
                                                            />
                                                            {event.images.length > 1 && (
                                                                <Chip
                                                                    size="sm"
                                                                    variant="soft"
                                                                    className="absolute top-2 right-2 bg-black/50 text-white backdrop-blur-sm"
                                                                >
                                                                    +{event.images.length - 1}
                                                                </Chip>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-44 bg-default-100 dark:bg-default-50 rounded-t-3xl" />
                                                    )}
                                                    <div className="p-3 flex flex-col gap-2">
                                                        {event.dates && event.dates.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {event.dates.slice(0, 3).map((d, i) => {
                                                                    const [y, m, day] = d.split("-").map(Number);
                                                                    const date = new Date(y, m - 1, day);
                                                                    return (
                                                                        <Chip key={i} size="sm" variant="soft" color="accent">
                                                                            {date.toLocaleDateString("es-MX", {
                                                                                weekday: "short",
                                                                                day: "numeric",
                                                                                month: "short",
                                                                            })}
                                                                        </Chip>
                                                                    );
                                                                })}
                                                                {event.dates.length > 3 && (
                                                                    <Chip size="sm" variant="soft">
                                                                        +{event.dates.length - 3}
                                                                    </Chip>
                                                                )}
                                                            </div>
                                                        )}
                                                        <p className="text-sm line-clamp-2 text-foreground-700">
                                                            {event.caption || "Sin descripción"}
                                                        </p>
                                                    </div>
                                                </CardBody>
                                                <CardFooter className="flex gap-2 pt-0 px-3 pb-3">
                                                    <Button
                                                        size="sm"
                                                        color="accent"
                                                        className="rounded-2xl flex-1 font-medium"
                                                        onPress={() => handlePublish(event.shortCode)}
                                                    >
                                                        Publicar
                                                    </Button>
                                                    <Tooltip content="Editar antes de publicar">
                                                        <Button
                                                            size="sm"
                                                            isIconOnly
                                                            variant="tertiary"
                                                            className="rounded-2xl"
                                                            onPress={() => handleEdit(event.shortCode)}
                                                        >
                                                            <EditIcon size={16} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Descartar">
                                                        <Button
                                                            size="sm"
                                                            isIconOnly
                                                            variant="tertiary"
                                                            color="danger"
                                                            className="rounded-2xl"
                                                            onPress={() => handleDismiss(event.shortCode)}
                                                        >
                                                            <TrashIcon size={16} />
                                                        </Button>
                                                    </Tooltip>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Existing published posts */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Tus publicaciones</h3>
                        {!loadingPosts && posts.length > 0 && (
                            <Chip size="sm" variant="soft">
                                {publishedCount}
                            </Chip>
                        )}
                    </div>
                </div>

                {loadingPosts ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" color="accent" />
                    </div>
                ) : posts.length > 0 ? (
                    <PortalWall cardsData={posts} onPostUpdated={refreshPosts} readOnly={readOnly} />
                ) : (
                    <Card className="rounded-3xl bg-content1 dark:bg-content2" shadow="none">
                        <CardBody className="flex flex-col justify-center items-center py-16 gap-3">
                            <div className="rounded-2xl bg-default-100 dark:bg-default-50 p-4">
                                <SadIcon size={36} className="text-foreground/40" />
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center px-6">
                                <p className="font-medium">Aún no tienes publicaciones</p>
                                <p className="text-sm text-foreground-500">
                                    Crea tu primera publicación para que aparezca en la cartelera.
                                </p>
                            </div>
                            {!readOnly && (
                            <Button
                                className="rounded-2xl mt-2"
                                color="accent"
                                variant="tertiary"
                                onPress={() => navigate(`/publicar`)}
                            >
                                Crear publicación
                            </Button>
                            )}
                        </CardBody>
                    </Card>
                )}
            </section>
        </PortalLayout>
    );
};
