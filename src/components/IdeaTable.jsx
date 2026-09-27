import { appearance, UI } from "@/styles";
import { useIdeas } from "@/contexts/IdeasContext";
import { formatDate } from "@/utils/dateUtil";
import { ErrorMessage } from "./ErrorMessage";
import { useState } from "react";
import { OptionalPortal, ConfirmDialog } from "@fraserelliott/fe-components";

export function IdeaTable({ publishedOnly, renderSlug, renderDeleteBtn }) {
  const { loading, error, ideas, deleteIdeaAsync } = useIdeas();
  const [pendingDelete, setPendingDelete] = useState(null);

  if (error) return <ErrorMessage message={error.message} />;

  if (loading) return;

  const displayedIdeas = publishedOnly
    ? ideas.filter((idea) => idea.slug)
    : ideas;

  const onConfirmDelete = () => {
    setPendingDelete(null);
    deleteIdeaAsync(pendingDelete.id);
  };

  return (
    <div className={UI.Panel()} style={{ overflowX: "auto" }}>
      <table className="idea-table">
        <thead>
          <tr>
            <th className={UI.Heading()}>Name</th>
            <th className={UI.Heading()}>Tags</th>
            <th className={UI.Heading()}>Idea?</th>
            {renderSlug && <th className={UI.Heading()}>Slug</th>}
            <th className={UI.Heading()}>Last updated</th>
            {renderDeleteBtn && <th className={UI.Heading()}>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {displayedIdeas.map((entry) => {
            return (
              <tr key={entry.id} className="fe-p-em-1">
                <td>{entry.name}</td>
                <td>{renderTags(entry.ideatags)}</td>
                <td>{entry.isIdea ? "\u2713" : "\u2717"}</td>
                {renderSlug && <td>{entry.slug}</td>}
                <td>{formatDate(entry.updatedAt)}</td>
                {renderDeleteBtn && (
                  <td>
                    <button
                      onClick={() => setPendingDelete(entry)}
                      className={UI.BtnPrimary()}
                    >
                      Delete
                    </button>{" "}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {pendingDelete && (
        <OptionalPortal portalTarget={document.body}>
          <ConfirmDialog
            open={pendingDelete}
            onOpenChange={(open) => {
              if (!open) setPendingDelete(null);
            }}
            onConfirm={onConfirmDelete}
            onCancel={() => setPendingDelete(null)}
            heading={`Delete ${pendingDelete.name}`}
            text="Are you sure you want to delete this idea?"
            style={appearance}
          />
        </OptionalPortal>
      )}
    </div>
  );
}

function renderTags(tags) {
  return tags.map((tag) => tag.name).join(" | ");
}
