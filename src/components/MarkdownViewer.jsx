import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useImages } from "../contexts/ImagesContext.jsx";
import "../assets/github-markdown-dark.css";

function replaceCustomImages(markdown) {
  return (markdown || "").replace(
    /\{\{image:([a-zA-Z0-9_-]+)(?:\s+width:(\d+))?(?:\s+height:(\d+))?\}\}/g,
    (_, name, width, height) => {
      const params = new URLSearchParams();
      if (width) params.set("width", width);
      if (height) params.set("height", height);
      const qs = params.toString();
      return `![${name}](image://${name}${qs ? `?${qs}` : ""})`;
    }
  );
}

export default function MarkdownViewer({ children, className }) {
  const { getImage, loading, error } = useImages();

  if (loading || error) return <div className={className || ""} />;

  // Replace {{image:fraser width:100 height:100}}
  const processed = replaceCustomImages(children);
  const allowImageUri = (uri) =>
    uri?.startsWith("image://") ||
    uri?.startsWith("http") ||
    uri?.startsWith("/")
      ? uri
      : "";
  const allowLinkUri = (uri) => uri;

  return (
    <div className={`markdown-body ${className || ""}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={allowImageUri}
        linkTransform={allowLinkUri}
        components={{
          // Intercept images with custom scheme
          img: ({ src, alt, ...rest }) => {
            if (src?.startsWith("image://")) {
              // Parse image://name?width=...&height=...
              let name = "";
              let width, height;
              try {
                const url = new URL(src);
                name = url.hostname; // after image://
                width = url.searchParams.get("width") || undefined;
                height = url.searchParams.get("height") || undefined;
              } catch {
                // bad URL; fall back to plain text
                return <span>[invalid image token]</span>;
              }

              const image = getImage(name);
              if (!image) return <span>[missing image: {name}]</span>;

              return (
                <img
                  src={image.url}
                  alt={alt || name}
                  width={width}
                  height={height}
                  loading="lazy"
                  {...rest}
                />
              );
            }

            // Normal markdown images render as usual
            return <img src={src} alt={alt} {...rest} />;
          },
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
