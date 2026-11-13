/**
 * Fotos de productos en Cloudinary (cuenta ddtqy6ltq, carpeta amapola/productos/<carpeta>/).
 * El cloud name no es secreto: aparece en todas las URLs públicas de las fotos.
 */
export const CLOUDINARY_CLOUD = "ddtqy6ltq";
const UPLOAD_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`;

/** cld("body/body-1") → URL de la foto amapola/productos/body/body-1 */
export const cld = (path: string) => `${UPLOAD_BASE}/amapola/productos/${path}`;

export const isCloudinary = (src: string) => src.startsWith(UPLOAD_BASE);

/**
 * Loader de next/image: Cloudinary entrega la foto ya achicada al ancho pedido
 * y en el mejor formato del navegador (webp/avif), sin usar el servidor propio.
 */
export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return src.replace(UPLOAD_BASE, `${UPLOAD_BASE}/f_auto,q_${quality ?? "auto"},c_limit,w_${width}`);
}
