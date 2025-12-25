import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export type NewsStat = { value: string; label: string };
export type NewsSection = { heading: string; body: string };
export type NewsQuote = { text: string; by: string };

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  publishedAt?: any;
  heroImageUrl?: string | null;
  isFeatured?: boolean;
  tags?: string[];
  stats?: NewsStat[];
  sections?: NewsSection[];
  quote?: NewsQuote | null;
};

export async function getNewsPosts(): Promise<NewsPost[]> {
  const q = query(collection(db, "news_posts"), orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));
}
