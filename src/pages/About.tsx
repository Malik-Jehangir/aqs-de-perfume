import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryTimeline from "../components/StoryTimeline";

const About = () => {
  const navigate = useNavigate();

  const videos = useMemo(
    () => ["https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv1.MP4?alt=media&token=9fc7a985-01a7-4d53-af75-d1463eedce2d", "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv2.MP4?alt=media&token=5ce8973a-6137-4565-a944-ebc37b4d793e", "https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv3.MP4?alt=media&token=aa06136c-7a5c-4148-988f-93226c19cf51","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv4.MP4?alt=media&token=8b1596c0-7d41-4ed8-b860-b14335e70a92","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv5.MP4?alt=media&token=a2e5d41f-e884-4b1f-b7ea-cb3b6445e6bb","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv6.MP4?alt=media&token=61d501ce-b92a-47bc-a467-330bcfabafb8","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv7.MP4?alt=media&token=57927954-cd86-4860-b4da-4defac798f12","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv8.MP4?alt=media&token=694b3004-ad13-4c28-a94a-a6b5f66314c5","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv9.MP4?alt=media&token=438b3a42-6ec9-4b31-a2f4-93e8f42eb4a9","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv10.MP4?alt=media&token=8fecf3bc-2cbd-4906-b9d6-72da8450c798","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv11.MP4?alt=media&token=a5082795-d046-472f-87d9-67829a30687d","https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/videos%2Fv12.MP4?alt=media&token=ab3ef276-cd55-4e7c-b805-28248c50d5c3"],
    []
  );

  const [activeVideo, setActiveVideo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToVideo = useCallback(
    (index: number) => {
      if (index === activeVideo) return;
      setActiveVideo(index);
      setIsAnimating(true);
      window.setTimeout(() => setIsAnimating(false), 550);
    },
    [activeVideo]
  );

  useEffect(() => {
    if (!videos.length) return;

    const timer = window.setInterval(() => {
      setActiveVideo((p) => (p + 1) % videos.length);
      setIsAnimating(true);
      window.setTimeout(() => setIsAnimating(false), 550);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [videos.length]);

  return (
    <main className="landing">
      <section className="hero-bleed">
        <section className="hero hero-static">
          <div className="hero-media">
            <img
              className="hero-image hero-image-current"
              src={"https://firebasestorage.googleapis.com/v0/b/aqs-de-parfum.firebasestorage.app/o/perfumes%2Fbanner.png?alt=media&token=e109b79a-ae88-459c-9c64-082e5895ac39"}
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

      <section className="story">
        <StoryTimeline />
      </section>
    </main>
  );
};

export default About;
