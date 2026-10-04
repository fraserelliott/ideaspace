import { useParams } from "react-router-dom";
import { useIdeas } from "@/contexts/IdeasContext";
import { useState, useEffect } from "react";
import PageNotFound from "./PageNotFound";
import MarkdownViewer from "@/components/MarkdownViewer";
import { UI } from "@/styles";

export default function IdeaPage() {
  const { slug } = useParams();
  const { getIdeaDetailsBySlugAsync } = useIdeas();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIdea(await getIdeaDetailsBySlugAsync(slug));
      setLoading(false);
    })();
  }, [slug, getIdeaDetailsBySlugAsync]);

  if (loading) return null;

  if (!idea) return <PageNotFound />;

  return (
    <div className={UI.Panel()}>
      <div className="fe-d-flex fe-justify-between fe-items-center">
        <h1 className={UI.Heading()}>{idea.name}</h1>
        <span className={idea.isIdea ? "fes-text-muted" : ""}>
          <span>{idea.isIdea ? "💡 Idea" : "📝 Note"}</span>
        </span>
      </div>
      <p className="fes-text-muted">
        {idea.ideatags.map((i) => i.name).join(" | ")}
      </p>
      <MarkdownViewer>{idea.content}</MarkdownViewer>
    </div>
  );
}
