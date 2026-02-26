import { BalloonFilledIcon, ConfettiFilledIcon } from "@/components/icons"
import { CosmosAPI, PostData } from "@/config/apiClient"
import DefaultLayout from "@/layouts/default"
import { Alert, Button, Calendar, Card, CardBody, CardFooter, Chip, Divider, Spinner, User } from "@heroui/react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DateValue, CalendarDate, startOfMonth, endOfMonth } from "@internationalized/date"
import { ImageCarousel } from "@/components/imageCarousel"

const PostTypes = {
    event: "Evento",
    workshop: "Taller",
    calendar: "Calendario",
    draft: "Borrador"
}

export const PublishedPost = () => {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<PostData | null>(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const dates = post?.dates?.map(date => {
        const d = new Date(date)
        return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
    })

    const singleMonth = dates && dates.length > 0
        && dates[0].month === dates[dates.length - 1].month
        && dates[0].year === dates[dates.length - 1].year

    useEffect(() => {
        if (!id) return
        CosmosAPI.getEvent(id)
            .then(setPost)
            .catch(console.error)
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
            <section className="flex flex-col md:flex-row mt-10 md:gap-3 gap-1 md:mx-auto px-2 mx-4 items-stretch md:items-center">
                <Card className="rounded-3xl w-full md:w-auto" shadow="none">
                    <CardBody className="overflow-visible p-0">
                        <ImageCarousel images={post.images || []} className="max-h-[70vh]" />
                    </CardBody>
                </Card>
                <div className="flex flex-col md:gap-3 gap-1 justify-center w-full md:w-auto">
                    <div>
                        <Alert title="Publicado con éxito" variant="flat" className="rounded-3xl rounded-b-none" color="primary" hideIcon startContent={<ConfettiFilledIcon size={24} />} />
                        <Card className="rounded-3xl rounded-t-none md:max-w-xs w-full bg-content1/80 backdrop-blur-lg" shadow="none">
                            <CardBody className="p-5">
                                <Chip color="primary" variant="flat" radius="sm">{PostTypes[post.type as keyof typeof PostTypes] || post.type}</Chip>
                                <p className="font-semibold mt-3 mb-1">Fechas</p>
                                {dates && dates.length > 0 && (
                                    <Calendar
                                        isReadOnly
                                        defaultValue={dates[0]}
                                        minValue={startOfMonth(dates[0])}
                                        maxValue={endOfMonth(dates[dates.length - 1])}
                                        isDateUnavailable={(date: DateValue) => !dates.some(d => d.compare(date) === 0)}
                                        className="self-center"
                                        showShadow={false}
                                        aria-label="Fechas"
                                        classNames={{
                                            cellButton: [
                                                "data-[unavailable=true]:!text-foreground",
                                                "data-[unavailable=true]:!no-underline",
                                                "[&:not([data-unavailable])]:bg-primary",
                                                "[&:not([data-unavailable])]:text-primary-foreground",
                                            ].join(" "),
                                            ...(singleMonth && {
                                                prevButton: "hidden",
                                                nextButton: "hidden",
                                            })
                                        }}
                                    />
                                )}

                                <p className="font-semibold mt-3 mb-1">Descripción</p>
                                <p className="text-foreground-600 italic">
                                    {post.caption || "Sin descripción"}
                                </p>
                            </CardBody>
                            <Divider />
                            <CardFooter className="justify-center bg-content2" >
                                <User name={post.ownerFullName} description={post.ownerUsername} avatarProps={{ src: post.ownerProfilePicUrl }} />
                            </CardFooter>
                        </Card>
                    </div>
                    <Button className="rounded-3xl" color="warning" variant="solid" size="lg" onPress={() => navigate("/")}>Regresar</Button>
                </div>
            </section>
        </DefaultLayout>
    )
}
