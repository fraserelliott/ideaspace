import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ConfirmDialog,
  OptionalPortal,
  Modal,
} from "@fraserelliott/fe-components";
import { appearance, UI } from "@/styles";
import { useImages } from "@/contexts/ImagesContext";
import { ImageSelector } from "@/components/ImageSelector";
import { cx } from "@fraserelliott/fe-utilities";

const mediumModalStyle = {
  Panel: cx(appearance.Panel, "panel-medium"),
  BtnPrimary: "modal-btn-small",
};

export default function ImagePage() {
  const { isOptimisticallyLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { images, loading, error } = useImages();
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOptimisticallyLoggedIn) navigate("/", { replace: true });
  }, [isOptimisticallyLoggedIn]);

  const openModal = (dbImage) => {
    setShowModal(true);
    setModalImage(dbImage || null);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  if (loading) return null;
  // TODO: error component
  if (error) return <h1>Error loading images</h1>;

  return (
    <>
      <div className={UI.Panel("fe-items-center")}>
        <div className="form-row fe-justify-center">
          <button className={UI.BtnPrimary()} onClick={() => openModal()}>
            Add Image
          </button>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={UI.InputPrimary()}
          />
        </div>
      </div>
      <div className="fe-d-flex fe-flex-wrap fe-gap-5 fe-justify-center">
        {images
          .filter((image) =>
            image.reference
              .toLowerCase()
              .trim()
              .includes(searchTerm.toLowerCase().trim())
          )
          .map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              onEdit={() => openModal(image)}
            />
          ))}
      </div>
      {showModal && (
        <ImageFormModal
          dbImage={modalImage}
          onClose={closeModal}
          open={showModal}
        />
      )}
    </>
  );
}

function ImageCard({ image, onEdit }) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { deleteImageAsync } = useImages();

  const onDelete = () => {
    setShowDeletePopup(false);
    deleteImageAsync(image.id);
  };

  return (
    <>
      <div className={UI.Panel("card")}>
        <span>{image?.reference || ""}</span>
        <div className="thumb">
          <img src={image?.url || ""} alt={image?.reference || ""} />
        </div>
        <div className="fe-d-flex fe-gap-4 fe-justify-center">
          <button
            className={UI.BtnDanger()}
            onClick={() => setShowDeletePopup(true)}
          >
            Delete
          </button>
          <button className={UI.BtnPrimary()} onClick={onEdit}>
            Edit
          </button>
        </div>
      </div>
      {showDeletePopup && (
        <ConfirmDialog
          open={showDeletePopup}
          text="Are you sure you want to delete this image?"
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={onDelete}
          style={appearance}
        />
      )}
    </>
  );
}

function ImageFormModal({ open, dbImage, onClose }) {
  const isEdit = !!dbImage;
  const { addImageAsync, updateImageContentAsync, updateImageMetadataAsync } =
    useImages();

  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      reference: dbImage?.reference ?? "",
      image: null, // will hold File or null
    },
  });

  const handleSave = async (data) => {
    const ref = data.reference.trim();

    if (!isEdit) {
      const fd = new FormData();
      fd.append("image", data.image);
      fd.append("reference", ref);
      await addImageAsync(fd);
      onClose?.();
      return;
    }

    if (ref !== dbImage.reference) {
      await updateImageMetadataAsync(dbImage.id, { reference: ref });
    }
    if (data.image) {
      const fd = new FormData();
      fd.append("image", data.image);
      await updateImageContentAsync(dbImage.id, fd);
    }

    onClose?.();
  };

  // TODO: form error handling

  return (
    <OptionalPortal portalTarget={document.body}>
      <Modal
        open={open}
        onOpenChange={onClose}
        style={mediumModalStyle}
        heading="Upload Image"
        removeCloseButton
      >
        <form
          className="fe-d-flex fe-flex-column fe-items-center card fe-gap-5"
          onSubmit={handleSubmit(handleSave)}
        >
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className={UI.InputPrimary()}
              {...register("reference", { required: true })}
            />
          </div>

          <Controller
            name="image"
            control={control}
            rules={{
              validate: (file) =>
                isEdit || file ? true : "Please choose an image",
            }}
            render={({ field: { onChange } }) => (
              <ImageSelector
                src={dbImage?.url}
                onChange={(payload) => onChange(payload?.file ?? null)}
              />
            )}
          />

          <div className="fe-d-flex fe-gap-3 justify-center cardRow">
            <button type="button" onClick={onClose} className={UI.BtnPrimary()}>
              Cancel
            </button>
            <button type="submit" className={UI.BtnPrimary()}>
              {isEdit ? "Save Changes" : "Create Image"}
            </button>
          </div>
        </form>
      </Modal>
    </OptionalPortal>
  );
}
