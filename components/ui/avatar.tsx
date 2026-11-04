import { Bot } from "lucide-react";
import { cn } from "@/lib/cn";

type Size = "xs" | "sm" | "md" | "lg";

const boxSize: Record<Size, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

const iconSize: Record<Size, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface AvatarProps {
  name: string;
  /** "agent" shows a bot icon in a rounded square so AI team members are easy to tell apart from people. */
  variant?: "human" | "agent";
  src?: string;
  size?: Size;
  className?: string;
}

export function Avatar({ name, variant = "human", src, size = "md", className }: AvatarProps) {
  if (variant === "agent") {
    return (
      <span
        role="img"
        aria-label={`${name}, AI team member`}
        className={cn("grid shrink-0 place-items-center rounded-lg bg-primary-soft text-primary", boxSize[size], className)}
      >
        <Bot className={iconSize[size]} aria-hidden />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-muted font-semibold text-text-muted",
        boxSize[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}

interface AvatarGroupProps {
  people: { name: string; variant?: "human" | "agent"; src?: string }[];
  max?: number;
  size?: Size;
}

/** Overlapping avatars with a "+N" overflow. */
export function AvatarGroup({ people, max = 3, size = "sm" }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <Avatar key={`${p.name}-${i}`} {...p} size={size} className={cn("ring-2 ring-surface", i > 0 && "-ml-2")} />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "-ml-2 grid place-items-center rounded-full bg-surface-muted font-medium text-text-muted ring-2 ring-surface",
            boxSize[size],
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}