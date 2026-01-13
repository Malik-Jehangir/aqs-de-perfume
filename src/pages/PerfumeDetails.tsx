import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import type { Perfume } from "../types";
import { Clock, Droplet, Heart, Sun, Watch } from "lucide-react";

const splitNotesString = (raw: unknown): string[] => {
  if (!raw || typeof raw !== "string") return [];

  const cleaned = raw
    .replaceAll('"', "")
    .replaceAll("“", "")
    .replaceAll("”", "")
    .trim();

  return cleaned
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

const PerfumeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPerfume = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, "perfumes", id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          setError("Perfume not found.");
          setPerfume(null);
          return;
        }

        const data: any = snapshot.data();

        setPerfume({
          id: snapshot.id,
          name: data.name,
          brand: data.brand,
          description: data.description,
          price: Number(data.price ?? 0),
          imageUrl: data.imageUrl,
          notes: Array.isArray(data.notes) ? data.notes : [],
          tagline: data.tagline,
          quote: data.quote,
          stockText: data.stockText,
          currency: data.currency,
          volume: data.volume,
          longevity: data.longevity,
          bestSeason: data.bestSeason,
          bestTime: data.bestTime,
          occasions: Array.isArray(data.occasions) ? data.occasions : [],
          perfectFor: Array.isArray(data.perfectFor) ? data.perfectFor : [],
        } as Perfume);
      } catch (err) {
        console.error(err);
        setError("Failed to load perfume details.");
        setPerfume(null);
      } finally {
        setLoading(false);
      }
    };

    loadPerfume();
  }, [id]);

  const currencySymbol = (perfume as any)?.currency || "BHD";
  const stockText = (perfume as any)?.stockText || "In Stock";
  const tagline = (perfume as any)?.tagline || "";
  const quote = (perfume as any)?.quote || "";
  const [expanded, setExpanded] = useState(false);


  const notesParsed = useMemo(() => {
    const arr: unknown[] = Array.isArray((perfume as any)?.notes) ? (perfume as any).notes : [];
    const topRaw = arr[0];
    const heartRaw = arr[1];
    const baseRaw = arr[2];

    return {
      top: splitNotesString(topRaw),
      heart: splitNotesString(heartRaw),
      base: splitNotesString(baseRaw),
    };
  }, [perfume]);

  const stats = {
    volume: (perfume as any)?.volume || "100ml / 3.4 oz",
    longevity: (perfume as any)?.longevity || "8-12 Hours",
    bestSeason: (perfume as any)?.bestSeason || "Spring & Summer",
    bestTime: (perfume as any)?.bestTime || "Anytime",
  };

  const occasions: string[] =
    ((perfume as any)?.occasions && Array.isArray((perfume as any).occasions)
      ? (perfume as any).occasions
      : []) || [];

  const perfectFor: string[] =
    ((perfume as any)?.perfectFor && Array.isArray((perfume as any).perfectFor)
      ? (perfume as any).perfectFor
      : []) || [];

  if (loading) {
    return (
      <main className="page">
        <h1>Loading perfume...</h1>
      </main>
    );
  }

  if (error || !perfume) {
    return (
      <main className="page">
        <h1>{error || "Perfume not found"}</h1>
        <Link to="/about">Back to products</Link>
      </main>
    );
  }

  const renderBold = (text: string) =>
  text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );

  return (
    <main className="pdp page">
      <div className="pdp-shell">
        <nav className="pdp-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/about">Fragrances</Link>
          <span className="sep">/</span>
          <span className="current">{perfume.name}</span>
        </nav>

        <section className="pdp-grid">
          <aside className="pdp-left">
            <div className="pdp-media">
              <img src={perfume.imageUrl} alt={perfume.name} />
            </div>

            <div className="pdp-trust">
              <span>✓ 100% Authentic</span>
              <span>✓ 14-Day Returns</span>
              <span>✓ Handcrafted</span>
            </div>
          </aside>

          <article className="pdp-right">
            <header className="pdp-head">
              <div className="pdp-kicker">{perfume.brand}</div>
              <h1 className="pdp-title">{perfume.name}</h1>
              {tagline ? <p className="pdp-tagline">{tagline}</p> : null}

              <div className="pdp-buyrow">
                <div className="pdp-price">
                  <span className="amount">{Number(perfume.price).toFixed(2)}</span>
                  <span className="cur">{currencySymbol}</span>
                </div>
                <span className="pdp-stock">{stockText}</span>
              </div>
            </header>

      <section className="pdp-story">
              <div className={`pdp-desc-wrap ${expanded ? "expanded" : ""}`}>
                {perfume.description
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p className="pdp-desc" key={index}>
                      {renderBold(paragraph)}
                    </p>
                  ))}
              </div>

              <button
                className="pdp-readmore"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            </section>

              <section className="pdp-origin">
                <p>
                  <strong>Handcrafted in Bahrain.</strong> Not a dupe. An original.
                </p>
              </section>


            {quote ? (
              <section className="pdp-quote" aria-label="Highlight">
                <div className="pdp-quote-title">YOUR SIGNATURE FRAGRANCE</div>
                <p className="pdp-quote-text">“{quote}”</p>
              </section>
            ) : null}

            <section className="pdp-section">
              <h2 className="pdp-h2">Fragrance Notes</h2>

              <div className="pdp-notes">
                <div className="note-block">
                  <div className="note-title">TOP NOTES</div>
                  <div className="note-chips">
                    {(notesParsed.top.length ? notesParsed.top : ["—"]).map((n) => (
                      <span className="chip" key={`top-${n}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="note-block">
                  <div className="note-title">HEART NOTES</div>
                  <div className="note-chips">
                    {(notesParsed.heart.length ? notesParsed.heart : ["—"]).map((n) => (
                      <span className="chip" key={`heart-${n}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="note-block">
                  <div className="note-title">BASE NOTES</div>
                  <div className="note-chips">
                    {(notesParsed.base.length ? notesParsed.base : ["—"]).map((n) => (
                      <span className="chip" key={`base-${n}`}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="pdp-section">
              <div className="pdp-stats">
                <div className="stat">
                  <Droplet className="stat-icon" />
                  <div className="stat-label">VOLUME</div>
                  <div className="stat-value">{stats.volume}</div>
                </div>

                <div className="stat">
                  <Clock className="stat-icon" />
                  <div className="stat-label">LONGEVITY</div>
                  <div className="stat-value">{stats.longevity}</div>
                </div>

                <div className="stat">
                  <Sun className="stat-icon" />
                  <div className="stat-label">BEST SEASON</div>
                  <div className="stat-value">{stats.bestSeason}</div>
                </div>

                <div className="stat">
                  <Watch className="stat-icon" />
                  <div className="stat-label">BEST TIME</div>
                  <div className="stat-value">{stats.bestTime}</div>
                </div>
              </div>
            </section>

            {occasions.length > 0 ? (
              <section className="pdp-section">
                <h2 className="pdp-h2">Occasions</h2>
                <div className="pdp-chips">
                  {occasions.map((o) => (
                    <span className="chip" key={o}>
                      {o}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="pdp-cta">
               <div className="pdp-cta-row">
                    <button className="primary pdp-add" onClick={() => addToCart(perfume)}>
                      ADD TO CART
                    </button>

                    <button
                      className="pdp-fav"
                      type="button"
                      aria-label="Add to favorites"
                      onClick={() => {
                        // TODO: hook this into favorites logic / firestore later
                        console.log("favorite:", perfume.id);
                      }}
                    >
                      <Heart className="pdp-fav-icon" />
                    </button>
                  </div>
              <div className="pdp-trustline">
                <span>✓ 100% Authentic</span>
                <span>✓ 14-Day Returns</span>
                <span>✓ Made with care</span>
              </div>

              <div className="pdp-back">
                <Link className="back-link" to="/about">
                  Back to products
                </Link>
              </div>
            </section>

            {perfectFor.length > 0 ? (
              <section className="pdp-section">
                <h2 className="pdp-h2">Perfect For</h2>
                <ul className="pdp-checklist">
                  {perfectFor.map((p) => (
                    <li key={p}>✓ {p}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
};

export default PerfumeDetails;
