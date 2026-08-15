// data.jsx — catálogo de Amapola (datos de ejemplo)
const CATEGORIES = [
  { id: "sweaters", label: "Sweaters", blurb: "Trenzas, ochos y puntos de toda la vida." },
  { id: "accesorios", label: "Accesorios", blurb: "Medias, guantes, gorros y cuellos." },
  { id: "mantas", label: "Mantas", blurb: "Para el sillón, la cuna y las siestas." },
];

const COLORS = {
  arena:     { label: "Arena",     hex: "#E3D2C0" },
  salvia:    { label: "Salvia",    hex: "#A9B79A" },
  terracota: { label: "Terracota", hex: "#CE8C66" },
  trigo:     { label: "Trigo",     hex: "#D8B98A" },
  rosa:      { label: "Rosa té",   hex: "#E3C4BB" },
  crudo:     { label: "Crudo",     hex: "#EDE6DA" },
  musgo:     { label: "Musgo",     hex: "#7E8E69" },
};

const PRODUCTS = [
  {
    id: "sweater-otono", name: "Sweater Otoño", cat: "sweaters", audience: "Mujer",
    price: 42000, colors: ["arena", "salvia", "terracota"], sizes: ["XS","S","M","L","XL"],
    badge: "Más vendido", fiber: "Lana merino",
    short: "Punto trenza grueso, cuello redondo y caída holgada.",
    desc: "Tejido en punto trenza con lana merino hilada en la sierra. Abriga sin pesar y se ablanda con cada lavado. Cada pieza lleva entre dos y tres semanas de trabajo en dos agujas.",
  },
  {
    id: "cardigan-amapola", name: "Cardigan Amapola", cat: "sweaters", audience: "Mujer",
    price: 48000, colors: ["rosa", "arena", "musgo"], sizes: ["S","M","L"],
    badge: "Nuevo", fiber: "Lana + alpaca",
    short: "Saco abierto con botones de coco y bolsillos.",
    desc: "Nuestro clásico: saco abierto de lana y alpaca, con botones de coco cosidos a mano y dos bolsillos al frente. El que te ponés apenas refresca y no te querés sacar.",
  },
  {
    id: "pullover-trigo", name: "Pullover Trigo", cat: "sweaters", audience: "Mujer",
    price: 39000, colors: ["trigo", "crudo", "salvia"], sizes: ["XS","S","M","L"],
    fiber: "Algodón orgánico",
    short: "Punto liviano de media estación, cuello alto suave.",
    desc: "Pensado para el entretiempo: algodón orgánico en punto liviano, cuello alto que no aprieta. Va igual de bien con jean que con un vestido largo.",
  },
  {
    id: "sweater-nube", name: "Sweater Nube", cat: "sweaters", audience: "Niños",
    price: 26000, colors: ["crudo", "salvia", "rosa"], sizes: ["2","4","6","8"],
    fiber: "Algodón pima",
    short: "Para peques: suave, sin etiquetas que molesten.",
    desc: "Algodón pima bien suave, sin costuras ásperas ni etiquetas que pican. Tejido pensado para que el abrigo de los más chicos sea un mimo, no una pelea.",
  },
  {
    id: "medias-lana", name: "Medias Lana Cruda", cat: "accesorios", audience: "Unisex",
    price: 9500, colors: ["crudo", "musgo", "terracota"], sizes: ["35-38","39-42"],
    badge: "Más vendido", fiber: "Lana cruda",
    short: "Medias gruesas de invierno, puño acanalado.",
    desc: "Las medias de invierno que faltaban: lana cruda gruesa, puño acanalado que no se cae y talón reforzado. Para andar por casa o meter en la bota.",
  },
  {
    id: "guantes-hoja", name: "Guantes Hoja", cat: "accesorios", audience: "Mujer",
    price: 12000, colors: ["salvia", "arena", "rosa"], sizes: ["Único"],
    fiber: "Lana merino",
    short: "Mitones con detalle de hoja tejido al dorso.",
    desc: "Mitones que dejan los dedos libres, con un dibujo de hoja tejido al dorso. Lana merino que no raspa, para el celular, el mate y las manos frías.",
  },
  {
    id: "gorro-pompon", name: "Gorro Pompón", cat: "accesorios", audience: "Niños",
    price: 11000, colors: ["rosa", "salvia", "trigo"], sizes: ["1-3","4-7"],
    fiber: "Lana + algodón",
    short: "Gorro con pompón desmontable y orejeras.",
    desc: "Gorro con orejeras y un pompón bien grande que se puede sacar para lavar. Tejido en lana con algodón para que abrigue sin picar la frente.",
  },
  {
    id: "cuello-salvia", name: "Cuello Salvia", cat: "accesorios", audience: "Mujer",
    price: 14500, colors: ["salvia", "musgo", "arena"], sizes: ["Único"],
    fiber: "Lana merino",
    short: "Cuello infinito de punto inglés, doble vuelta.",
    desc: "Cuello infinito en punto inglés, lo bastante largo para dar dos vueltas. Reemplaza a la bufanda y no se desarma cuando te sacás el abrigo.",
  },
  {
    id: "manta-telar", name: "Manta Telar", cat: "mantas", audience: "Hogar",
    price: 68000, colors: ["arena", "terracota", "musgo"], sizes: ["1,40 × 1,80 m"],
    badge: "Edición limitada", fiber: "Lana de oveja",
    short: "Manta grande de telar, flecos anudados a mano.",
    desc: "Tejida en telar con lana de oveja sin teñir y teñidos naturales. Flecos anudados uno por uno. Es la manta que queda sobre el respaldo del sillón todo el invierno.",
  },
  {
    id: "manta-bebe", name: "Manta Bebé Nube", cat: "mantas", audience: "Niños",
    price: 34000, colors: ["crudo", "rosa", "salvia"], sizes: ["80 × 90 cm"],
    fiber: "Algodón pima",
    short: "Mantita de cuna en punto nube, súper liviana.",
    desc: "Punto nube en algodón pima, liviana y transpirable para la cuna o el cochecito. Tamaño justo para envolver sin que sobre. Un regalo de nacimiento que dura.",
  },
  {
    id: "throw-cosecha", name: "Throw Cosecha", cat: "mantas", audience: "Hogar",
    price: 58000, colors: ["trigo", "terracota", "arena"], sizes: ["1,20 × 1,60 m"],
    fiber: "Lana + algodón",
    short: "Manta de sillón en bloques de color cosecha.",
    desc: "Bloques de color en tonos de cosecha —trigo, terracota, arena— tejidos en lana y algodón. Da calidez a un sillón neutro sin tapar el resto de la casa.",
  },
];

Object.assign(window, { CATEGORIES, COLORS, PRODUCTS });
