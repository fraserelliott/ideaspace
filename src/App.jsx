import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import { UI } from "@styles";
import { HomePage } from "@/pages/HomePage";

const repo = "/ideaspace/";
const basename = import.meta.env.PROD ? repo : "/";

export default function App() {
  return (
    <>
      <BrowserRouter basename={basename}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
