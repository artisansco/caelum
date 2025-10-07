import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";

export async function upload_file(file: File) {
	const upload_dir = "static/uploads";

	// Create uploads folder if it doesn't exist
	if (!existsSync(upload_dir)) {
		await mkdir(upload_dir, { recursive: true });
	}

	const ext = file.name.split(".").at(-1);
	const filename = `${nanoid()}.${ext}`;

	if (["png", "jpeg", "jpg"].includes(String(ext))) {
		await sharp(await file.arrayBuffer())
			.webp({ lossless: true })
			.toFile(`${upload_dir}/${filename}`);

		return filename;
	}

	await writeFile(
		`${upload_dir}/${filename}`,
		Buffer.from(await file.arrayBuffer()),
	);

	return filename;
}
