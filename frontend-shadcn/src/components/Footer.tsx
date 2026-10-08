import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { site } from "@/config/site";
import { NAV_LINKS } from "@/lib/navigation";

const linkStyle =
  "rounded-sm text-sm text-primary-foreground/70 transition-colors outline-none hover:text-sand focus-visible:ring-3 focus-visible:ring-sand/60";

const headingStyle =
  "font-sans text-xs font-semibold tracking-[0.18em] text-sand uppercase";

// Only the social links that are filled in inside config/site.ts
const socialLinks = Object.entries(site.social).filter(([, url]) => url);

function Footer() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70">
            {site.description}
          </p>
          {socialLinks.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`${linkStyle} capitalize`}
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className={headingStyle}>Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={linkStyle}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingStyle}>Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2.5">
              <MapPin aria-hidden className="size-4 shrink-0 text-sand" />
              {site.contact.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail aria-hidden className="size-4 shrink-0 text-sand" />
              <a href={`mailto:${site.contact.email}`} className={linkStyle}>
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone aria-hidden className="size-4 shrink-0 text-sand" />
              <a
                href={`tel:${site.contact.phone.replaceAll(" ", "")}`}
                className={linkStyle}
              >
                {site.contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name} {site.suffix}
          </p>
          <p>Built by Youssef Waleed &amp; Salma Sherif</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
