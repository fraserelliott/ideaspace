import { NavLink } from "react-router-dom";
import { UI } from "@styles";
import { useAuth } from "@/contexts/AuthContext";
import { LoggedInTimer } from "./LoggedInTimer";
import logo from "@assets/logo.png";

const navLinks = {
  loggedIn: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/images", label: "Images" },
    { to: "/tags", label: "Tags" },
    { to: "/logout", label: "Logout" },
  ],
  loggedOut: [{ to: "/login", label: "Login" }],
  shared: [{ to: "/", label: "Home" }],
};

export function Header() {
  const { isOptimisticallyLoggedIn } = useAuth();

  return (
    <div className="fe-d-flex fe-justify-between bg-secondary fe-items-center fe-w-100 box-shadow-subtle fes-bg-secondary">
      <div className="fe-d-flex fe-items-center">
        <img src={logo} alt="Logo" className="fe-p-em-1 logo" height="50" />
        <LoggedInTimer />
      </div>
      {/* TODO: resize image file once settled on size */}
      <ul className={UI.Navbar()}>
        {renderLinks(navLinks.shared)}
        {isOptimisticallyLoggedIn && renderLinks(navLinks.loggedIn)}
        {!isOptimisticallyLoggedIn && renderLinks(navLinks.loggedOut)}
      </ul>
      <div />
    </div>
  );
}

function renderLinks(links) {
  return links.map((entry) => (
    <li key={entry.label}>
      <NavLink
        to={entry.to}
        className={({ isActive }) => UI.NavItem(isActive && "navlink-active")}
      >
        {entry.label}
      </NavLink>
    </li>
  ));
}
