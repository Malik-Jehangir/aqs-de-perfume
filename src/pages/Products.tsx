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
          const docData = doc.data();
          return {
            id: doc.id,
            name: docData.name,
            brand: docData.brand,
            description: docData.description,
            price: docData.price,
            imageUrl: docData.imageUrl,
            notes: docData.notes || [],
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
