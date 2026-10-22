import Avatar from "@/components/Avatar";

// Avatar + name + small grey line under it (email, etc.)
function PersonCell({ name, detail }: { name: string; detail?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} className="size-9 shrink-0 text-xs" />
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        {detail && <p className="truncate text-xs text-muted-foreground">{detail}</p>}
      </div>
    </div>
  );
}

export default PersonCell;
