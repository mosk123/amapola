import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import type { ColorKey } from "@/types";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string }>;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { color } = await searchParams;
  const product = getProductById(id);
  if (!product) notFound();
  // Color elegido en la card del catálogo (?color=salvia), si es válido para este producto
  const initialColor = product.colors.find((c) => c === color) as ColorKey | undefined;
  return <ProductClient key={product.id} product={product} initialColor={initialColor} />;
}
