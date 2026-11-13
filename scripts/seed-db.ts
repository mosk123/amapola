/**
 * Carga los productos de src/lib/test-products.ts en Supabase.
 *
 *   npm run db:seed              → carga solo los productos que todavía NO están en la base
 *   npm run db:seed -- --force   → borra y vuelve a cargar TODO (¡pierde las prendas marcadas vendidas!)
 *   npm run db:seed -- --dry     → solo muestra lo que cargaría, sin tocar la base
 *
 * Necesita en .env.local: SUPABASE_URL y SUPABASE_SECRET_KEY.
 * Las fotos tienen que estar subidas a Cloudinary (amapola/productos/<carpeta>/).
 */
import { TEST_PRODUCTS } from "../src/lib/test-products";
import { cld } from "../src/lib/cloudinary";
import type { MeasureTable, Product } from "../src/types";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;
const DRY = process.argv.includes("--dry");
if (!DRY && (!URL || !KEY)) {
  console.error("Faltan SUPABASE_URL y/o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}
const FORCE = process.argv.includes("--force");

async function rest(method: string, path: string, body?: unknown, prefer = "return=minimal") {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers: { apikey: KEY!, "Content-Type": "application/json", Prefer: prefer },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json().catch(() => null);
}

/** "Remera" → "remera" (id de la guía de talles) */
const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CLD_PREFIX = cld("");
const imgPath = (url: string) => url.replace(CLD_PREFIX, "");
const guideId = (t: MeasureTable) => slug(t.title ?? "guia");

function rows(p: Product, position: number) {
  const id = p.id;
  const product = {
    id, name: p.name, category: p.cat, price: p.price, colors: p.colors, sizes: p.sizes,
    size_guides: (p.measures ?? []).map(guideId),
    composition: p.composition ?? null, fiber: p.fiber, short_desc: p.short, description: p.desc,
    badge: p.badge ?? null, visible: !p.hidden, position,
  };

  const variants: Record<string, unknown>[] = [];
  for (const color of p.colors) {
    const sold = !!p.soldOut?.includes(color);
    const price = p.priceByColor?.[color] ?? null;
    const status = sold ? "vendida" : "disponible";
    const pieces = p.pieces?.[color];
    if (pieces) {
      variants.push({ product_id: id, color, size: null, pieces, price, status });
      continue;
    }
    const sizes = p.stock ? (p.stock[color] ?? p.stock.default ?? []) : p.sizes;
    for (const size of sizes) variants.push({ product_id: id, color, size, pieces: null, price, status });
  }

  const images: Record<string, unknown>[] = [];
  const cover = p.cover ? (Array.isArray(p.cover) ? p.cover : [p.cover]) : [];
  cover.forEach((u, i) => images.push({ product_id: id, color: null, path: imgPath(u), position: i }));
  for (const [color, list] of Object.entries(p.gallery ?? {})) {
    (list ?? []).forEach((u, i) => images.push({ product_id: id, color, path: imgPath(u), position: i }));
  }

  return { product, variants, images };
}

async function main() {
  if (DRY) {
    for (const [i, p] of TEST_PRODUCTS.entries()) {
      const { product, variants, images } = rows(p, i);
      console.log(`${product.id}: ${variants.map((v) => `${v.color} ${v.size ?? (v.pieces as { size: string }[]).map((x) => x.size).join("+")} ${v.status}${v.price ? " $" + v.price : ""}`).join(" | ")} · ${images.length} fotos`);
    }
    return;
  }
  // Guías de talles (siempre se actualizan: son solo medidas)
  const guides = new Map<string, MeasureTable>();
  for (const p of TEST_PRODUCTS) for (const t of p.measures ?? []) guides.set(guideId(t), t);
  await rest("POST", "size_guides?on_conflict=id", [...guides].map(([id, t]) => ({
    id, title: t.title ?? "", shape: t.shape, rows: t.rows,
  })), "resolution=merge-duplicates,return=minimal");
  console.log(`Guías de talles: ${guides.size}`);

  const existing = new Set(((await rest("GET", "products?select=id", undefined, "")) as { id: string }[]).map((r) => r.id));

  let loaded = 0;
  for (const [i, p] of TEST_PRODUCTS.entries()) {
    const { product, variants, images } = rows(p, i);
    if (existing.has(product.id)) {
      if (!FORCE) { console.log(`  = ${product.name} (ya estaba, no se toca)`); continue; }
      await rest("DELETE", `products?id=eq.${encodeURIComponent(product.id)}`); // borra variantes y fotos en cascada
    }
    await rest("POST", "products", product);
    if (variants.length) await rest("POST", "product_variants", variants);
    if (images.length) await rest("POST", "product_images", images);
    console.log(`  + ${product.name}: ${variants.length} prendas, ${images.length} fotos`);
    loaded++;
  }
  console.log(`Listo: ${loaded} producto(s) cargado(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
