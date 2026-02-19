import { Button, Input } from "@heroui/react";
import { Ref } from "react";

interface InstagramLinkInputProps {
	link: string;
	setLink: (link: string) => void;
	loading: boolean;
	isLinkValid: boolean;
	isValidateButtonClicked: boolean;
	setIsValidateButtonClicked: (clicked: boolean) => void;
	onValidate: (link: string) => void;
	inputRef: Ref<HTMLInputElement>;
}

export const InstagramLinkInput = ({
	link,
	setLink,
	loading,
	isLinkValid,
	isValidateButtonClicked,
	setIsValidateButtonClicked,
	onValidate,
	inputRef,
}: InstagramLinkInputProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor="instagram-link" className="text-sm font-medium text-foreground">
				Link de la publicación
			</label>
			<div className="flex">
				<Input
					id="instagram-link"
					placeholder="https://www.instagram.com/p/..."
					value={link}
					onChange={(e) => setLink(e.target.value)}
					classNames={{
						input: "text-sm",
						inputWrapper: `h-12 ${!isLinkValid ? "rounded-r-none text-default-400" : ""}`,
					}}
					isClearable={!isLinkValid && !loading}
					onClear={() => {
						setIsValidateButtonClicked(false);
						setLink("");
					}}
					ref={inputRef}
					readOnly={isLinkValid}
				/>
				{!isLinkValid && (
					<Button
						color="primary"
						variant="flat"
						isLoading={loading}
						isDisabled={link.length === 0}
						onPress={() => onValidate(link)}
						className="min-w-24 h-12 rounded-l-none"
					>
						Validar
					</Button>
				)}
			</div>
			{isValidateButtonClicked && link.length > 0 && !loading && !isLinkValid && (
				<p className="text-xs text-danger">Link inválido. Inténtalo de nuevo.</p>
			)}
		</div>
	);
};
