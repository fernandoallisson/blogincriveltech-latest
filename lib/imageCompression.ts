import imageCompression from 'browser-image-compression';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

export function isAllowedUploadImage(file: File) {
  return file.type.startsWith('image/') && ALLOWED_IMAGE_TYPES.has(file.type);
}

export async function compressUploadImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Falha ao processar imagem: o arquivo selecionado nao e uma imagem.');
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Falha ao processar imagem: formato nao suportado. Envie uma imagem JPG, PNG ou WebP.');
  }

  const compressed = await imageCompression(file, compressionOptions);
  const processedFile = new File([compressed], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });

  console.info(
    `[image-compression] ${file.name}: ${formatBytes(file.size)} -> ${formatBytes(processedFile.size)}`,
  );

  return processedFile;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
