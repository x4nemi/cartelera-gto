import { useRequireUser } from "@/hooks/useRequireUser";
import { useUserPosts } from "@/hooks/useUserPosts";
import { Wall } from "@/components/pinterestWall";
import DefaultLayout from "@/layouts/default";
import { Avatar, Button, Card, CardBody, Divider, Link, Skeleton, Spinner } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";

export const Portal = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, loading: loadingUser } = useRequireUser(username);
    const { posts, loading: loadingPosts } = useUserPosts(username);

    return (
        <DefaultLayout>
            <section className="flex flex-col md:flex-row w-full gap-6 py-6">
                {/* Left Sidebar - User Info */}
                <aside className="md:w-80 max-md:mx-10  shrink-0 md:sticky md:top-20 md:self-start">
                    <Card shadow="none" className="rounded-3xl bg-content2/70 backdrop-blur-md">
                        <CardBody className="flex flex-col items-center gap-4 p-6">
                            {loadingUser ? (
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <Skeleton className="rounded-full w-24 h-24" />
                                    <Skeleton className="h-5 w-40 rounded-lg" />
                                    <Skeleton className="h-4 w-32 rounded-lg" />
                                    <Skeleton className="h-16 w-full rounded-lg mt-2" />
                                </div>
                            ) : user && (
                                <>
                                    <Avatar
                                        src={user.profilePicUrl || "/default-avatar.png"}
                                        className="w-24 h-24"
                                        color="primary"
                                    />
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        {user.fullName && (
                                            <h2 className="text-lg font-bold">{user.fullName}</h2>
                                        )}
                                        <Link
                                            isExternal
                                            href={`https://instagram.com/${user.username}`}
                                            size="sm"
                                            className="font-semibold text-primary"
                                        >
                                            @{user.username}
                                        </Link>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Button className="rounded-2xl" size="lg" color="primary" onPress={() => navigate(`/${username}/publicar`)} variant="flat">Crear publicación</Button>
                                        <Divider />
                                        <Button className="rounded-2xl" size="lg" color="danger" variant="flat">Eliminar perfil</Button>
                                    </div>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </aside>

                {/* Right Content - Posts Wall */}
                <div className="flex-1 min-w-0">
                    {loadingPosts ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner size="lg" color="primary" />
                        </div>
                    ) : posts.length > 0 ? (
                        <Wall cardsData={posts} />
                    ) : (
                        <div className="flex justify-center items-center py-20 text-foreground/50">
                            <p>Este usuario aún no tiene publicaciones.</p>
                        </div>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
};
