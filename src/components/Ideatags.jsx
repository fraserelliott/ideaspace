import { NavLink } from "react-router-dom";

export function Ideatags({ tags, muted }) {
  if (!tags) return null;
  return (
    <div className="fe-d-flex fe-flex-wrap fe-gap-2">
      {tags.map((tag) => (
        <NavLink
          className={muted && "fes-text-muted"}
          key={tag.id}
          to={`/?tags=${tag.id}`}
        >
          {tag.name}
        </NavLink>
      ))}
    </div>
  );
}
