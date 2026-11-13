/**
 * Se vuelve a montar en cada navegación: la página nueva entra con un fundido suave.
 * Solo opacidad (sin transform) para no romper elementos fixed/sticky de las páginas.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
