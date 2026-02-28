import { useRequireUser } from "@/hooks/useRequireUser";
import { useUserPosts } from "@/hooks/useUserPosts";
import { PortalWall } from "@/components/portalWall";
import PortalLayout from "@/layouts/portal";
import { Avatar, Button, Card, CardBody, Divider, Link, Skeleton, Spinner } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";

export const Portal = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, loading: loadingUser } = useRequireUser(username);
    const { posts, loading: loadingPosts } = useUserPosts(username);

    const sidebar = (
        <div className="flex flex-col gap-4">
            {loadingUser ? (
                <div className="flex flex-col gap-3 items-center w-full">
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
                            <Button className="rounded-2xl" size="lg" color="primary" onPress={() => navigate(`/${username}/publicar`)} variant="flat">Crear publicación</Button>
                            <Divider />
                            <Button className="rounded-2xl" size="lg" color="danger" variant="flat">Eliminar perfil</Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );

    return (
        <PortalLayout sidebar={sidebar}>
            {loadingPosts ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : posts.length > 0 ? (
                <PortalWall cardsData={posts} />
            ) : (
                <div className="flex justify-center items-center py-20 text-foreground/50">
                    <p>Este usuario aún no tiene publicaciones.</p>
                </div>
            )}
        </PortalLayout>
    );
};
