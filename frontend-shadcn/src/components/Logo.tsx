import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  // "light" is for dark backgrounds such as the footer
  tone?: "dark" | "light";
  className?: string;
};

function Logo({ tone = "dark", className }: LogoProps) {
  const imageUrl =
    tone === "light" ? (site.logoLightUrl ?? site.logoUrl) : site.logoUrl;

  return (
    <Link
      to="/"
      aria-label={`${site.name} ${site.suffix} home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-9 w-auto" />
      ) : (
        <span
          aria-hidden
          className={cn(
            "flex size-9 items-center justify-center rounded-xl font-heading text-lg font-semibold transition-transform group-hover:-rotate-6",
            tone === "dark" ? "bg-primary text-sand" : "bg-sand text-primary",
          )}
        >
          {site.name.charAt(0)}
        </span>
      )}
      {/* <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-semibold tracking-tight">
          {site.name}
        </span>
        <span
          className={cn(
            "text-[0.65rem] font-medium tracking-[0.22em] uppercase",
            tone === "dark" ? "text-sand-deep" : "text-sand",
          )} */}
      {/* > */}
      {/* {site.suffix}
        </span> */}
      {/* </span> */}
    </Link>
  );
}

export default Logo;
