import { Button } from "@/compat/heroui";

interface PublishActionsProps {
	onCancel: () => void;
	onPublish: () => void;
    isPublishing?: boolean;
}

export const PublishActions = ({ onCancel, onPublish, isPublishing }: PublishActionsProps) => {
	return (
		<div className="flex w-full justify-end gap-2 mt-3">
			<Button size="lg" color="danger" variant="secondary" onPress={onCancel} disabled={isPublishing}>
				Cancelar
			</Button>
			<Button size="lg" color="accent" variant="primary" onPress={onPublish} isLoading={isPublishing}>
				Crear evento
			</Button>
		</div>
	);
};
