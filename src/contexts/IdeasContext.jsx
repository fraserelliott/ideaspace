import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import api from "../api";
import { useApi } from "./ApiContext.jsx";
import { useAuth } from "./AuthContext";
import { trimValues } from "@/utils/jsonUtil.js";

const IdeasContext = createContext(undefined);

export function IdeasProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [ideatags, setIdeatags] = useState([]);

  const { runApiCallback, runApiTransform } = useApi();
  const { token, authLoading } = useAuth();

  const fetchIdeatagsAsync = useCallback(
    async (mounted) =>
      runApiCallback(
        api.get("/api/ideaspace/ideatags"),
        (d) => setIdeatags(d),
        "Error fetching ideatags",
        () => setError(new Error("Failed to load ideatags"))
      ),
    [runApiCallback]
  );

  const fetchIdeasAsync = useCallback(
    async (mounted) =>
      runApiCallback(
        api.get(
          token ? "/api/ideaspace/ideas/dashboard" : "/api/ideaspace/ideas"
        ),
        (d) =>
          mounted &&
          setIdeas(
            d.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          ),
        "Error fetching ideas",
        () => mounted && setError(new Error("Failed to load ideas"))
      )[runApiCallback]
  );

  useEffect(() => {
    if (authLoading) return;

    let mounted = true;
    setLoading(true);

    (async () => {
      await Promise.all([
        fetchIdeasAsync(mounted),
        fetchIdeatagsAsync(mounted),
      ]);
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [runApiCallback, fetchIdeatagsAsync, token, authLoading]);

  const validateNameAsync = useCallback(
    async (name, excludeId) =>
      runApiTransform(
        api.post("/api/ideaspace/ideas/validate-name", { name, excludeId }),
        (data) => data.valid,
        (err) => (err?.response?.status === 409 ? false : null)
      ),
    [runApiTransform]
  );

  const validateSlugAsync = useCallback(
    async (slug, excludeId) =>
      runApiTransform(
        api.post("/api/ideaspace/ideas/validate-slug", { slug, excludeId }),
        (data) => data.valid,
        (err) => (err?.response?.status === 409 ? false : null)
      ),
    [runApiTransform]
  );

  const createIdeaAsync = useCallback(
    async (idea) => {
      const trimmed = trimValues(idea);
      return await runApiCallback(
        api.post("/api/ideaspace/ideas", trimmed),
        (newIdea) => setIdeas((prev) => [newIdea, ...prev]),
        "Error creating idea."
      );
    },
    [runApiCallback]
  );

  const deleteIdeaAsync = useCallback(
    async (id) => {
      const result = await runApiCallback(
        api.delete(`/api/ideaspace/ideas/${id}`),
        () => setIdeas((prev) => prev.filter((entry) => entry.id !== id)),
        "Error deleting idea."
      );
      if (result) await fetchIdeatagsAsync(true);
      return result;
    },
    [runApiCallback, fetchIdeatagsAsync]
  );

  const getIdeaDetailsByIdAsync = useCallback(
    async (id) => {
      return await runApiTransform(
        api.get(`/api/ideaspace/ideas/dashboard/${id}`)
      );
    },
    [runApiTransform]
  );

  const getIdeaDetailsBySlugAsync = useCallback(
    async (slug) => {
      return await runApiTransform(
        api.get(`/api/ideaspace/ideas/${slug}`),
        null,
        (err) => null
      );
    },
    [runApiTransform]
  );

  const updateIdeaAsync = useCallback(
    async (idea) => {
      const trimmed = trimValues(idea);
      const result = await runApiCallback(
        api.put(`/api/ideaspace/ideas/dashboard/${trimmed.id}`, trimmed),
        (updated) =>
          setIdeas((prev) => [
            updated,
            ...prev.filter((entry) => entry.id !== updated.id),
          ]),
        "Error updating idea."
      );
      if (result != null) await fetchIdeatagsAsync(true);
      return result != null;
    },
    [runApiCallback, fetchIdeatagsAsync]
  );

  const addIdeatagAsync = useCallback(
    async (ideatag) => {
      const trimmed = trimValues(ideatag);
      return await runApiCallback(
        api.post("/api/ideaspace/ideatags", trimmed),
        (newTag) =>
          setIdeatags((prev) => [...prev, { ...newTag, usageCount: 0 }]),
        "Error creating ideatag."
      );
    },
    [runApiTransform]
  );

  const deleteIdeatagAsync = useCallback(
    async (id) => {
      return runApiCallback(
        api.delete(`/api/ideaspace/ideatags/${id}`),
        () => setIdeatags((prev) => prev.filter((t) => t.id !== id)),
        "Error deleting ideatag"
      );
    },
    [runApiCallback]
  );

  const updateTagAsync = useCallback(
    async (ideatag) => {
      const result = runApiTransform(
        api.put(`/api/ideaspace/ideatags/${ideatag.id}`, trimValues(ideatag))
      );
      if (result != null) {
        await fetchIdeasAsync(true);
        await fetchIdeatagsAsync(true);
      }
      return result != null;
    },

    [runApiCallback]
  );

  const validateTagNameAsync = useCallback(
    async (name, excludeId) => {
      return runApiTransform(
        api.post("/api/ideaspace/ideatags/validate-name", { name, excludeId }),
        (data) => data.valid,
        (err) => (err.response?.status === 409 ? false : null)
      );
    },
    [runApiTransform]
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      ideas,
      ideatags,
      validateNameAsync,
      validateSlugAsync,
      createIdeaAsync,
      deleteIdeaAsync,
      getIdeaDetailsByIdAsync,
      getIdeaDetailsBySlugAsync,
      updateIdeaAsync,
      addIdeatagAsync,
      deleteIdeatagAsync,
      updateTagAsync,
      validateTagNameAsync,
    }),
    [
      loading,
      error,
      ideas,
      ideatags,
      validateNameAsync,
      validateSlugAsync,
      createIdeaAsync,
      deleteIdeaAsync,
      getIdeaDetailsByIdAsync,
      getIdeaDetailsBySlugAsync,
      updateIdeaAsync,
      deleteIdeatagAsync,
      addIdeatagAsync,
      updateTagAsync,
      validateTagNameAsync,
    ]
  );

  return (
    <IdeasContext.Provider value={value}>{children}</IdeasContext.Provider>
  );
}

export function useIdeas() {
  const ctx = useContext(IdeasContext);
  if (ctx === undefined) {
    throw new Error("useIdeas must be used within an IdeasProvider");
  }
  return ctx;
}
