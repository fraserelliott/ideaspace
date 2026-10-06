import { IdeaTable } from "@/components/IdeaTable";
import { UI, appearance } from "@/styles";
import {
  ConfirmDialog,
  Modal,
  OptionalPortal,
} from "@fraserelliott/fe-components";
import { useState, useEffect } from "react";
import { cx } from "@fraserelliott/fe-utilities";
import { useIdeas } from "@/contexts/IdeasContext";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@fraserelliott/fe-components";
import { TagSelector } from "@/components/TagSelector";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorMessage } from "@/components/ErrorMessage";

const smallModalStyle = {
  Panel: cx(appearance.Panel, "panel-small"),
  BtnPrimary: "modal-btn-small",
};

export default function DashboardPage() {
  const [newIdeaDialogOpen, setNewIdeaDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const { isOptimisticallyLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { ideas, loading, error, getIdeaDetailsByIdAsync } = useIdeas();

  useEffect(() => {
    if (!isOptimisticallyLoggedIn) navigate("/", { replace: true });
  }, [isOptimisticallyLoggedIn]);

  const openEditor = async (entry) => {
    const idea = await getIdeaDetailsByIdAsync(entry.id);
    if (idea) setEditingIdea(idea);
  };

  if (error) return <ErrorMessage message={error.message} />;

  if (loading || !ideas) return;

  return (
    <>
      <div className="fe-d-flex fe-gap-3">
        <button
          className={UI.BtnPrimary()}
          onClick={() => setNewIdeaDialogOpen(true)}
        >
          New Idea
        </button>
        <input
          className={UI.InputPrimary()}
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <IdeaTable
        actionLabel="Edit"
        onAction={openEditor}
        renderSlug
        renderDeleteBtn
        searchTerm={searchTerm}
        ideas={ideas}
      />
      {newIdeaDialogOpen && (
        <NewIdeaModal
          open={newIdeaDialogOpen}
          onOpenChange={setNewIdeaDialogOpen}
        />
      )}
      {editingIdea && (
        <EditIdeaModal
          editingIdea={editingIdea}
          onOpenChange={(open) => {
            if (!open) setEditingIdea(null);
          }}
        />
      )}
    </>
  );
}

function NewIdeaModal({ open, onOpenChange }) {
  const [isValidName, setIsValidName] = useState(null);
  const { validateNameAsync, createIdeaAsync } = useIdeas();
  const { register, handleSubmit, setFocus } = useForm();
  const { addToastMessage } = useToast();

  const submitForm = async (data) => {
    const valid = await validateNameAsync(data.name);
    if (!valid) setIsValidName(valid);

    if (valid !== true) {
      setFocus("name");

      return addToastMessage(
        valid === false
          ? "Name already exists."
          : "Please check the name before creating an idea.",
        "error"
      );
    }

    const success = await createIdeaAsync(data);
    if (success) {
      setIsValidName(null);
      onOpenChange(false);
    }
  };

  const validateNameField = async (name) =>
    setIsValidName(await validateNameAsync(name));

  return (
    <OptionalPortal portalTarget={document.body}>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        style={smallModalStyle}
        heading="New Idea"
        closeOnBackdropClick={false}
        removeCloseButton
      >
        <form
          className={UI.Form()}
          onSubmit={handleSubmit(submitForm)}
          autoComplete="off"
        >
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              className={UI.InputPrimary()}
              {...register("name", {
                onChange: () => setIsValidName(null),
                onBlur: (event) =>
                  event.target.value.trim() !== "" &&
                  validateNameField(event.target.value),
              })}
            />

            <div style={{ height: "1.5em" }}>
              {isValidName === true && (
                <p style={{ color: "#4caf50" }}>Name is valid.</p>
              )}
              {isValidName === false && (
                <p style={{ color: "#d9534f" }}>Name already exists.</p>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="isIdea">Is it an idea?</label>
            <input
              type="checkbox"
              id="isIdea"
              className={UI.InputPrimary()}
              {...register("isIdea")}
            />
          </div>
          <input type="submit" value="Create" className={UI.BtnPrimary()} />
        </form>
      </Modal>
    </OptionalPortal>
  );
}

function EditIdeaModal({ editingIdea, onOpenChange }) {
  const {
    control,
    register,
    formState: { isDirty, isSubmitting, dirtyFields },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues: editingIdea });
  const { validateNameAsync, validateSlugAsync, updateIdeaAsync } = useIdeas();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isValidName, setIsValidName] = useState(null);
  const [isValidSlug, setIsValidSlug] = useState(null);
  const { addToastMessage } = useToast();

  const formtags = watch("ideatags");

  const submitForm = async (data, event) => {
    const closeAfterSave =
      event.nativeEvent.submitter?.value === "Save & Close";

    const success = await updateIdeaAsync(data);
    if (!success) return;

    reset(data);
    if (closeAfterSave) onOpenChange(false);
  };

  const closeModal = () => {
    if (isDirty) setOpenConfirm(true);
    else onOpenChange(false);
  };

  const discardChanges = () => {
    reset();
    setIsValidName(null);
    setIsValidSlug(null);
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
    const valid = await validateNameAsync(trimmed, editingIdea.id);
    if (valid === false) addToastMessage("Name already exists.", "error");
    setIsValidName(valid);
  };

  const validateSlugField = async (slug) => {
    if (!dirtyFields.slug) {
      setIsValidSlug(null);
      return;
    }

    const trimmed = slug.trim();
    if (trimmed && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
      addToastMessage(
        "Slug can only use lowercase letters, numbers, and single hyphens, and cannot start or end with a hyphen.",
        "error"
      );
      setIsValidSlug(false);
      return;
    }
    const valid = await validateSlugAsync(trimmed, editingIdea.id);
    if (valid === false) addToastMessage("Slug already exists.", "error");
    setIsValidSlug(valid);
  };

  return (
    <OptionalPortal portalTarget={document.body}>
      <Modal
        open={editingIdea}
        onOpenChange={closeModal}
        style={appearance}
        closeOnBackdropClick={false}
        removeCloseButton
      >
        <form
          className={UI.Form("fe-h-100")}
          autoComplete="off"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
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
                onBlur: (event) => validateNameField(event.target.value),
              })}
            />
            <label htmlFor="slug">Slug:</label>
            <input
              id="slug"
              className={UI.InputPrimary(
                cx(
                  "fe-grow-1",
                  isValidSlug === false && "border-danger",
                  isValidSlug && "border-success",
                  dirtyFields.slug && "dirty"
                )
              )}
              {...register("slug", {
                onChange: () => setIsValidSlug(null),
                onBlur: (event) =>
                  event.target.value.trim() !== "" &&
                  validateSlugField(event.target.value),
              })}
            />
            <label htmlFor="isIdea">Idea?</label>
            <input
              id="isIdea"
              type="checkbox"
              className={UI.InputPrimary()}
              {...register("isIdea")}
            />
          </div>
          <div className="fe-d-flex fe-w-100 fe-justify-between">
            <Controller
              name="ideatags"
              control={control}
              render={({ field }) => (
                <>
                  <TagDisplay
                    tags={field.value}
                    onChange={field.onChange}
                    onRemoveTag={(tag) =>
                      field.onChange(field.value.filter((t) => t.id !== tag.id))
                    }
                  />
                  <TagSelector
                    buttonText="Select Tags"
                    selectedTags={formtags}
                    allowCreate
                    showUnusedTags
                    onChange={(tag, selected) => {
                      const newTags = selected
                        ? [...field.value, tag]
                        : field.value.filter(
                            (existingTag) => existingTag.id !== tag.id
                          );

                      field.onChange(newTags);
                    }}
                  />
                </>
              )}
            />
          </div>
          <label htmlFor="summary" className="fe-w-100">
            Summary:
          </label>
          <textarea
            id="summary"
            className={UI.InputPrimary(
              cx("fe-w-100", dirtyFields.summary && "dirty")
            )}
            {...register("summary")}
          />
          <label htmlFor="content" className="fe-w-100">
            Content:
          </label>
          <textarea
            id="content"
            className={UI.InputPrimary(
              cx("fe-w-100 fe-grow-1", dirtyFields.content && "dirty")
            )}
            {...register("content")}
          />
          <div className="form-row fe-justify-center fe-gap-5">
            <button
              className={UI.BtnDanger()}
              disabled={!isDirty || isSubmitting}
              onClick={discardChanges}
            >
              Discard Changes
            </button>
            <input
              type="submit"
              value="Save"
              className={UI.BtnPrimary()}
              disabled={
                !isDirty ||
                isSubmitting ||
                isValidName === false ||
                isValidSlug === false
              }
            />
            <input
              type="submit"
              value="Save & Close"
              className={UI.BtnPrimary()}
              disabled={
                !isDirty ||
                isSubmitting ||
                isValidName === false ||
                isValidSlug === false
              }
            />
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={openConfirm}
        onConfirm={() => {
          setOpenConfirm(false);
          onOpenChange(false);
        }}
        onCancel={() => setOpenConfirm(false)}
        style={appearance}
        text="You have unsaved changes. Discard them and close?"
      />
    </OptionalPortal>
  );
}

const TagDisplay = ({ tags, onRemoveTag }) => {
  return (
    <div className="fe-d-flex fe-flex-wrap">
      {tags?.map((tag, index) => {
        return (
          <div
            className="fe-d-flex fe-gap-1 fe-items-center fe-grow-1"
            key={index}
          >
            <span className="fe-mx-1">{tag.name}</span>
            <button className={UI.BtnDanger()} onClick={() => onRemoveTag(tag)}>
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};
