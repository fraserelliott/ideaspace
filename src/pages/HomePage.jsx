import { IdeaTable } from "@/components/IdeaTable";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const navigateToIdea = (idea) => navigate(`/ideas/${idea.slug}`);

  return (
    <IdeaTable publishedOnly actionLabel="Open" onAction={navigateToIdea} />
  );
}
