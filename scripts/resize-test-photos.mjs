// Genera copias livianas (1600px, JPG calidad 82) de las fotos de prueba.
//   Originales:  public/images/products/      (no se tocan)
//   Copias:      public/images/products-web/  (las que usa la web)
// Solo procesa las fotos nuevas o modificadas, y borra la caché de imágenes de Next. Uso:  node scripts/resize-test-photos.mjs
import { readdir, stat, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/images/products";
const OUT = "public/images/products-web";
const MAX = 1600;
let updated = 0;

for (const dir of await readdir(SRC)) {
  const srcDir = path.join(SRC, dir);
  if (!(await stat(srcDir)).isDirectory()) continue;
  await mkdir(path.join(OUT, dir), { recursive: true });

  for (const file of await readdir(srcDir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
    const from = path.join(srcDir, file);
    const to = path.join(OUT, dir, file.replace(/\.\w+$/, ".jpg"));
    const done = await stat(to).catch(() => null);
    const src = await stat(from);
    // birthtime cubre las fotos copiadas/reemplazadas, que conservan la fecha de modificación original
    if (done && done.mtimeMs >= Math.max(src.mtimeMs, src.birthtimeMs)) continue;

    await sharp(from).rotate().resize(MAX, MAX, { fit: "inside" }).jpeg({ quality: 82, mozjpeg: true }).toFile(to);
    console.log("✓", path.join(dir, file));
    updated++;
  }
}

// Next guarda las fotos ya optimizadas por URL: si una foto cambió con el mismo nombre,
// seguiría mostrando la vieja. Se borra la caché (en dev vive en .next/dev/cache).
if (updated > 0) {
  for (const dir of [".next/dev/cache/images", ".next/cache/images"]) {
    await rm(dir, { recursive: true, force: true });
  }
  console.log(`${updated} foto(s) actualizadas · caché de imágenes de Next borrada (recargá la página con Ctrl+F5)`);
} else {
  console.log("No hay fotos nuevas.");
}
