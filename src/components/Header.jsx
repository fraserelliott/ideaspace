import { NavLink } from "react-router-dom";
import { UI } from "@styles";
import logo from "@assets/logo.png";

export function Header() {
  return (
    <div className="fe-d-flex fe-justify-between bg-secondary fe-items-center fe-w-100 box-shadow-subtle fes-bg-secondary">
      <img src={logo} alt="Logo" className="fe-p-em-1 logo" height="50" />
      {/* TODO: resize image file once settled on size */}
      <ul className={UI.Navbar()}>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => UI.NavItem(isActive)}
          >
            Login
          </NavLink>
        </li>
      </ul>
      <div />
    </div>
  );
}
