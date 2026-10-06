import "@fraserelliott/fe-components/stylesheet";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "@components/Header";
import { Footer } from "@components/Footer";
import {
  ToastMessageDisplay,
  OptionalPortal,
} from "@fraserelliott/fe-components";
import HomePage from "@/pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import DashboardPage from "./pages/DashboardPage";
import IdeaPage from "./pages/IdeaPage";
import PageNotFound from "./pages/PageNotFound";
import ImagePage from "./pages/ImagePage";
import TagsPage from "./pages/TagsPage";

const repo = "/ideaspace/";
const basename = import.meta.env.PROD ? repo : "/";

export default function App() {
  return (
    <>
      <BrowserRouter basename={basename}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/images" element={<ImagePage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/ideas/:slug" element={<IdeaPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <OptionalPortal portalTarget={document.body}>
        <ToastMessageDisplay />
      </OptionalPortal>
    </>
  );
}
