import { cn } from "@/lib/utils";
import type { Category } from "@/types/Category";

type CategoryChipsProps = {
  categories: Category[];
  selectedId: number | null;
  onSelect: (categoryId: number | null) => void;
  // Label of the "no filter" chip
  allLabel: string;
};

// Row of category buttons; scrolls sideways on small screens
function CategoryChips({
  categories,
  selectedId,
  onSelect,
  allLabel,
}: CategoryChipsProps) {
  if (categories.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <CategoryChip
        label={allLabel}
        selected={selectedId === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          label={category.name}
          selected={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        />
      ))}
    </div>
  );
}

type CategoryChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function CategoryChip({ label, selected, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-sand hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export default CategoryChips;
