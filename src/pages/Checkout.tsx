import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CreditCard, QrCode, Wallet, Apple, Chrome } from "lucide-react";

type PayMethod = "benefitpay" | "paypal" | "applepay" | "googlepay";

const Checkout = () => {
  const { items } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("paypal");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.perfume.price * i.quantity, 0),
    [items]
  );
  const shipping = subtotal > 0 ? 3.5 : 0;
  const total = subtotal + shipping;

  const startPayment = async () => {
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          items: items.map((i) => ({
            id: i.perfume.id,
            name: i.perfume.name,
            price: i.perfume.price,
            quantity: i.quantity,
            imageUrl: i.perfume.imageUrl,
          })),
          currency: "BHD",
        }),
      });

      if (!res.ok) throw new Error("Payment session failed.");

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (data.qrUrl) {
        navigate(`/benefitpay/${data.sessionId}`, { state: data });
        return;
      }

      throw new Error("Unexpected payment response.");
    } catch (e: any) {
      setErr(e.message || "Payment failed.");
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <main className="page cart-page">
        <div className="cart-top">
          <div className="cart-header">
            <h1>Checkout</h1>
            <p className="muted">Your cart is empty.</p>
          </div>
          <Link className="link" to="/products">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-head">
        <p className="checkout-kicker">AQS DE PARFUM</p>
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-sub">Choose your payment method and complete your order.</p>
      </section>

      <section className="checkout-layout">
        <div className="checkout-left">
          <div className="checkout-card">
            <h2 className="checkout-card-title">Payment method</h2>

            <div className="pay-grid">
              <button
                type="button"
                className={`pay-option ${method === "benefitpay" ? "active" : ""}`}
                onClick={() => setMethod("benefitpay")}
              >
                <div className="pay-icon">
                  <QrCode size={18} />
                </div>
                <div className="pay-text">
                  <div className="pay-name">BenefitPay</div>
                  <div className="pay-desc">Bahrain QR payment</div>
                </div>
              </button>

              <button
                type="button"
                className={`pay-option ${method === "paypal" ? "active" : ""}`}
                onClick={() => setMethod("paypal")}
              >
                <div className="pay-icon">
                  <Wallet size={18} />
                </div>
                <div className="pay-text">
                  <div className="pay-name">PayPal</div>
                  <div className="pay-desc">Fast & secure</div>
                </div>
              </button>

              <button
                type="button"
                className={`pay-option ${method === "applepay" ? "active" : ""}`}
                onClick={() => setMethod("applepay")}
              >
                <div className="pay-icon">
                  <Apple size={18} />
                </div>
                <div className="pay-text">
                  <div className="pay-name">Apple Pay</div>
                  <div className="pay-desc">1-tap checkout</div>
                </div>
              </button>

              <button
                type="button"
                className={`pay-option ${method === "googlepay" ? "active" : ""}`}
                onClick={() => setMethod("googlepay")}
              >
                <div className="pay-icon">
                  <Chrome size={18} />
                </div>
                <div className="pay-text">
                  <div className="pay-name">Google Pay</div>
                  <div className="pay-desc">Quick payment</div>
                </div>
              </button>
            </div>

            <div className="pay-hint">
              <CreditCard size={16} />
              <span>
                Payments are processed securely. You’ll be redirected to complete payment.
              </span>
            </div>

            {err && <div className="checkout-error">{err}</div>}

            <button
              className="primary checkout-cta"
              disabled={loading}
              onClick={startPayment}
            >
              {loading ? "Starting payment..." : `Pay ${total.toFixed(2)} BHD`}
            </button>

            <p className="checkout-fine">
              By placing this order, you agree to our terms and privacy policy.
            </p>
          </div>

          <div className="checkout-card subtle">
            <h3 className="checkout-card-title">Need help?</h3>
            <p className="muted">
              Contact us anytime. We reply fast and take care of you.
            </p>
            <Link className="link" to="/contact">Contact support</Link>
          </div>
        </div>

        <aside className="checkout-right">
          <div className="summary-card">
            <h2 className="summary-title">Order summary</h2>

            <div className="summary-lines">
              {items.map((i) => (
                <div key={i.perfume.id} className="summary-item">
                  <div className="summary-thumb">
                    <img src={i.perfume.imageUrl} alt={i.perfume.name} loading="lazy" />
                  </div>
                  <div className="summary-info">
                    <div className="summary-name">{i.perfume.name}</div>
                    <div className="summary-meta">
                      <span className="muted">{i.perfume.brand}</span>
                      <span className="muted">× {i.quantity}</span>
                    </div>
                  </div>
                  <div className="summary-price">
                    {(i.perfume.price * i.quantity).toFixed(2)} BHD
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span className="muted">Subtotal</span>
              <span>{subtotal.toFixed(2)} BHD</span>
            </div>
            <div className="summary-row">
              <span className="muted">Shipping</span>
              <span>{shipping.toFixed(2)} BHD</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>{total.toFixed(2)} BHD</span>
            </div>

            <Link className="link" to="/cart">Edit cart</Link>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Checkout;
