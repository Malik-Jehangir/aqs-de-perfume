import { useState } from "react";
import { NavLink } from "react-router-dom";
import { subscribeToNewsletter } from "../services/newsletter";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [msg, setMsg] = useState<string>("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      await subscribeToNewsletter(email);
      setStatus("success");
      setMsg("Thank you for subscribing!");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMsg(err.message || "Subscription failed. Try again.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-column">
        <h4>Social Media</h4>
        <ul>
          <li><a href="https://instagram.com">Instagram</a></li>
          <li><a href="https://instagram.com">Facebook</a></li>
          <li><a href="https://instagram.com">TikTok</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Data Protection</a></li>
          <li><a href="#">Impressum</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Navigation</h4>
        <ul>
          <li><NavLink to="/">About us</NavLink></li>
          <li><NavLink to="/products">Our products</NavLink></li>
          <li><NavLink to="/contact">Contact us</NavLink></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Newsletter</h4>

        <form onSubmit={handleSubscribe}>
          <label className="newsletter-label">
            Subscribe:
            <div className="newsletter-row">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size={18}
                aria-label="Email address for newsletter"
                autoComplete="email"
              />

              <button
                type="submit"
                className="primary newsletter-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </label>

          {msg && (
            <p
              className="newsletter-msg"
              data-status={status}
            >
              {msg}
            </p>
          )}
        </form>
      </div>

      <div className="footer-bottom">
        © 2025 – Present · All rights reserved · Built & owned by <strong>MJAhmed</strong>
      </div>
    </footer>
  );
};

export default Footer;
