import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const repo = "/ideaspace/";
const basename = import.meta.env.PROD ? repo : "/";

export default function App() {
  return (
    <>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
