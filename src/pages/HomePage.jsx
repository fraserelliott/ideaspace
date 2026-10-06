import { IdeaTable } from "@/components/IdeaTable";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { UI } from "@/styles";
import { useIdeas } from "@/contexts/IdeasContext";
import MarkdownViewer from "@/components/MarkdownViewer";
import { Ideatags } from "@/components/Ideatags";

export default function HomePage() {
  const navigate = useNavigate();
  const navigateToIdea = (idea) => navigate(`/ideas/${idea.slug}`);
  const [displayCards, setDisplayCards] = useState(false);

  return (
    <>
      <button
        className={UI.BtnPrimary()}
        onClick={() => setDisplayCards((prev) => !prev)}
        style={{ minWidth: "7em" }}
      >
        {displayCards ? "Show Table" : "Show Cards"}
      </button>
      {!displayCards && (
        <IdeaTable publishedOnly actionLabel="Open" onAction={navigateToIdea} />
      )}
      {displayCards && <IdeaCards onAction={navigateToIdea} />}
    </>
  );
}

function IdeaCards({ onAction, searchTerm = "" }) {
  const { loading, error, ideas } = useIdeas();

  const filteredIdeas = useMemo(() => {
    return ideas.filter(
      (idea) =>
        idea.slug &&
        idea.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, ideas]);

  console.log(filteredIdeas);

  if (error) return <ErrorMessage message={error.message} />;

  if (loading) return;

  return (
    <div className="fe-d-flex fe-flex-wrap fe-gap-5 fe-justify-center">
      {filteredIdeas.map((idea) => (
        <div
          className={UI.Panel("card")}
          key={idea.id}
          onClick={() => onAction?.(idea)}
        >
          <span>{idea.isIdea ? "💡 Idea" : "📝 Note"}</span>
          <span>{idea.name}</span>
          <Ideatags muted tags={idea.ideatags} />
          <div className="fe-grow-1">
            <MarkdownViewer>{idea.summary}</MarkdownViewer>
          </div>
        </div>
      ))}
    </div>
  );
}
