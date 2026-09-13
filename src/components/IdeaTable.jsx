import { UI } from "@/styles";

const mockData = [
  {
    id: 1,
    name: "Prawn Fried Rice",
    tags: ["Food", "Favourite", "Quick"],
    isIdea: false,
    updatedAt: "2026-09-12",
  },
  {
    id: 2,
    name: "Accurate Physics Platformer",
    tags: ["Game", "Platformer", "Physics"],
    isIdea: true,
    updatedAt: "2026-09-07",
  },
  {
    id: 3,
    name: "Stargate SG-1",
    tags: ["TV", "SciFi", "ExploringMorality", "Favourite"],
    isIdea: false,
    updatedAt: "2026-09-10",
  },
  {
    id: 4,
    name: "Carrot Cornbread Cake",
    tags: ["Food", "Dessert", "Baking"],
    isIdea: true,
    updatedAt: "2026-09-13",
  },
  {
    id: 5,
    name: "Code Geass",
    tags: ["TV", "Anime", "SciFi", "Rebellion"],
    isIdea: false,
    updatedAt: "2026-08-29",
  },
  {
    id: 6,
    name: "Words to Lose Friends",
    tags: ["Game", "Multiplayer", "WordGame"],
    isIdea: true,
    updatedAt: "2026-09-02",
  },
  {
    id: 7,
    name: "Cruel Intentions",
    tags: ["Film", "Drama", "Romance", "ExploringMorality"],
    isIdea: false,
    updatedAt: "2026-07-18",
  },
  {
    id: 8,
    name: "Smoked Tofu Salad",
    tags: ["Food", "Fresh", "LowEffort"],
    isIdea: false,
    updatedAt: "2026-08-26",
  },
  {
    id: 9,
    name: "Run Escape",
    tags: ["Game", "Multiplayer", "Comedy", "Goblin"],
    isIdea: true,
    updatedAt: "2026-09-11",
  },
  {
    id: 10,
    name: "A Needlessly Long Name to Test What the Table Does With It",
    tags: ["Software", "UI", "Testing", "VeryLongTagName", "AnotherTag"],
    isIdea: true,
    updatedAt: "2026-06-14",
  },
];

export function IdeaTable() {
  return (
    <div className={UI.Panel()} style={{ overflowX: "auto" }}>
      <table className="idea-table">
        <thead>
          <tr>
            <th className={UI.Heading()}>Name</th>
            <th className={UI.Heading()}>Tags</th>
            <th className={UI.Heading()}>Idea?</th>
            <th className={UI.Heading()}>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((entry) => {
            return (
              <tr key={entry.id} className="fe-p-em-1">
                <td>{entry.name}</td>
                <td>{renderTags(entry.tags)}</td>
                <td>{entry.isIdea ? "\u2713" : "\u2717"}</td>
                <td>{entry.updatedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderTags(tags) {
  return tags.join(" | ");
}
