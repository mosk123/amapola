/**
 * Se ejecuta una vez al arrancar el servidor. Libera las reservas por transferencia
 * vencidas al inicio y cada 10 minutos (además de cuando alguien carga el catálogo).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { releaseExpiredReservations } = await import("@/lib/catalog");

  const run = () =>
    releaseExpiredReservations().catch((err) =>
      console.error("[reservas] No se pudieron liberar las reservas vencidas:", err),
    );

  void run();
  setInterval(run, 10 * 60 * 1000).unref();
}
