import { useEffect, useMemo, useRef, useState } from "react";

type TimelineItem = {
  title: string;
  body: string;
  more?: string;
  tag?: string;
};

function useInViewOnce<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options ?? { threshold: 0.25 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

function useTimelineProgress(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const start = vh * 0.2;
      const end = vh * 0.8;

      const total = rect.height + (end - start);
      const current = start - rect.top;

      const raw = current / total;
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  return progress;
}


const StoryTimeline = () => {
  const items: TimelineItem[] = useMemo(
    () => [
      {
        tag: "01",
        title: "The Frustration",
        body:
          "It started with a simple frustration. Everyone smells the same. Walk into any room in Bahrain and you'll find the same viral perfumes, the same clones, the same mass-produced scents that promise luxury but deliver sameness.",
      },
      {
        tag: "02",
        title: "The Question",
        body:
          "We asked ourselves: Where's the rarity? Where's the individuality? Where's the perfume that feels like YOU – not like everyone else?",
        more: "We couldn't find it. So, we built it.",
      },
      {
        tag: "03",
        title: "The Journey",
        body:
          "Aqs wasn't born in a boardroom. It was born on the road — sleepless nights driving from one city to another. One country to another.",
        more:
          "Searching for ingredients that most people don't even know exist. Meeting craftsmen who've spent their lives perfecting single notes.",
      },
      {
        tag: "04",
        title: "The Persistence",
        body:
          "We spent months on formulas. Not weeks. Months. And when it wasn't right — when the blend didn't feel like what we imagined — we threw it away and started from scratch. Again. And again.",
        more:
          "There were moments of doubt. Moments of embarrassment. Moments when nothing seemed to work and the easier path was to quit. But we didn't. Because this was never just about perfume — it was about belief. Friendship. Standing next to each other when everything felt impossible.",
      },
      {
        tag: "05",
        title: "The Process",
        body:
          "Every AQS fragrance is matured for 2 years. Two years of patience. Two years of letting the notes find each other. Two years of waiting for depth to develop.",
        more:
          "In a world of instant everything, we chose to wait. We source ingredients from across the globe — places most brands never visit, from craftsmen most brands never meet. Then we blend. Test. Refine. Wait. And only when it's truly ready, we bottle it. Not for the masses. For you.",
      },
      {
        tag: "06",
        title: "What We Believe",
        body:
          "Your perfume should be your reflection. Not what's trending. Not what the influencer wore. Not what your friend bought. Yours.",
        more:
          "A scent that makes you feel like the best version of yourself. That carries your energy. That tells your story without you saying a word. We don't make perfumes for everyone — we make perfumes for individuals.",
      },
      {
        tag: "07",
        title: "The Name",
        body:
          'Aqs (عكس) means "reflection" in Arabic. Because when you wear our fragrance, you’re not wearing our story. You’re wearing yours.',
        more: "Every bottle is a mirror. What you smell is who you are.",
      },
      {
        tag: "08",
        title: "The Future",
        body:
          "Today, we're a perfume house in Bahrain. Tomorrow, we'll be a global symbol of handcrafted luxury — perfume, clothing, leather, timepieces.",
        more:
          "Everything made with the same obsession, the same patience, the same belief. This is just the beginning. And we're glad you're here for it. AQS DE PARFUM — Find Your Reflection.",
      },
    ],
    []
  );

  const timelineRef = useRef<HTMLElement | null>(null);
  const progress = useTimelineProgress(timelineRef);

  return (
    <section className="story-timeline" ref={timelineRef as any}>
      <header className="story-head">
        <p className="story-kicker">AQS DE PARFUM</p>
        <h2>Our Story</h2>
        <p className="story-sub">A reflection — revealed chapter by chapter.</p>
      </header>

      <div className="timeline">
        <div className="timeline-line" />

        <div
          className="timeline-line-progress"
          style={{ transform: `scaleY(${progress})` }}
          aria-hidden="true"
        />

        {items.map((item, idx) => (
          <TimelineCard key={item.title} item={item} index={idx} />
        ))}
      </div>
    </section>
  );
};

const TimelineCard = ({ item, index }: { item: TimelineItem; index: number }) => {
  const side = index % 2 === 0 ? "left" : "right";
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.25 });

  const [expanded, setExpanded] = useState(false);

  return (
    <div ref={ref} className={`timeline-row ${side} ${inView ? "show" : ""}`}>
      <div className="timeline-dot" aria-hidden="true" />

      <article className="timeline-card">
        <div className="timeline-top">
          <span className="timeline-tag">{item.tag}</span>
          <h3 className="timeline-title">{item.title}</h3>
        </div>

        <p className="timeline-body">{item.body}</p>

        {item.more && (
          <>
            <div className={`timeline-more ${expanded ? "open" : ""}`}>
              <p>{item.more}</p>
            </div>

            <button
              type="button"
              className="timeline-toggle"
              onClick={() => setExpanded((p) => !p)}
            >
              {expanded ? "Read less" : "Read more"}
              <span className={`chev ${expanded ? "up" : ""}`}>▾</span>
            </button>
          </>
        )}
      </article>
    </div>
  );
};

export default StoryTimeline;
