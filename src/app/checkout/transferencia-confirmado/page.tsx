import ResultPage from "../ResultPage";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function TransferenciaConfirmadoPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  return (
    <ResultPage
      icon="mail"
      eyebrow="Pedido registrado"
      title="¡Ya casi! Revisá tu email"
      message="Te mandamos un mail con el alias para transferir y el número de WhatsApp para el comprobante. Apenas lo recibamos, confirmamos tu pedido y coordinamos el envío."
      paymentId={orderId}
      accentColor="var(--brand-mustard)"
    />
  );
}
