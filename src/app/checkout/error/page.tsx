import ResultPage from "../ResultPage";

interface Props {
  searchParams: Promise<{ payment_id?: string }>;
}

export default async function CheckoutErrorPage({ searchParams }: Props) {
  const { payment_id } = await searchParams;
  return (
    <ResultPage
      icon="close"
      eyebrow="Pago rechazado"
      title="Algo no salió bien"
      message="No pudimos procesar el pago. Podés intentar de nuevo o probar con otro medio de pago."
      paymentId={payment_id}
      accentColor="var(--brand-berry)"
    />
  );
}
