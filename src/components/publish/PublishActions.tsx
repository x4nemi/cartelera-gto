import { Button } from "@heroui/react";

interface PublishActionsProps {
	onCancel: () => void;
	onPublish: () => void;
}

export const PublishActions = ({ onCancel, onPublish }: PublishActionsProps) => {
	return (
		<div className="flex w-full justify-end gap-2 mt-3">
			<Button size="lg" color="danger" variant="bordered" onPress={onCancel}>
				Cancelar
			</Button>
			<Button size="lg" color="primary" variant="solid" onPress={onPublish}>
				Crear evento
			</Button>
		</div>
	);
};
