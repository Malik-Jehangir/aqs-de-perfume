import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { ShoppingBag } from "lucide-react";

const Header = () => {
  const { totalItems } = useCart();
  const [user, setUser] = useState<User | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [homeMenuOpen, setHomeMenuOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setHomeMenuOpen(false);
    setMobileOpen(false);
  };

  const goTo = (path: string) => {
    navigate(path);
    closeAllMenus();
  };

  const handleLogout = async () => {
    await signOut(auth);
    closeAllMenus();
    navigate("/");
  };

  const handleContinueAsGuest = async () => {
    await signOut(auth).catch(() => {});
    closeAllMenus();
  };

  return (
    <header className="header">
      <button
            type="button"
            className="logo-btn"
            onClick={() => goTo("/")}
            aria-label="Go to homepage"
            >
            <img
                src="https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Flogo.png?alt=media&token=46091a74-e718-4413-992f-30556e316df1"
                alt="AQS DE PARFUM"
                className="logo-img"
                loading="eager"
                decoding="async"
            />
        </button>


      <button
        className="hamburger"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((p) => !p)}
      >
        ☰
      </button>

      <nav className="nav desktop-nav">
        <div className="nav-dropdown">
          <button
            className="nav-link nav-dropdown-toggle"
            onClick={() => setHomeMenuOpen((p) => !p)}
          >
            Home ▾
          </button>

          {homeMenuOpen && (
            <div className="nav-dropdown-menu">
              <button onClick={() => goTo("/about")}>About us</button>
              <button onClick={() => goTo("/founder-message")}>
                Founder&apos;s message
              </button>
              <button onClick={() => goTo("/our-story")}>Our story</button>
              <button onClick={() => goTo("/news")}>News feed</button>
            </div>
          )}
        </div>

        <NavLink to="/products" className="nav-link" onClick={closeAllMenus}>
          Our products
        </NavLink>
        <NavLink to="/contact" className="nav-link" onClick={closeAllMenus}>
          Contact us
        </NavLink>
      </nav>

 <div className="header-right desktop-account">
                <button
            className="cart-icon-btn"
            onClick={() => goTo("/cart")}
            aria-label="View cart"
            >
            <ShoppingBag
                size={18}
                strokeWidth={1.7}
                className="cart-lucide"
            />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>


        <div className="account-wrapper">
            {!user ? (
            <div className="dropdown">
                <button
                className="profile-button"
                onClick={() => setMenuOpen((p) => !p)}
                >
                Account ▾
                </button>
                {menuOpen && (
                <div className="dropdown-menu">
                    <button onClick={() => goTo("/signin")}>User sign in</button>
                    <button onClick={() => goTo("/signup")}>User sign up</button>
                    <button onClick={handleContinueAsGuest}>Continue as guest</button>
                </div>
                )}
            </div>
            ) : (
            <div className="dropdown">
                <button
                className="profile-button"
                onClick={() => setMenuOpen((p) => !p)}
                >
                <span className="profile-icon">👤</span>
                <span className="profile-email">{user.email || "Profile"}</span>
                <span className="caret">▾</span>
                </button>
                {menuOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-info">
                    Signed in as <br />
                    <strong>{user.email}</strong>
                    </div>
                    <button onClick={handleLogout}>Logout</button>
                </div>
                )}
            </div>
            )}
        </div>
        </div>


      {mobileOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={closeAllMenus}>
            ✕
          </button>

          <div className="mobile-section">
            <div className="mobile-title">Home</div>
            <button onClick={() => goTo("/about")}>About us</button>
            <button onClick={() => goTo("/founder-message")}>
              Founder&apos;s message
            </button>
            <button onClick={() => goTo("/our-story")}>Our story</button>
            <button onClick={() => goTo("/news")}>News feed</button>
          </div>

          <div className="mobile-section">
            <button onClick={() => goTo("/products")}>Our products</button>
            <button onClick={() => goTo("/contact")}>Contact us</button>
            <button onClick={() => goTo("/cart")}>
              View cart ({totalItems})
            </button>
          </div>

          <div className="mobile-section">
            {!user ? (
              <>
                <button onClick={() => goTo("/signin")}>User sign in</button>
                <button onClick={() => goTo("/signup")}>User sign up</button>
                <button onClick={handleContinueAsGuest}>
                  Continue as guest
                </button>
              </>
            ) : (
              <>
                <div className="mobile-title">Signed in</div>
                <div className="mobile-muted">{user.email}</div>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
