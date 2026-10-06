import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useIdeas } from "@/contexts/IdeasContext";
import { UI, appearance } from "@/styles";
import { ConfirmDialog, OptionalPortal } from "@fraserelliott/fe-components";

export default function TagsPage() {
  const { isOptimisticallyLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { ideatags, deleteIdeatagAsync } = useIdeas();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOptimisticallyLoggedIn) navigate("/", { replace: true });
  }, [isOptimisticallyLoggedIn]);

  const onConfirmDelete = () => {
    setPendingDelete(null);
    deleteIdeatagAsync(pendingDelete.id);
  };

  const filteredTagList = useMemo(() => {
    return ideatags.filter((tag) =>
      tag.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, ideatags]);

  return (
    <div className={UI.Panel()}>
      <input
        className={UI.InputPrimary()}
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="idea-table">
        <thead>
          <tr>
            <th className={UI.Heading()}>Id</th>
            <th className={UI.Heading()}>Name</th>
            <th className={UI.Heading()}>UsageCount</th>
            <th className={UI.Heading()}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTagList.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.id}</td>
              <td>{tag.name}</td>
              <td>{tag.usageCount}</td>
              <td>
                <button
                  className={UI.BtnDanger()}
                  onClick={() => setPendingDelete(tag)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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
            text="Are you sure you want to delete this tag?"
            style={appearance}
          />
        </OptionalPortal>
      )}
    </div>
  );
}
