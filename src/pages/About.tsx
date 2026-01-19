import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PerfumeCard from "../components/PerfumeCard";
import type { Perfume } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

type CollectionKey = "everyday" | "bold" | "refined" | "rare";

type CollectionDef = {
  key: CollectionKey;
  pill: string;
  pillTone?: "blue" | "pink" | "purple" | "green";
  title: string;
  description: string;
  imageText: string;
  includes: string[];
  ctaLabel: string;
};

const byNames = (all: Perfume[], names: string[]) => {
  const set = new Set(names.map((n) => n.toLowerCase().trim()));
  return all.filter((p) => set.has(p.name.toLowerCase().trim()));
};

const COLLECTIONS: CollectionDef[] = [
  {
    key: "everyday",
    pill: "MOST POPULAR",
    pillTone: "blue",
    title: "Everyday\nSignatures",
    description:
      "Your daily companions. These are the fragrances you reach for without thinking — versatile, balanced, and effortlessly wearable. Fresh, inviting, and memorable enough for any moment from morning coffee to evening drinks.",
    imageText: "For Every Day,\nEvery Way",
    includes: ["Mariana Trench", "Infinite Appeal", "Tropical Affair"],
    ctaLabel: "Explore Collection →",
  },
  {
    key: "bold",
    pill: "STATEMENT PIECES",
    pillTone: "pink",
    title: "Bold &\nCommanding",
    description:
      "For those who lead, not follow. These fragrances command attention and respect. Wood Caliph brings authority and power. Scentique radiates seductive confidence. These aren't background scents — they're the main event.",
    imageText: "Make Your\nPresence Known",
    includes: ["Wood Caliph", "Scentique"],
    ctaLabel: "Explore Collection →",
  },
  {
    key: "refined",
    pill: "FOR CONNOISSEURS",
    pillTone: "purple",
    title: "The Refined\nCollection",
    description:
      "Sophistication without trying. These are for the thinkers, the artists, the intellectuals. Wood Caliph’s elegant warmth. Leaf Legacy challenges conventions. Not for everyone — but perfect for those who appreciate complexity and nuance.",
    imageText: "Sophistication,\nRedefined",
    includes: ["Wood Caliph", "Leaf Legacy"],
    ctaLabel: "Explore Collection →",
  },
  {
    key: "rare",
    pill: "LIMITED AVAILABILITY",
    pillTone: "green",
    title: "Rare &\nUnconventional",
    description:
      "Leaf Legacy stands alone. This is not a fragrance for everyone — and that’s precisely the point. A polarizing, avant-garde experience that smells like rain-soaked earth and dense forest. For those seeking something truly rare.",
    imageText: "Rare.\nUnmistakable.",
    includes: ["Leaf Legacy"],
    ctaLabel: "Discover Leaf Legacy →",
  },
];

const About = () => {
  const navigate = useNavigate();

  const videos = useMemo(
    () => [
      "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv3.MP4?alt=media&token=aa06136c-7a5c-4148-988f-93226c19cf51",
      "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv8.MP4?alt=media&token=694b3004-ad13-4c28-a94a-a6b5f66314c5",
      "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv12.MP4?alt=media&token=ab3ef276-cd55-4e7c-b805-28248c50d5c3",
    ],
    []
  );

  const [activeVideo, setActiveVideo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToVideo = useCallback(
    (index: number) => {
      if (index === activeVideo) return;
      setActiveVideo(index);
      setIsAnimating(true);
      window.setTimeout(() => setIsAnimating(false), 350);
    },
    [activeVideo]
  );

  useEffect(() => {
    if (!videos.length) return;

    const timer = window.setInterval(() => {
      setActiveVideo((p) => (p + 1) % videos.length);
      setIsAnimating(true);
      window.setTimeout(() => setIsAnimating(false), 350);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [videos.length]);

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loadingPerfumes, setLoadingPerfumes] = useState(true);
  const [perfumeError, setPerfumeError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerfumes = async () => {
      try {
        const colRef = collection(db, "perfumes");
        const snapshot = await getDocs(colRef);

        const data: Perfume[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data() as Partial<Perfume>;

          return {
            id: docSnap.id,
            name: d.name ?? "",
            brand: d.brand ?? "",
            description: d.description ?? "",
            price: typeof d.price === "number" ? d.price : 0,
            imageUrl: d.imageUrl ?? "",
            notes: Array.isArray(d.notes) ? d.notes : [],
            tagline: d.tagline ?? "",
            quote: d.quote ?? "",
            stockText: d.stockText ?? "In Stock",
            currency: d.currency ?? "BHD",
            volume: d.volume ?? "",
            longevity: d.longevity ?? "",
            bestSeason: d.bestSeason ?? "",
            bestTime: d.bestTime ?? "",
            occasions: Array.isArray(d.occasions) ? d.occasions : [],
            perfectFor: Array.isArray(d.perfectFor) ? d.perfectFor : [],
          } as Perfume;
        });

        setPerfumes(data);
      } catch (e) {
        console.error(e);
        setPerfumeError("Failed to load perfumes.");
      } finally {
        setLoadingPerfumes(false);
      }
    };

    loadPerfumes();
  }, []);

  const [openKey, setOpenKey] = useState<CollectionKey | null>(null);

  const perfumesByCollection = useMemo(() => {
    return COLLECTIONS.reduce((acc, c) => {
      acc[c.key] = byNames(perfumes, c.includes);
      return acc;
    }, {} as Record<CollectionKey, Perfume[]>);
  }, [perfumes]);

  return (
    <main className="landing">
      <section className="hero-bleed">
        <section className="hero hero-static">
          <div className="hero-media">
            <img
              className="hero-image hero-image-current"
              src={
                "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fbanner.png?alt=media&token=e109b79a-ae88-459c-9c64-082e5895ac39"
              }
              alt="AQS DE PARFUM"
              draggable={false}
              decoding="async"
            />
          </div>

          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="hero-brand">AQS DE PARFUM</span>
            <h1>Find Your Reflection</h1>
            <p className="hero-notes">Crafted • Matured • Rare</p>

            <div className="hero-actions">
              <button className="primary" onClick={() => navigate("/products")}>
                Shop Collection
              </button>
            </div>
          </div>
        </section>
      </section>

      <section className="video-bleed">
        <div className="video-wrap">
          <div className={`video-stage ${isAnimating ? "is-animating" : ""}`}>
            <video
              key={videos[activeVideo]}
              className="video-player"
              src={videos[activeVideo]}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              preload="metadata"
            />
          </div>

          <div className="video-controls">
            <div className="video-dots">
              {videos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`dot ${i === activeVideo ? "active" : ""}`}
                  onClick={() => goToVideo(i)}
                  aria-label={`Go to video ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="collections">
        <div className="collections-hero">
          <h2 className="collections-title">Our Collections</h2>
          <p className="collections-sub">Seven fragrances. Three distinct philosophies.</p>
          <p className="collections-sub2">Find the scent that reflects who you are.</p>
        </div>

        <div className="collections-intro">
          <p>
            Every fragrance at Aqs de Parfum tells a story. We’ve organized our collection to help you
            discover yours. Whether you’re seeking everyday elegance, bold statements, or refined rarity
            — your reflection is here.
          </p>
        </div>

        {loadingPerfumes ? (
          <div className="collections-loading">
            <p className="muted">Loading collections…</p>
          </div>
        ) : perfumeError ? (
          <div className="collections-loading">
            <p style={{ color: "red" }}>{perfumeError}</p>
          </div>
        ) : (
          <div className="collections-list">
            {COLLECTIONS.map((c, idx) => {
              const isOpen = openKey === c.key;
              const products = perfumesByCollection[c.key] || [];
              const reverse = idx % 2 === 1;

              return (
                <section
                  key={c.key}
                  className={`collection-card ${reverse ? "reverse" : ""} ${
                    c.pillTone ? `tone-${c.pillTone}` : ""
                  } ${c.key === "rare" ? "rare-card" : ""}`}
                >
                  <div className="collection-inner">
                    <div className="collection-copy">
                      <div className="collection-pill">{c.pill}</div>

                      <h3 className="collection-h3">
                        {c.title.split("\n").map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>

                      <p className="collection-desc">{c.description}</p>

                      <div className="collection-includes">
                        <div className="includes-label">INCLUDES</div>
                        <div className="includes-chips">
                          {c.includes.map((name) => (
                            <span className="mini-chip" key={name}>
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="collection-cta"
                        onClick={() => setOpenKey((prev) => (prev === c.key ? null : c.key))}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "Close Collection ↑" : c.ctaLabel}
                      </button>
                    </div>

                    <div className="collection-art" aria-hidden="true">
                      <div className="collection-art-text">
                        {c.imageText.split("\n").map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`collection-expand ${isOpen ? "open" : ""}`}>
                    <div className="collection-expand-inner">
                      {products.length === 0 ? (
                        <p className="muted">No products found for this collection yet.</p>
                      ) : (
                      <div className={`showcase-rail collection-rail ${products.length === 1 ? "single" : ""}`}>
                          {products.map((p) => (
                            <div key={`${c.key}-${p.id}`} className="showcase-item">
                              <PerfumeCard perfume={p} />
                            </div>
                          ))}
                        </div>

                      )}

                      <div className="collection-bottom">
                        <Link className="link" to="/products">
                          View all products →
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <section className="collections-quiz">
          <h3>Not Sure Which Collection?</h3>
          <p>
            Take our 2-minute fragrance quiz and we’ll recommend the perfect AQS scent for your
            personality, lifestyle, and preferences.
          </p>
          <button className="quiz-btn" type="button" onClick={() => navigate("/contact")}>
            Take The Quiz →
          </button>
        </section>
      </section>
    </main>
  );
};

export default About;
