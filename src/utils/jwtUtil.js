export function getJwtExpiryMs(token) {
  try {
    if (!token) return null;
    const seg = token.split(".")[1];
    if (!seg) return null;
    // base64url -> base64 + padding
    const b64 = seg.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64 + pad);
    const payload = JSON.parse(
      decodeURIComponent(
        Array.from(json)
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      )
    );
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null; // malformed token
  }
}
