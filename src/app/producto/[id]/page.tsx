import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  return <ProductClient product={product} />;
}
