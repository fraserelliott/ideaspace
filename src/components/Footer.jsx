const links = [
  { name: "GitHub", url: "https://github.com/fraserelliott" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/fraser-elliott-77100974/",
  },
];

export function Footer() {
  return (
    <footer className="fes-bg-secondary fe-py-2 fe-w-100 fe-text-center fes-shadow-subtle">
      &copy; Fraser Elliott 2026 |{" "}
      {links.map((link, i) => (
        <span key={link.name}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
          {i < links.length - 1 && " | "}
        </span>
      ))}
    </footer>
  );
}
