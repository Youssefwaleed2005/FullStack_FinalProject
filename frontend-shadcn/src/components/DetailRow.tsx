type DetailRowProps = {
  label: string;
  value: string | null;
};

// One "label: value" line inside a <dl>; hidden when there is no value
function DetailRow({ label, value }: DetailRowProps) {
  if (!value) return null;

  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default DetailRow;
