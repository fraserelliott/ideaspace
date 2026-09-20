import { UI } from "@/styles";
import { useIdeas } from "@/contexts/IdeasContext";
import { formatDate } from "@/utils/dateUtil";

export function IdeaTable() {
  const { loading, error, ideas } = useIdeas();

  if (error) return <h1>Placeholder error. {error}</h1>;

  if (loading) return <h1>Placeholder loading.</h1>;

  return (
    <div className={UI.Panel()} style={{ overflowX: "auto" }}>
      <table className="idea-table">
        <thead>
          <tr>
            <th className={UI.Heading()}>Name</th>
            <th className={UI.Heading()}>Tags</th>
            <th className={UI.Heading()}>Idea?</th>
            <th className={UI.Heading()}>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((entry) => {
            return (
              <tr key={entry.id} className="fe-p-em-1">
                <td>{entry.name}</td>
                <td>{renderTags(entry.ideatags)}</td>
                <td>{entry.isIdea ? "\u2713" : "\u2717"}</td>
                <td>{formatDate(entry.updatedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderTags(tags) {
  return tags.map((tag) => tag.name).join(" | ");
}
