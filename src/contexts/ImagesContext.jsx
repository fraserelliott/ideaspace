import {
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { useApi } from "./ApiContext.jsx";
import api from "../api.jsx";

export const ImagesContext = createContext();

export function ImagesProvider({ children }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { runApiCallback } = useApi();

  useEffect(() => {
    let mounted = true;
    (async () => {
      await runApiCallback(
        api.get("/api/images"),
        (d) => mounted && setImages(d),
        "Error loading images",
        () => mounted && setError(new Error("Failed to load images"))
      );
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [runApiCallback]);

  const addImageAsync = useCallback(
    async (formData) => {
      return runApiCallback(
        api.post("/api/images", formData),
        (newImage) => setImages((prev) => [...prev, newImage]),
        "Error adding image"
      );
    },
    [runApiCallback]
  );

  const updateImageContentAsync = useCallback(
    async (id, formData) => {
      return runApiCallback(
        api.put(`/api/images/${id}/content`, formData),
        (newImage) =>
          setImages((prev) =>
            prev.map((image) => (image.id === id ? newImage : image))
          ),
        "Error updating image content"
      );
    },
    [runApiCallback]
  );

  const updateImageMetadataAsync = useCallback(
    async (id, metadata) => {
      return runApiCallback(
        api.put(`/api/images/${id}/metadata`, metadata),
        (newImage) =>
          setImages((prev) =>
            prev.map((image) => (image.id === id ? newImage : image))
          ),
        "Error updating image metadata"
      );
    },
    [runApiCallback]
  );

  const deleteImageAsync = useCallback(
    async (id) => {
      return runApiCallback(
        api.delete(`/api/images/${id}`),
        () => setImages((prev) => prev.filter((image) => image.id !== id)),
        "Error deleting image"
      );
    },
    [runApiCallback]
  );

  const getImage = useCallback(
    (reference) => {
      return images.find((img) => img.reference === reference);
    },
    [images]
  );

  const value = useMemo(
    () => ({
      images,
      loading,
      error,
      addImageAsync,
      updateImageContentAsync,
      updateImageMetadataAsync,
      deleteImageAsync,
      getImage,
    }),
    [
      images,
      loading,
      error,
      addImageAsync,
      updateImageContentAsync,
      updateImageMetadataAsync,
      deleteImageAsync,
      getImage,
    ]
  );

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  );
}

export const useImages = () => {
  const ctx = useContext(ImagesContext);
  if (!ctx) throw new Error("useImages must be used within <ImagesProvider>");
  return ctx;
};
