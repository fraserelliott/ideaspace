export function Ideatags({ tags, muted }) {
  if (!tags) return null;
  return (
    <span className={muted && "fes-text-muted"}>
      {tags.map((tag) => tag.name).join(" | ")}
    </span>
  );
}
