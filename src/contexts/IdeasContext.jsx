import { createContext, useState, useEffect, useContext, useMemo } from "react";
import api from "../api";
import { useApi } from "./ApiContext.jsx";

const IdeasContext = createContext(undefined);

export function IdeasProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const { runApi } = useApi();

  useEffect(() => {
    let mounted = true;
    (async () => {
      await Promise.all([
        runApi(
          api.get("/api/ideaspace/ideas"),
          (d) => mounted && setIdeas(d),
          "Error fetching ideas",
          () => mounted && setError(new Error("Failed to load ideas"))
        ),
      ]);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [runApi]);

  const value = useMemo(
    () => ({ loading, error, ideas }),
    [loading, error, ideas]
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
