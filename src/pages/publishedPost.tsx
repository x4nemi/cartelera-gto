import { ConfettiFilledIcon } from "@/components/icons"
import { CosmosAPI, PostData } from "@/config/apiClient"
import DefaultLayout from "@/layouts/default"
import { Alert, Button, Card, CardBody, CardFooter, Chip, Divider, ScrollShadow, Spinner, User } from "@heroui/react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ImageCarousel } from "@/components/image/imageCarousel"

export const PublishedPost = () => {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<PostData | null>(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const dates = post?.dates?.map(date => {
        const [y, m, d] = date.split("-").map(Number)
        return new Date(y, m - 1, d)
    }) ?? []

    useEffect(() => {
        if (!id) return
        CosmosAPI.getEvent(id)
            .then(setPost)
            .catch(err => {
                setPost(null);
            })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center w-full">
                    <Card className="bg-content1/70 p-5 backdrop-blur-md rounded-3xl" shadow="none">
                        <Spinner size="lg" color="primary" />
                    </Card>
                </div>
            </DefaultLayout>
        )
    }

    if (!post) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-64">
                    <p className="text-foreground-500">Publicación no encontrada</p>
                </div>
            </DefaultLayout>
        )
    }



    return (
        <DefaultLayout>
            <section className="flex flex-col md:flex-row mt-10 md:gap-4 gap-2 md:mx-auto items-center justify-center md:max-w-5xl w-full">
                <div className="md:w-1/2 md:max-w-lg gap-2 flex flex-col w-full justify-center h-full">
                    <Card className="rounded-3xl w-full" shadow="none">
                        <CardBody className="overflow-visible p-0">
                            <ImageCarousel images={post.images || []} className="md:max-h-[70vh] w-full" />
                        </CardBody>
                    </Card>
                    <Button className="rounded-3xl" fullWidth color="warning" variant="solid" size="lg" onPress={() => navigate(`/${post.ownerUsername}`)}>Regresar al portal</Button>
                </div>
                <div className="flex flex-col w-full md:w-1/2 md:max-w-lg">
                    <Alert title="Publicado con éxito" variant="flat" className="rounded-3xl rounded-b-none" color="primary" hideIcon startContent={<ConfettiFilledIcon size={24} />} />
                    <Card className="rounded-3xl rounded-t-none md:max-w-lg w-full bg-content1/80 backdrop-blur-lg" shadow="none">
                        <CardBody className="px-5">
                            {/* <Chip color="primary" variant="flat" radius="sm">{PostTypes[post.type as keyof typeof PostTypes] || post.type}</Chip> */}
                            <p className="font-semibold mb-1">Fechas</p>
                            {dates.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {dates.map((date, idx) => (
                                        <Chip key={idx} variant="flat" color="primary">
                                            {date.toLocaleDateString("es-MX", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </Chip>
                                    ))}
                                </div>
                            )}

                            <p className="font-semibold mt-3 mb-1">Descripción</p>
                            <ScrollShadow className="max-h-40">
                                <p className="text-foreground-600 italic whitespace-pre-line">
                                    {post.caption || "Sin descripción"}
                                </p>
                            </ScrollShadow>
                        </CardBody>
                        <Divider />
                        <CardFooter className="justify-center bg-content2" >
                            <User name={post.ownerFullName} description={`@${post.ownerUsername}`} avatarProps={{ src: post.ownerProfilePicUrl }} />
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </DefaultLayout>
    )
}
