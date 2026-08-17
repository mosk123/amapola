import ResultPage from "../ResultPage";

interface Props {
  searchParams: Promise<{ payment_id?: string }>;
}

export default async function CheckoutExitoPage({ searchParams }: Props) {
  const { payment_id } = await searchParams;
  return (
    <ResultPage
      icon="check"
      eyebrow="Pago aprobado"
      title="¡Gracias por tu compra!"
      message="Ya recibimos tu pago y en breve te va a llegar un email con los detalles del pedido."
      paymentId={payment_id}
    />
  );
}
