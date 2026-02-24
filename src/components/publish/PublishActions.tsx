import { Button } from "@heroui/react";

interface PublishActionsProps {
	onCancel: () => void;
	onPublish: () => void;
    isPublishing?: boolean;
}

export const PublishActions = ({ onCancel, onPublish, isPublishing }: PublishActionsProps) => {
	return (
		<div className="flex w-full justify-end gap-2 mt-3">
			<Button size="lg" color="danger" variant="bordered" onPress={onCancel} disabled={isPublishing}>
				Cancelar
			</Button>
			<Button size="lg" color="primary" variant="solid" onPress={onPublish} isLoading={isPublishing}>
				Crear evento
			</Button>
		</div>
	);
};
