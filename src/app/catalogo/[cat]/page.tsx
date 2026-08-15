import CatalogClient from "../CatalogClient";

interface Props {
  params: Promise<{ cat: string }>;
}

export default async function CatalogCatPage({ params }: Props) {
  const { cat } = await params;
  return <CatalogClient initialCat={cat} />;
}
