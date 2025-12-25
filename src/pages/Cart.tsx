import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.perfume.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <main className="page cart-page">
        <div className="cart-header">
          <h1>Your Bag</h1>
          <p className="muted">
            Your bag is empty. <Link to="/products" className="link">Explore products</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page cart-page">
      <div className="cart-top">
        <div className="cart-header">
          <h1>Your Bag</h1>
          <p className="muted">{items.length} item(s)</p>
        </div>

        <Link to="/products" className="link">
          Continue shopping →
        </Link>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article key={item.perfume.id} className="cart-item">
              <div className="cart-thumb">
                <img src={item.perfume.imageUrl} alt={item.perfume.name} />
              </div>

              <div className="cart-meta">
                <div className="cart-meta-top">
                  <div>
                    <h3 className="cart-name">{item.perfume.name}</h3>
                    <p className="cart-brand muted">{item.perfume.brand}</p>
                  </div>

                  <div className="cart-price">
                    {(item.perfume.price * item.quantity).toFixed(2)} €
                  </div>
                </div>

                <div className="cart-meta-bottom">
                  <div className="cart-line muted">
                    Unit price: {item.perfume.price.toFixed(2)} €
                  </div>
                  <div className="cart-line muted">
                    Quantity: <strong>{item.quantity}</strong>
                  </div>

                  <button
                    className="link-button"
                    onClick={() => removeFromCart(item.perfume.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span className="muted">Subtotal</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>

            <div className="summary-row">
              <span className="muted">Shipping</span>
              <span className="muted">Calculated at checkout</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>

            <button className="primary summary-cta" onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </button>

            <p className="summary-note muted">
              Taxes and shipping are calculated during checkout.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
