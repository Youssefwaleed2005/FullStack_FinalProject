import { useState, type FormEvent } from "react";
import { CircleCheck, ExternalLink, Mail, MapPin, Phone, Send } from "lucide-react";
import FormField from "@/components/FormField";
import { TextareaField } from "@/components/manage/fields";
import PageHeader from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const CONTACTS = [
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, icon: Mail },
  { label: "Phone", value: site.contact.phone, href: `tel:${site.contact.phone.replaceAll(" ", "")}`, icon: Phone },
  { label: "Address", value: site.contact.address, href: null, icon: MapPin },
];

// Only the social links that are filled in inside config/site.ts
const socialLinks = Object.entries(site.social).filter(([, url]) => url);

const linkStyle =
  "rounded-sm underline-offset-4 outline-none hover:text-sand-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

// There is no message endpoint yet, so the form opens the visitor's email app
function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email.";
    if (!message.trim()) errors.message = "Message is required.";
    else if (message.trim().length < 10) errors.message = "Please write at least 10 characters.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setOpened(false);
    if (!validate()) return;

    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    const mailSubject = subject.trim() || `Message from ${name.trim()}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about a course or program? We're happy to help."
      />

      <div className={cn(pageContainer, "grid gap-6 py-12 lg:grid-cols-[2fr_3fr] lg:gap-8")}>
        <aside className="flex flex-col gap-4">
          {CONTACTS.map((contact) => (
            <div key={contact.label} className={cn(panelStyle, "flex items-center gap-4 p-5")}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sand-deep">
                <contact.icon aria-hidden className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{contact.label}</p>
                {contact.href ? (
                  <a href={contact.href} className={cn(linkStyle, "font-medium break-all")}>
                    {contact.value}
                  </a>
                ) : (
                  <p className="font-medium">{contact.value}</p>
                )}
              </div>
            </div>
          ))}

          {socialLinks.length > 0 && (
            <div className={cn(panelStyle, "p-5")}>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Follow us</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map(([network, url]) => (
                  <li key={network}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium capitalize outline-none transition-colors hover:border-sand hover:text-sand-deep focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {network}
                      <ExternalLink aria-hidden className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <section aria-labelledby="contact-form-title" className={cn(panelStyle, "p-6 sm:p-8")}>
          <h2 id="contact-form-title" className="text-2xl font-semibold">
            Send us a message
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">This opens your email app with the message ready to send.</p>

          {opened && (
            <Alert className="mt-5 border-emerald-200 bg-emerald-50 text-emerald-800">
              <CircleCheck />
              <AlertDescription className="text-emerald-800">
                Your email app should open. You can also write to us at{" "}
                <a href={`mailto:${site.contact.email}`} className="font-medium underline underline-offset-4">
                  {site.contact.email}
                </a>
                .
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={fieldErrors.name} />
              <FormField
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />
            </div>
            <FormField label="Subject" hint="Optional" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <TextareaField
              label="Message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={fieldErrors.message}
            />
            <Button type="submit" size="lg" className="h-11 rounded-full px-6 text-base sm:self-start">
              <Send data-icon="inline-start" /> Open email app
            </Button>
          </form>
        </section>
      </div>
    </>
  );
}

export default ContactPage;
