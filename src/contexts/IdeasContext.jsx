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
import { useToast } from "@fraserelliott/fe-components";
import { useAuth } from "./AuthContext";

const IdeasContext = createContext(undefined);

export function IdeasProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const { runApiCallback, runApiTransform } = useApi();
  const { addToastMessage } = useToast();
  const { token, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    let mounted = true;
    setLoading(true);

    (async () => {
      await Promise.all([
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
        ),
      ]);
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [runApiCallback, token, authLoading]);

  const validateNameAsync = useCallback(
    async (name, excludeId) =>
      runApiTransform(
        api.post("/api/ideaspace/ideas/validate-name", { name, excludeId }),
        (data) => data.valid,
        (err) => (err?.response?.status === 409 ? false : null)
      ),
    [runApiTransform]
  );

  const createIdeaAsync = useCallback(
    async (idea) => {
      return await runApiCallback(
        api.post("/api/ideaspace/ideas", idea),
        (newIdea) => setIdeas((prev) => [newIdea, ...prev]),
        "Error creating idea."
      );
    },
    [runApiCallback]
  );

  const deleteIdeaAsync = useCallback(
    async (id) => {
      return await runApiCallback(
        api.delete(`/api/ideaspace/ideas/${id}`),
        () => setIdeas((prev) => prev.filter((entry) => entry.id !== id)),
        "Error deleting idea."
      );
    },
    [runApiCallback]
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      ideas,
      validateNameAsync,
      createIdeaAsync,
      deleteIdeaAsync,
    }),
    [loading, error, ideas, validateNameAsync, createIdeaAsync, deleteIdeaAsync]
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
