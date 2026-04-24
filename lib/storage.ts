import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type StoredFile = {
  publicUrl: string;
};

export async function saveUpload(file: File): Promise<StoredFile> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPEG, PNG, WEBP, or GIF images are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image exceeds 2MB size limit.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const detectedMime = detectImageMime(bytes);
  if (!detectedMime || detectedMime !== file.type) {
    throw new Error("Uploaded file content does not match an allowed image format.");
  }

  const ext = getExtension(detectedMime);
  const safeName = `${Date.now()}-${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const targetPath = path.join(uploadDir, safeName);
  await writeFile(targetPath, bytes);

  return { publicUrl: `/uploads/${safeName}` };
}

function getExtension(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

// Detect real MIME type from magic bytes so attackers can't upload
// arbitrary content disguised by the Content-Type header.
function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // GIF: "GIF87a" or "GIF89a"
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "image/gif";
  }

  // WEBP: "RIFF"...."WEBP"
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}
