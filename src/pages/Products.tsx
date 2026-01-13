import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import PerfumeCard from "../components/PerfumeCard";
import type { Perfume } from "../types";
import { db } from "../firebase";

const Products = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerfumes = async () => {
      try {
        const colRef = collection(db, "perfumes");
        const snapshot = await getDocs(colRef);

          const data: Perfume[] = snapshot.docs.map((doc) => {
            const d = doc.data() as Partial<Perfume>;

            return {
              id: doc.id,
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
            };
          });


        setPerfumes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadPerfumes();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <h1>Our Products</h1>
        <p>Loading perfumes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>Our Products</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Our Products</h1>
      <div className="products-grid">
        {perfumes.map((perfume) => (
          <PerfumeCard key={perfume.id} perfume={perfume} />
        ))}
      </div>
    </main>
  );
};

export default Products;
