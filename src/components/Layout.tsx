import React, { useState, useEffect } from "react";

const navItems = [
  { id: "hero", label: "פתיחה" },
  { id: "background", label: "רקע" },
  { id: "flow", label: "מהלך" },
  { id: "roles", label: "תפקידים" },
  { id: "facilitation", label: "הנחיה" },
  { id: "reflection", label: "רפלקציה" },
  { id: "summary", label: "סיכום" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems.map((n) => document.getElementById(n.id));
      let current = "hero";
      sections.forEach((sec) => {
        if (sec && window.scrollY >= sec.offsetTop - 100) {
          current = sec.id;
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="ניווט ראשי"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 100,
          height: "var(--nav-h)",
          background: scrolled
            ? "rgba(10,14,26,0.95)"
            : "rgba(10,14,26,0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            aria-label="חזרה לדף הבית"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--gradient-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.85rem",
                color: "white",
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--white)",
                letterSpacing: "0.02em",
              }}
            >
              AI Master
            </span>
          </button>

          {/* Desktop nav */}
          <ul
            role="list"
            style={{
              display: "flex",
              gap: 4,
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  aria-current={active === item.id ? "page" : undefined}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color:
                      active === item.id
                        ? "var(--cyan-light)"
                        : "var(--muted)",
                    fontWeight: active === item.id ? 700 : 500,
                    fontSize: "0.9rem",
                    padding: "6px 12px",
                    borderRadius: 6,
                    transition: "color 0.2s",
                    fontFamily: "var(--font)",
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile burger */}
          <button
            className="mobile-burger"
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "8px 10px",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span style={{ display: "block", width: 20, height: 2, background: "var(--text)", borderRadius: 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "var(--text)", borderRadius: 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "var(--text)", borderRadius: 1 }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          role="dialog"
          aria-label="תפריט ניווט"
          style={{
            position: "fixed",
            top: "var(--nav-h)",
            right: 0,
            left: 0,
            zIndex: 99,
            background: "var(--navy-mid)",
            borderBottom: "1px solid var(--navy-border)",
            padding: "16px 24px 24px",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "right",
                background: "none",
                border: "none",
                cursor: "pointer",
                color:
                  active === item.id ? "var(--cyan-light)" : "var(--text)",
                fontWeight: active === item.id ? 700 : 500,
                fontSize: "1.05rem",
                padding: "12px 0",
                borderBottom: "1px solid var(--navy-border)",
                fontFamily: "var(--font)",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <main style={{ paddingTop: "var(--nav-h)" }}>{children}</main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Layout;
