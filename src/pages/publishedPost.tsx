import { CalendarIcon, ConfettiFilledIcon, MapPinIcon } from "@/components/icons";
import { ImageCarousel } from "@/components/image/imageCarousel";
import { CosmosAPI, PostData } from "@/config/apiClient";
import DefaultLayout from "@/layouts/default";
import { Card, Chip, ScrollShadow, Spinner } from "@heroui/react";
import { Button } from "@/compat/heroui";
import { CardBody, Divider, User } from "@/compat/heroui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PublishedPost = () => {
	const { id } = useParams<{ id: string }>();
	const [post, setPost] = useState<PostData | null>(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const dates =
		post?.dates?.map((date) => {
			const [y, m, d] = date.split("-").map(Number);
			return new Date(y, m - 1, d);
		}) ?? [];

	useEffect(() => {
		if (!id) return;
		CosmosAPI.getEvent(id)
			.then(setPost)
			.catch(() => setPost(null))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return (
			<DefaultLayout>
				<div className="flex justify-center items-center w-full py-20">
					<Spinner size="lg" color="accent" />
				</div>
			</DefaultLayout>
		);
	}

	if (!post) {
		return (
			<DefaultLayout>
				<div className="flex justify-center items-center h-64">
					<p className="text-foreground-500">Publicación no encontrada</p>
				</div>
			</DefaultLayout>
		);
	}

	const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
	const heroDateLabel =
		sortedDates.length === 0
			? null
			: sortedDates.length === 1
				? sortedDates[0].toLocaleDateString("es-MX", {
					weekday: "long",
					day: "numeric",
					month: "long",
				})
				: `${sortedDates.length} fechas · primera ${sortedDates[0].toLocaleDateString(
					"es-MX",
					{ day: "numeric", month: "short" },
				)}`;

	return (
		<DefaultLayout>
			<section className="flex flex-col gap-6 max-w-5xl w-full md:mx-auto px-2 mt-8 mb-8">
				{/* Celebration banner */}
				<div className="flex items-center gap-3 rounded-2xl border border-success-200/60 dark:border-success-800/40 bg-success-50/60 dark:bg-success-900/20 p-4">
					<div className="rounded-xl bg-success-100 dark:bg-success-900/40 p-2 shrink-0">
						<ConfettiFilledIcon size={22} className="text-success-600" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-success-700 dark:text-success-300">
							¡Publicado con éxito!
						</p>
						<p className="text-xs text-foreground-500 mt-0.5">
							Tu evento ya forma parte de la cartelera. Compártelo con tu comunidad.
						</p>
					</div>
				</div>

				{/* Two-column body */}
				<div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
					{/* LEFT — image */}
					<Card className="rounded-3xl overflow-hidden" shadow="sm">
						<CardBody className="p-0">
							<ImageCarousel
								images={post.images || []}
								className="w-full h-auto rounded-3xl bg-content3 object-contain"
							/>
						</CardBody>
					</Card>

					{/* RIGHT — details */}
					<Card className="rounded-3xl bg-content1/80 backdrop-blur-lg" shadow="sm">
						<CardBody className="p-5 flex flex-col gap-4">
							{/* Title + summary */}
							<div>
								{post.title && (
									<h1 className="text-2xl font-bold text-foreground leading-tight">
										{post.title}
									</h1>
								)}
								{post.summary && (
									<p className="text-sm text-foreground-600 mt-1 leading-relaxed">
										{post.summary}
									</p>
								)}
								{!post.title && !post.summary && (
									<p className="text-sm text-foreground-500 italic">
										Sin título ni resumen.
									</p>
								)}
							</div>

							{/* Quick facts row */}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-600">
								{heroDateLabel && (
									<span className="inline-flex items-center gap-1.5">
										<CalendarIcon size={16} className="text-foreground-500" />
										{heroDateLabel}
									</span>
								)}
								{post.location && (
									<span className="inline-flex items-center gap-1.5">
										<MapPinIcon size={16} className="text-foreground-500" />
										<span className="truncate max-w-[18rem]">
											{post.location}
										</span>
									</span>
								)}
								{post.price && (
									<span className="inline-flex items-center gap-1.5">
										<span aria-hidden>💵</span>
										{post.price}
									</span>
								)}
							</div>

							{post.tags && post.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{post.tags.map((tag) => (
										<Chip key={tag} size="sm" variant="soft">
											{tag}
										</Chip>
									))}
								</div>
							)}

							<Divider />

							{/* All dates */}
							{dates.length > 0 && (
								<div>
									<p className="text-xs font-semibold uppercase tracking-wide text-foreground-500 mb-2">
										Fechas
									</p>
									<div className="flex flex-wrap gap-1.5">
										{sortedDates.map((date, idx) => (
											<Chip key={idx} variant="soft" color="accent" size="sm">
												{date.toLocaleDateString("es-MX", {
													weekday: "short",
													day: "numeric",
													month: "short",
												})}
											</Chip>
										))}
									</div>
								</div>
							)}

							{/* Caption */}
							{post.caption && (
								<div>
									<p className="text-xs font-semibold uppercase tracking-wide text-foreground-500 mb-2">
										Publicación original
									</p>
									<ScrollShadow className="max-h-48">
										<p className="text-sm text-foreground-600 italic whitespace-pre-line">
											{post.caption}
										</p>
									</ScrollShadow>
								</div>
							)}

							<Divider />

							{/* Owner footer */}
							<User
								name={post.owner?.fullName || post.ownerUsername}
								description={`@${post.ownerUsername}`}
								avatarProps={{ src: post.owner?.profilePicUrl }}
								className="self-start"
							/>
						</CardBody>
					</Card>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
					<Button
						variant="secondary"
						size="lg"
						className="rounded-2xl"
						onPress={() => navigate(`/${post.ownerUsername}`)}
					>
						Regresar al portal
					</Button>
					<Button
						color="accent"
						size="lg"
						className="rounded-2xl"
						onPress={() => navigate(`/${post.ownerUsername}/publicar`)}
					>
						Publicar otro evento
					</Button>
				</div>
			</section>
		</DefaultLayout>
	);
};
