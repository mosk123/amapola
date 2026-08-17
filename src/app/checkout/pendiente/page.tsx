import ResultPage from "../ResultPage";

interface Props {
  searchParams: Promise<{ payment_id?: string }>;
}

export default async function CheckoutPendientePage({ searchParams }: Props) {
  const { payment_id } = await searchParams;
  return (
    <ResultPage
      icon="clock"
      eyebrow="Pago pendiente"
      title="Tu pago está en revisión"
      message="Te vamos a avisar por email apenas se confirme — puede tardar unos minutos, o hasta un par de días si pagaste con efectivo."
      paymentId={payment_id}
      accentColor="var(--brand-mustard)"
    />
  );
}
