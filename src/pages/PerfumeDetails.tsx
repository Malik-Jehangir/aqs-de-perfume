import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import type { Perfume } from "../types";

const PerfumeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPerfume = async () => {
      try {
        const docRef = doc(db, "perfumes", id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          setError("Perfume not found.");
          setPerfume(null);
        } else {
          const data = snapshot.data();
          setPerfume({
            id: snapshot.id,
            name: data.name,
            brand: data.brand,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl,
            notes: data.notes || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load perfume details.");
      } finally {
        setLoading(false);
      }
    };

    loadPerfume();
  }, [id]);

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
        <Link to="/products">Back to products</Link>
      </main>
    );
  }

  return (
    <main className="page perfume-details content-details">
      <img src={perfume.imageUrl} alt={perfume.name} />
      <div className="details-info">
        <h1>{perfume.name}</h1>
        <h2>{perfume.brand}</h2>
        <p>{perfume.description}</p>
        <p className="price">{perfume.price.toFixed(2)} €</p>

        <h3>Notes</h3>
        <ul>
          {perfume.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

            <button className="primary" onClick={() => addToCart(perfume)}>
            Add to cart
            </button>
        <p>
            <Link className="back-link" to="/products">Back to products</Link>
        </p>
      </div>
    </main>
  );
};

export default PerfumeDetails;
