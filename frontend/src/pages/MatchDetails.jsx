import { useEffect, useState } from "react";
import { Check, Info, ShieldCheck, Ticket } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/common/Button";

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketCategories, setTicketCategories] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`/ticket-categories/match/${id}`)
      .then((response) => setTicketCategories(response.data.ticketCategories || []))
      .catch(() => setPageError("Failed to load tickets. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuantityChange = (categoryId, value) => setSelectedQuantities((current) => ({ ...current, [categoryId]: Number(value) }));

  const handleBookTicket = async (ticketCategoryId) => {
    if (!token) return navigate("/login");
    const quantity = selectedQuantities[ticketCategoryId] || 1;
    setError("");
    setBookingLoading(true);
    try {
      await api.post("/orders", { match_id: Number(id), ticket_category_id: ticketCategoryId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/my-tickets");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading tickets</div>;
  if (pageError) return <section className="empty-state"><div><h1>Something went wrong</h1><p>{pageError}</p></div></section>;

  return (
    <section className="page-shell match-details-page">
      <div className="page-heading-row">
        <div><span className="eyebrow">Ticket marketplace</span><h1>Choose your seats</h1><p>Select your preferred ticket category and quantity.</p></div>
        <div className="secure-badge"><ShieldCheck size={18} />Secure booking</div>
      </div>

      {error && <div className="form-error">{error}</div>}
      <div className="booking-layout">
        <div className="ticket-listing-grid">
          {ticketCategories.length === 0 && <div className="empty-card"><h2>No tickets available</h2><p>Ticket categories for this match will appear here soon.</p></div>}
          {ticketCategories.map((category, index) => {
            const selectedQuantity = selectedQuantities[category.id] || 1;
            return (
              <article className={`ticket-listing ${index === 1 ? "ticket-listing--featured" : ""}`} key={category.id}>
                <div className="ticket-listing__icon"><Ticket /></div>
                <div className="ticket-listing__body">
                  <div><span className="eyebrow">{index === 1 ? "Most popular" : "Available category"}</span><h2>{category.name}</h2></div>
                  <ul><li><Check size={15} />Digital mobile ticket</li><li><Check size={15} />Verified entry</li><li><Check size={15} />Instant confirmation</li></ul>
                  <p>{category.available_quantity} tickets remaining</p>
                </div>
                <div className="ticket-listing__buy">
                  <span>From</span><strong>${category.price}</strong>
                  <label>Quantity<input type="number" min="1" max={category.available_quantity} value={selectedQuantity} onChange={(event) => handleQuantityChange(category.id, event.target.value)} disabled={category.available_quantity <= 0} /></label>
                  <Button disabled={bookingLoading || category.available_quantity <= 0} onClick={() => handleBookTicket(category.id)}>{category.available_quantity <= 0 ? "Sold Out" : bookingLoading ? "Booking..." : "Book Now"}</Button>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="booking-info glass-card"><Info size={22} /><h3>Booking protection</h3><p>Your ticket order is processed securely. Each successful booking creates a unique ticket code in your account.</p><div><span>Secure checkout</span><span>Verified inventory</span><span>Account delivery</span></div></aside>
      </div>
    </section>
  );
}

export default MatchDetails;
