import { IdeaTable } from "@/components/IdeaTable";
import { UI, appearance } from "@/styles";
import { Modal, OptionalPortal } from "@fraserelliott/fe-components";
import { useState, useEffect } from "react";
import { cx } from "@fraserelliott/fe-utilities";
import { useIdeas } from "@/contexts/IdeasContext";
import { useForm } from "react-hook-form";
import { useToast } from "@fraserelliott/fe-components";

const smallModalStyle = {
  Panel: cx(appearance.Panel, "panel-small"),
  BtnPrimary: "modal-btn-small",
};

export default function DashboardPage() {
  const [newIdeaDialogOpen, setNewIdeaDialogOpen] = useState(false);

  return (
    <>
      <button
        className={UI.BtnPrimary()}
        onClick={() => setNewIdeaDialogOpen(true)}
      >
        New Idea
      </button>
      <IdeaTable renderSlug renderDeleteBtn />
      {newIdeaDialogOpen && (
        <NewIdeaModal
          open={newIdeaDialogOpen}
          onOpenChange={setNewIdeaDialogOpen}
          style={smallModalStyle}
        />
      )}
    </>
  );
}

function NewIdeaModal({ open, onOpenChange, style }) {
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
        style={style}
        heading="New Idea"
        closeOnEscape
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
              name="name"
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
              name="isIdea"
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
