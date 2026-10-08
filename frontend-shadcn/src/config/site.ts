// One place for the academy's own details (name, logo, contacts, social links).
// Edit the values here and the navbar, footer and home page all update.
// TODO: the contact values below are placeholders — replace them with the real ones.
export const site = {
  name: "Andalusia",
  suffix: "Academy",
  description:
    "Practical courses, structured programs and guided career paths — taught by people who work in the field.",

  // Logo image. Put the file in the public/ folder and write its path here, e.g. "/logo.svg".
  // While it is null the navbar shows the "A" mark instead.
  logoUrl: "/logo_andalusia.svg",
  // Optional version for dark backgrounds (footer). Falls back to logoUrl.
  logoLightUrl: null as string | null,

  contact: {
    email: "info@andalusia-academy.example",
    phone: "+20 100 000 0000",
    address: "Alexandria, Egypt",
  },

  // Leave a link empty ("") to hide it
  social: {
    facebook: "https://www.facebook.com/Andalusia.Academyy/",
    instagram: "https://www.instagram.com/andalusia_academyy/",
    linkedin: "https://www.linkedin.com/company/andalusiaahc/",
    youtube: "https://www.youtube.com/@andalusia-Conferences",
  },
};
