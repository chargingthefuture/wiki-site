const navItems = [
  { key: "home", label: "Home" },
  { key: "chyme", label: "Chyme" },
  { key: "services", label: "Services" },
  { key: "settings", label: "Settings" },
];

export function LeftNavigation() {
  return (
    <nav className="left-nav" aria-label="Main navigation">
      <div className="left-nav-brand">
        <h1>TI Skills Economy</h1>
        <p>Survivor-first super app</p>
      </div>

      <ul className="left-nav-list">
        {navItems.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={item.key === "chyme" ? "left-nav-item active" : "left-nav-item"}
              aria-current={item.key === "chyme" ? "page" : undefined}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="left-nav-footer">
        <p>Invite-only access enabled</p>
      </div>
    </nav>
  );
}
