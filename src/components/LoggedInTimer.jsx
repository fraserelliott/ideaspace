import { useMemo, useEffect } from "react";
import { useAuth } from "@contexts/AuthContext.jsx";
import { useToast } from "@fraserelliott/fe-components";
import { useTokenCountdown } from "@hooks/tokenCountdown";
import { cx } from "@fraserelliott/fe-utilities";

function formatHMS(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function LoggedInTimer() {
  const { token, logout } = useAuth();
  const { addToastMessage } = useToast();

  // Always call the hook (even if token is null); the hook itself should no-op when no expiry.
  const { remaining, expiresAt, isExpired } = useTokenCountdown(token, {
    warnAtMs: 5 * 60 * 1000,
    onWarn: () =>
      addToastMessage("Session expires in under 5 minutes.", "error"),
  });

  // Effect is always declared; it guards internally.
  useEffect(() => {
    if (token && isExpired) {
      addToastMessage("Session expired. Please sign in again.", "error");
      logout();
    }
  }, [token, isExpired, logout, addToastMessage]);

  const TEN_MIN = 10 * 60 * 1000;
  const THIRTY_MIN = 30 * 60 * 1000;

  // Compute memos unconditionally; they handle nulls.
  const severity = useMemo(() => {
    if (!token) return "hidden";
    if (remaining == null) return "unknown";
    if (remaining === 0) return "expired";
    if (remaining <= TEN_MIN) return "alert"; // flash
    if (remaining <= THIRTY_MIN) return "warn"; // red
    return "ok";
  }, [token, remaining]);

  const title = useMemo(
    () => (expiresAt ? new Date(expiresAt).toLocaleString() : "Unknown expiry"),
    [expiresAt]
  );

  // Only return early AFTER all hooks have been called.
  if (severity === "hidden") return null;

  return (
    <span
      className={cx(
        "timer",
        severity === "warn" && "timer-warn",
        severity === "alert" && "timer-alert"
      )}
      title={`Expires at ${title}`}
      role="status"
      aria-live="polite"
    >
      Session: {isExpired ? "expired" : formatHMS(remaining ?? 0)}
    </span>
  );
}
