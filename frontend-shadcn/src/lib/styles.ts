// Class lists shared by several components, so they look and behave the same

// Course and program cards
export const cardStyle =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition duration-300 ease-out focus-within:ring-3 focus-within:ring-ring/50 hover:-translate-y-1 hover:border-sand/70 hover:shadow-xl hover:shadow-primary/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export const cardImageZoom =
  "transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100";

// White panels on learner pages (profile, applications, payments…)
export const panelStyle =
  "rounded-2xl border border-border/80 bg-card shadow-xs";

// Width-limited page body
export const pageContainer =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
