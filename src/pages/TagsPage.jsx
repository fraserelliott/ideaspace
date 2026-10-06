import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useIdeas } from "@/contexts/IdeasContext";
import { UI, appearance } from "@/styles";
import {
  ConfirmDialog,
  OptionalPortal,
  useToast,
} from "@fraserelliott/fe-components";
import { useForm } from "react-hook-form";
import { cx } from "@fraserelliott/fe-utilities";

export default function TagsPage() {
  const { isOptimisticallyLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { ideatags, deleteIdeatagAsync, updateTagAsync, validateTagNameAsync } =
    useIdeas();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTagId, setEditingTagId] = useState(null);
  const [isValidName, setIsValidName] = useState(null);
  const {
    register,
    formState: { isDirty, isSubmitting, dirtyFields },
    handleSubmit,
    reset,
  } = useForm();
  const { addToastMessage } = useToast();

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

  const startEditing = (tag) => {
    setEditingTagId(tag.id);
    reset(tag);
  };

  const stopEditing = () => {
    setEditingTagId(null);
    reset();
    setIsValidName(null);
  };

  const save = async (tag) => {
    const updated = await updateTagAsync(tag);
    if (updated) stopEditing();
  };

  const validateNameField = async (name) => {
    const trimmed = name.trim();
    if (!dirtyFields.name) {
      setIsValidName(null);
      return;
    }
    if (!trimmed) {
      setIsValidName(false);
      return;
    }
    console.log(`validateTagNameAsync(${trimmed}, ${editingTagId}`);
    const valid = await validateTagNameAsync(trimmed, editingTagId);
    if (valid === false) addToastMessage("Name already exists.", "error");
    setIsValidName(valid);
  };

  return (
    <div className={UI.Panel()}>
      <input
        className={UI.InputPrimary()}
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <form onSubmit={handleSubmit(save)} autoComplete="off">
        <table className="idea-table">
          <thead>
            <tr>
              <th className={UI.Heading()}>Id</th>
              <th className={UI.Heading()}>Name</th>
              <th className={UI.Heading()}>Exclusive</th>
              <th className={UI.Heading()}>UsageCount</th>
              <th className={UI.Heading()}>Edit</th>
              <th className={UI.Heading()}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredTagList.map((tag) => (
              <tr key={tag.id}>
                <td>{tag.id}</td>
                <td>
                  {editingTagId === tag.id ? (
                    <input
                      className={UI.InputPrimary(
                        cx(
                          "fe-grow-1",
                          isValidName === false && "border-danger",
                          isValidName && "border-success",
                          dirtyFields.name && "dirty"
                        )
                      )}
                      {...register("name", {
                        onChange: () => setIsValidName(null),
                        onBlur: (event) =>
                          validateNameField(event.target.value),
                      })}
                    />
                  ) : (
                    tag.name
                  )}
                </td>

                <td>
                  {editingTagId === tag.id ? (
                    <input type="checkbox" {...register("exclusive")} />
                  ) : tag.exclusive ? (
                    "\u2713"
                  ) : (
                    "\u2717"
                  )}
                </td>
                <td>{tag.usageCount}</td>
                <td>
                  {editingTagId === tag.id ? (
                    <>
                      <input
                        type="submit"
                        value="Save"
                        className={UI.BtnPrimary()}
                      />
                      <button
                        onClick={() => stopEditing()}
                        className={UI.BtnPrimary()}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(tag)}
                      className={UI.BtnPrimary()}
                    >
                      Edit
                    </button>
                  )}
                </td>

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
      </form>

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
