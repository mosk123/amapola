"use client";

type IconName =
  | "cart" | "search" | "menu" | "close" | "heart" | "arrow" | "back"
  | "plus" | "minus" | "check" | "star" | "leaf" | "truck" | "hand"
  | "mail" | "pin" | "chat" | "instagram" | "clock" | "droplet"
  | "sun" | "air" | "box" | "sparkle";

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
}

export default function Icon({ name, size = 20, stroke = 1.6, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { display: "block", flexShrink: 0 },
    className,
  };

  const paths: Record<IconName, React.ReactNode> = {
    cart: <><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.1 11.2a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.6-1.3L21 7H5.5"/></>,
    search: <><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.8-3.8"/></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    close: <><path d="M5 5l14 14M19 5L5 19"/></>,
    heart: <path d="M12 20s-7-4.6-9.2-9C1.3 8.2 2.6 5 5.8 5c2 0 3.2 1.3 4.2 2.6C11 6.3 12.2 5 14.2 5 17.4 5 18.7 8.2 17.2 11 15 15.4 12 20 12 20z"/>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    back: <path d="M19 12H5M11 6l-6 6 6 6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    check: <path d="M5 12.5l4.5 4.5L19 6"/>,
    star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>,
    leaf: <><path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14"/><path d="M4 20c4-6 8-8 12-9"/></>,
    truck: <><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></>,
    hand: <><path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V4.5a1.5 1.5 0 0 1 3 0V10m0-.5V6a1.5 1.5 0 0 1 3 0v6c0 4-2.5 7-6 7s-6-2-6-6v-1.5a1.5 1.5 0 0 1 3 0V12"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></>,
    pin: <><path d="M12 21s-6.5-5.4-6.5-10.5A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.4"/></>,
    chat: <><path d="M4 5h16v11H9l-4 4z"/><path d="M8 9.5h8M8 12.5h5"/></>,
    instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor"/></>,
    clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
    droplet: <path d="M12 3.5c3 4 5.5 6.8 5.5 9.8A5.5 5.5 0 0 1 12 19a5.5 5.5 0 0 1-5.5-5.7c0-3 2.5-5.8 5.5-9.8z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19"/></>,
    air: <><path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9a2.5 2.5 0 1 1-2.5 2.5"/></>,
    box: <><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/></>,
    sparkle: <path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
