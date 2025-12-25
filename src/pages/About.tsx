import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryTimeline from "../components/StoryTimeline";

const slides = [
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-rose.JPG?alt=media&token=f478d53d-948c-45e7-80f3-e26bb73b4810",
    title: "SCENTIQUE",
    notes: "Pear • Rose • Patchouli",
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-amber.JPG?alt=media&token=2ade499a-d15c-4c38-b4cc-019926643e44",
    title: "INFINITE APPEAL",
    notes: "Orange Blossom • Bergamot • Amber",
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-marine.JPG?alt=media&token=43a070d0-eaca-4dad-83d3-e33a9d933f8c",
    title: "MARIANA TRENCH",
    notes: "Bergamot • Seaweed • Calone • Musk • Cedar",
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-leaf.JPG?alt=media&token=5b5d43ce-758c-4233-b2a6-2542f7115f8f",
    title: "LEAF LEGACY",
    notes: "Green • Citrus • Musk",
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-legacy.JPG?alt=media&token=d4c2a726-d7c2-478e-9466-8def2dd7e5f0",
    title: "LEGACY",
    notes: "Green • Citrus • Musk",
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-ocean.JPG?alt=media&token=fb31ad18-dcea-497d-aaab-9855016915cf",
    title: "OCEANAIRE",
    notes: "Bergamot • Seaweed • Calone • Musk • Cedar",
  },
  {
    url: "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fhero-seaweed.JPG?alt=media&token=07e47aff-46d8-4636-b561-b7e56de929a4",
    title: "SEAWEED",
    notes: "Bergamot • Seaweed • Calone",
  },
];

const About = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const current = slides[active];
  const previous = slides[prev];

  useEffect(() => {
    const nextIndex = (active + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].url;
  }, [active]);

  const goToSlide = (index: number) => {
    if (index === active) return;
    setPrev(active);
    setActive(index);
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 650);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      goToSlide((active + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <main className="landing">
      <section className="hero-bleed">
        <section
          className={`hero ${isAnimating ? "is-animating" : ""}`}
          style={
            {
              ["--hero-bg" as any]: `url(${current.url})`,
            } as React.CSSProperties
          }
        >
          <div className="hero-media">
            <img
              className="hero-image hero-image-prev"
              src={previous.url}
              alt={previous.title}
              draggable={false}
              decoding="async"
            />
            <img
              className="hero-image hero-image-current"
              src={current.url}
              alt={current.title}
              draggable={false}
              decoding="async"
            />
          </div>

          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="hero-brand">AQS DE PARFUM</span>
            <h1>{current.title}</h1>
            <p className="hero-notes">{current.notes}</p>

            <div className="hero-actions">
              <button className="primary" onClick={() => navigate("/products")}>
                Shop Collection
              </button>
            </div>

            <div className="hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`dot ${i === active ? "active" : ""}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="story">
        <StoryTimeline />
      </section>
    </main>
  );
};

export default About;
