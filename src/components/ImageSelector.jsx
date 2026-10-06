import { useEffect, useRef, useState } from "react";
import { useToast } from "@fraserelliott/fe-components";

export function ImageSelector(props) {
  const [src, setSrc] = useState("");
  const [previousUrl, setPreviousUrl] = useState("");
  const inputRef = useRef(null);
  const { addToastMessage } = useToast();

  useEffect(() => {
    if (props.src !== undefined) {
      setSrc(props.src);
    }
  }, [props.src]);

  useEffect(() => {
    return () => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
    };
  }, [previousUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.size) return addToastMessage("No file uploaded", "error");
    if (props.maxSize && file.size > props.maxSize)
      return addToastMessage("File is larger than limit", "error");
    if (!file.type.startsWith("image/"))
      return addToastMessage("Invalid file type", "error");

    const previewUrl = URL.createObjectURL(file);
    setPreviousUrl(previewUrl);
    if (props.onChange) {
      props.onChange({ file, previewUrl, remove: () => setPreviousUrl("") });
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSrc("");
    setPreviousUrl("");
    if (props.onChange) {
      props.onChange(null);
    }
  };

  const backgroundImage = () => {
    return previousUrl ? `url(${previousUrl})` : src ? `url(${src})` : "";
  };

  return (
    <label
      style={{
        ...styles.uploadContainer,
        backgroundImage: backgroundImage(),
        width: props.width || "200px",
        height: props.height || "200px",
      }}
    >
      {(previousUrl || src) && (
        <span
          style={styles.deleteBtn}
          onClick={handleDelete}
          aria-label="Remove image"
        >
          🗑️
        </span>
      )}
      {!previousUrl && !src && <span style={styles.uploadText}>+</span>}
      <input
        ref={inputRef}
        style={styles.uploadInput}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        aria-label="Image Upload"
      />
    </label>
  );
}

const styles = {
  uploadContainer: {
    position: "relative",
    backgroundColor: "rgba(200, 200, 200, 0.2)",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: "2px dashed #ccc",
    borderRadius: "1em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadInput: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
    cursor: "pointer",
    zIndex: 1,
  },
  deleteBtn: {
    position: "absolute",
    top: "0.5em",
    right: "0.5em",
    cursor: "pointer",
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 240, 0.7)",
    border: "var(--glass-border)",
    borderRadius: "3px",
  },
  uploadText: {
    zIndex: 2,
    fontSize: "2em",
  },
};
