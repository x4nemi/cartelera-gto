
export const FileUploadButton = () => {
	return (
		<div className="mt-2 flex justify-center rounded-xl border border-dashed border-foreground/30 px-6 py-10">
			<div className="text-center">
				{/* <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-600" /> */}
				<div className="mt-4 flex text-sm/6 text-gray-400">
					<label
						htmlFor="file-upload"
						className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-300"
					>
						<span>Upload a file</span>
						<input id="file-upload" name="file-upload" type="file" className="sr-only" />
					</label>
					<p className="pl-1">or drag and drop</p>
				</div>
				<p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
			</div>
		</div>
	)
}
