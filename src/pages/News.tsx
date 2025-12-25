import { useEffect, useState } from "react";
import { getNewsPosts, type NewsPost } from "../services/news";

const News = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNewsPosts();
        setPosts(data);
        setOpenId(data[0]?.id ?? null);
      } catch (e) {
        console.error(e);
        setError("Failed to load news feed.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <h1>News</h1>
        <p>Loading updates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>News</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  if (posts.length === 0) {
    return (
      <main className="page">
        <h1>News</h1>
        <p>No posts yet.</p>
      </main>
    );
  }

  const featured = posts.find((p) => p.isFeatured) ?? posts[0];

  return (
    <main className="news-page">
      <section className="news-hero">
        <div className="news-hero-inner">
          <p className="news-kicker">AQS DE PARFUM — NEWS FEED</p>
          <h1 className="news-title">{featured.title}</h1>
          {featured.subtitle && <p className="news-subtitle">{featured.subtitle}</p>}
          <div className="news-hero-meta">
            <span className="news-chip">Featured</span>
            {(featured.tags || []).slice(0, 4).map((t) => (
              <span key={t} className="news-chip ghost">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="news-wrap">
        {posts.map((post) => {
          const isOpen = openId === post.id;

          return (
            <article key={post.id} className={`news-card ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="news-card-head"
                onClick={() => setOpenId((prev) => (prev === post.id ? null : post.id))}
              >
                <div>
                  <h2 className="news-card-title">{post.title}</h2>
                  {post.subtitle && <p className="news-card-sub">{post.subtitle}</p>}
                </div>
                <span className="news-toggle">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="news-card-body">
                  {post.stats?.length ? (
                    <div className="news-stats">
                      {post.stats.map((s) => (
                        <div key={s.label} className="news-stat">
                          <div className="news-stat-value">{s.value}</div>
                          <div className="news-stat-label">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {post.quote?.text ? (
                    <div className="news-quote">
                      <p className="news-quote-text">“{post.quote.text}”</p>
                      <p className="news-quote-by">{post.quote.by}</p>
                    </div>
                  ) : null}

                  {(post.sections || []).map((sec) => (
                    <div key={sec.heading} className="news-section">
                      <h3>{sec.heading}</h3>
                      <p className="news-body">{sec.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default News;
