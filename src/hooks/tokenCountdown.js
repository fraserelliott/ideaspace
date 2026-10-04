import { useEffect, useMemo, useRef, useState } from "react";
import { getJwtExpiryMs } from "@/utils/jwtUtil";

export function useTokenCountdown(
  token,
  { warnAtMs = 5 * 60 * 1000, onWarn } = {}
) {
  const [expiresAt, setExpiresAt] = useState(() => getJwtExpiryMs(token));
  const [now, setNow] = useState(() => Date.now());
  const warned = useRef(false);

  // Recompute when token changes (login/logout)
  useEffect(() => {
    setExpiresAt(getJwtExpiryMs(token));
    warned.current = false;
  }, [token]);

  // Tick every second while we have a known expiry
  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const remaining = useMemo(() => {
    if (!expiresAt) return null;
    return Math.max(0, expiresAt - now);
  }, [expiresAt, now]);

  useEffect(() => {
    if (remaining == null || !onWarn) return;
    if (remaining > 0 && remaining <= warnAtMs && !warned.current) {
      warned.current = true;
      onWarn(remaining);
    }
  }, [remaining, warnAtMs, onWarn]);

  return {
    expiresAt,
    remaining,
    isExpired: remaining === 0,
  };
}
