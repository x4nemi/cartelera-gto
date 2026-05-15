import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import type { AIVerdict } from "@/components/publish";

interface AIReviewGateModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	verdict: AIVerdict | null;
	isSubmitting: boolean;
	onSubmitForReview: () => void;
}

/**
 * Shown when the AI thinks the post may not be an event. The user can either
 * cancel or submit to admin review (post lands as `status: "pending"`).
 */
export const AIReviewGateModal = ({
	isOpen,
	onOpenChange,
	verdict,
	isSubmitting,
	onSubmitForReview,
}: AIReviewGateModalProps) => {
	const confidencePct = verdict ? Math.round(verdict.confidence * 100) : 0;
	const reason =
		verdict?.reason ||
		"La IA no logró identificar fechas, lugar u otros detalles típicos de un evento.";

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			backdrop="blur"
			isDismissable={!isSubmitting}
			hideCloseButton={isSubmitting}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<span className="text-lg font-semibold">
								Parece que esta publicación no es un evento
							</span>
							<span className="text-tiny text-default-500 font-normal">
								Confianza de la IA: {confidencePct}%
							</span>
						</ModalHeader>
						<ModalBody>
							<div className="flex flex-col gap-3">
								<div className="rounded-2xl bg-warning-50 dark:bg-warning-100/20 border border-warning-200 dark:border-warning-100/30 p-3">
									<p className="text-small text-warning-800 dark:text-warning-300 leading-snug">
										{reason}
									</p>
								</div>
								<p className="text-small text-default-600 leading-snug">
									Aún puedes publicarla, pero un administrador deberá aprobarla antes
									de que aparezca en la cartelera.
								</p>
								{verdict?.isEvent === false && (
									<div className="flex flex-wrap gap-1.5">
										<Chip size="sm" variant="flat" color="warning" className="rounded-lg">
											La IA cree que no es un evento
										</Chip>
									</div>
								)}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="light"
								onPress={onClose}
								isDisabled={isSubmitting}
							>
								Cancelar
							</Button>
							<Button
								color="primary"
								onPress={onSubmitForReview}
								isLoading={isSubmitting}
								className="rounded-2xl"
							>
								Enviar a revisión
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
