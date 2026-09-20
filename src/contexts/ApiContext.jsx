import { createContext, useContext, useCallback, useMemo, useRef } from "react";
import { useToast } from "@fraserelliott/fe-components";

export const ApiContext = createContext({ runApi: async () => null });

export function ApiProvider({ children }) {
  const { addToastMessage } = useToast();
  const unauthorisedHandlerRef = useRef(null);

  const registerUnauthorisedHandler = useCallback((fn) => {
    unauthorisedHandlerRef.current = fn;
  }, []);

  const handleApiError = useCallback(
    (err, fallbackMsg) => {
      addToastMessage(
        err?.response?.data?.error || err?.message || fallbackMsg,
        "error"
      );
    },
    [addToastMessage]
  );

  const runApi = useCallback(
    async (promise, onSuccess, fallbackMsg, onError) => {
      try {
        const { data } = await promise;
        onSuccess?.(data);
        return data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 && unauthorisedHandlerRef.current) {
          addToastMessage("Unauthorised action, please sign in.", "error");
          try {
            unauthorisedHandlerRef.current(err);
          } catch {}
          return null;
        }
        if (onError) onError(err);
        else handleApiError(err, fallbackMsg);
        return null;
      }
    },
    [handleApiError, addToastMessage]
  );

  const value = useMemo(
    () => ({
      runApi,
      registerUnauthorisedHandler,
    }),
    [runApi, registerUnauthorisedHandler]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export const useApi = () => useContext(ApiContext);
