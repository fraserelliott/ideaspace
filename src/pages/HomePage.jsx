import { IdeaTable } from "@/components/IdeaTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { UI } from "@/styles";
import { useIdeas } from "@/contexts/IdeasContext";
import MarkdownViewer from "@/components/MarkdownViewer";
import { Ideatags } from "@/components/Ideatags";
import { TagSelector } from "@/components/TagSelector";
import { ErrorMessage } from "@/components/ErrorMessage";
import { includeIdea } from "@/utils/filterUtil";

export default function HomePage() {
  const navigate = useNavigate();
  const navigateToIdea = (idea) => navigate(`/ideas/${idea.slug}`);
  const [displayCards, setDisplayCards] = useState(() => {
    return localStorage.getItem("displayCards") === "true";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { ideas, ideatags, loading, error } = useIdeas();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSelectedTags = (tag, selected) => {
    const updatedTagIds = selected
      ? [...selectedTagIds, tag.id]
      : selectedTagIds.filter((id) => id !== tag.id);

    setSearchParams((prev) => {
      prev.delete("tags");

      updatedTagIds.forEach((id) => {
        prev.append("tags", id);
      });

      return prev;
    });
  };

  const selectedTagIds = searchParams
    .getAll("tags")
    .map(Number)
    .filter(Number.isInteger);

  const selectedTags = ideatags.filter((tag) =>
    selectedTagIds.includes(tag.id)
  );

  const filteredIdeas = useMemo(() => {
    if (!ideas) return null;
    return ideas.filter((idea) => includeIdea(idea, selectedTags, searchTerm));
  }, [ideas, selectedTags, searchTerm]);

  useEffect(() => {
    localStorage.setItem("displayCards", displayCards);
  }, [displayCards]);

  if (error) return <ErrorMessage message={error.message} />;

  if (loading || !ideas) return;

  return (
    <>
      <div className="fe-d-flex fe-justify-between" style={{ width: "80%" }}>
        <div className="fe-d-flex fe-gap-3">
          <button
            className={UI.BtnPrimary()}
            onClick={() => setDisplayCards((prev) => !prev)}
            style={{ minWidth: "7em" }}
          >
            {displayCards ? "Show Table" : "Show Cards"}
          </button>
          <input
            className={UI.InputPrimary()}
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TagSelector
          buttonText="Select Tags"
          selectedTags={selectedTags}
          onChange={updateSelectedTags}
        />
      </div>
      {!displayCards && (
        <IdeaTable
          publishedOnly
          actionLabel="Open"
          onAction={navigateToIdea}
          ideas={filteredIdeas}
        />
      )}
      {displayCards && (
        <IdeaCards onAction={navigateToIdea} ideas={filteredIdeas} />
      )}
    </>
  );
}

function IdeaCards({ onAction, searchTerm = "", ideas = [] }) {
  const { loading, error } = useIdeas();

  const filteredIdeas = useMemo(() => {
    return ideas.filter(
      (idea) =>
        idea.slug &&
        idea.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, ideas]);

  if (error) return <ErrorMessage message={error.message} />;

  if (loading || !ideas) return;

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
