import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, Card } from "@heroui/react";

export default function DocsPage() {

	const faqs = [
		{
			question: "¿Cuánto cuesta publicar un evento?",
			answer: "Publicar un evento en nuestra plataforma es completamente gratuito. No hay ningún costo asociado con la creación o publicación de eventos."
		},
		{
			question: "¿Puedo editar o eliminar mi evento después de publicarlo?",
			answer: "Sí, puedes editar o eliminar tu evento en cualquier momento. Simplemente ve a tu perfil, selecciona el evento que deseas modificar y elige la opción de editar o eliminar."
		},
		{
			question: "¿Cuánto tiempo tarda en aprobarse mi evento?",
			answer: "Nuestro equipo revisa cada evento para asegurarse de que cumpla con nuestras pautas. El proceso de aprobación generalmente toma entre 1h a 8h, pero puede variar dependiendo de la cantidad de eventos en revisión."
		},
		{
			question: "¿Puedo publicar eventos que no estén relacionados con Guanajuato?",
			answer: "Nuestra plataforma está enfocada en eventos relacionados con Guanajuato capital. Por lo tanto, solo se permiten eventos que tengan lugar en esta área o que estén directamente relacionados con la comunidad local."
		},
		{
			question: "Quiero donar, ¿cómo puedo apoyar a Cartelera Cuévano?",
			answer: "Puedes donar a través de PayPal: <a href='https://www.paypal.com/donate/?hosted_button_id=C42HWJ5ZQW3WN' target='_blank' style='color: #007bff;'>Donar ahora</a>. Tu apoyo nos ayuda a mantener la plataforma y seguir promoviendo eventos locales en Guanajuato."
		},
		{
			question: "Créditos de fotos usadas en la plataforma",
			answer: "Pérfil de Flickr <a href='https://www.flickr.com/photos/anthonysurace/' target='_blank' style='color: #007bff;'>Anthony Surace</a>."
		}, 
		{
			question: "¿Cómo puedo contactar al equipo de Cartelera Cuévano?",
			answer: "Puedes contactarnos a tráves de nuestro Instagram oficial: <a href='https://www.instagram.com/carteleracuevense/' target='_blank' style='color: #007bff;'>@carteleracuevanense</a>. Estamos disponibles para responder tus preguntas y recibir tus comentarios."
		}
	];
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full max-md:mx-7">
				<div className="inline-block text-center justify-center">
					<h1 className={title()}>¿Tienes preguntas?</h1>
					<div className="rounded-3xl bg-content1/50 backdrop-blur-sm p-5 w-max-3xl md:w-3xl border-none border-default mt-2" >
						<Accordion variant="splitted" itemClasses={{base:"mb-2 shadow-none"}}  className="border-none">
							{faqs.map((faq, index) => (
								<AccordionItem key={index} title={faq.question}>
									<p className="text-start text-default-500" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
