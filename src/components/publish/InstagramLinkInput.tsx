import { Input } from "@/compat/heroui";
import { Button } from "@/compat/heroui";
import { Ref } from "react";
import { CheckIcon, IgIcon } from "@/components/icons";

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
	// Once the link is validated, "pin" it: show a compact, read-only chip
	// instead of an editable input. Only the Cancel flow can revert it.
	if (isLinkValid) {
		return (
			<div className="flex flex-col gap-2">
				<label className="text-sm font-medium text-foreground">
					Link de la publicación
				</label>
				<div className="flex items-center gap-3 p-3 rounded-2xl bg-content1 border border-default-200">
					<div className="rounded-lg bg-content2 p-2 shrink-0">
						<IgIcon size={18} />
					</div>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-foreground-700 truncate flex-1 hover:underline"
						title={link}
					>
						{link}
					</a>
					<span
						className="inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-400 shrink-0"
						title="Link validado"
					>
						<CheckIcon size={14} />
						<span className="hidden sm:inline">Validado</span>
					</span>
				</div>
				<p className="text-xs text-foreground-500">
					Para cambiar el link, cancela y vuelve a empezar.
				</p>
			</div>
		);
	}

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
						inputWrapper: "h-12 rounded-r-none text-default-400",
					}}
					isClearable={!loading}
					onClear={() => {
						setIsValidateButtonClicked(false);
						setLink("");
					}}
					ref={inputRef}
				/>
				<Button
					color="accent"
					variant="tertiary"
					isLoading={loading}
					isDisabled={link.length === 0}
					onPress={() => onValidate(link)}
					className="min-w-24 h-12 rounded-l-none"
				>
					Validar
				</Button>
			</div>
			{isValidateButtonClicked && link.length > 0 && !loading && (
				<p className="text-xs text-danger">Link inválido. Inténtalo de nuevo.</p>
			)}
		</div>
	);
};
