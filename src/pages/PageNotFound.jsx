import { UI } from "@/styles";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className={UI.Panel("fe-items-center panel-small")}>
        <p>An idea once came into view,</p>
        <p>But nobody wrote down a clue.</p>
        <p>It vanished instead,</p>
        <p>From both server and head.</p>
        <p>So this page hasn't got one for you.</p>
        <br />

        <button
          className={UI.BtnPrimary("fe-grow-0")}
          onClick={() => navigate("/", { replace: true })}
        >
          Return to IdeaSpace
        </button>
      </div>
    </>
  );
}
