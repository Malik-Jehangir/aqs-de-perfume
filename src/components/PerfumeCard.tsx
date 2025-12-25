import { Link } from "react-router-dom";
import type { Perfume } from "../types";

type Props = {
  perfume: Perfume;
};

const PerfumeCard = ({ perfume }: Props) => {
  return (
    <div className="perfume-card">
      <img src={perfume.imageUrl} alt={perfume.name} />
      <h3>{perfume.name}</h3>
      <p className="brand">{perfume.brand}</p>
      <p className="price">{perfume.price.toFixed(2)} €</p>
      <Link to={`/products/${perfume.id}`} className="details-button">
        View details
      </Link>
    </div>
  );
};

export default PerfumeCard;
