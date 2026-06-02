import { useEffect, useState } from "react";
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
    const fetchTicketCategories = async () => {
      try {
        const response = await api.get(`/ticket-categories/match/${id}`);
        setTicketCategories(response.data.ticketCategories);
      } catch (error) {
        console.log("Failed to fetch ticket categories:", error);
        setPageError("Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketCategories();
  }, [id]);

  const handleQuantityChange = (categoryId, value) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [categoryId]: Number(value),
    });
  };

  const handleBookTicket = async (ticketCategoryId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    const quantity = selectedQuantities[ticketCategoryId] || 1;

    setError("");
    setBookingLoading(true);

    try {
      await api.post(
        "/orders",
        {
          match_id: Number(id),
          ticket_category_id: ticketCategoryId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/my-tickets");
    } catch (error) {
      setError(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading tickets</div>;
  }

  if (pageError) {
    return (
      <section className="empty-state">
        <div>
          <h1>Something went wrong</h1>
          <p>{pageError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="match-details-page">
      <div className="section-header">
        <span>Ticket categories</span>
        <h1>Choose your ticket</h1>
        <p>Select a category, choose quantity, and continue to booking.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      {ticketCategories.length === 0 && (
        <div className="empty-card">
          <h2>No tickets available</h2>
          <p>Ticket categories for this match will appear here soon.</p>
        </div>
      )}

      <div className="ticket-grid">
        {ticketCategories.map((category) => {
          const selectedQuantity = selectedQuantities[category.id] || 1;

          return (
            <article className="ticket-card" key={category.id}>
              <h2>{category.name}</h2>
              <p>{category.available_quantity} tickets available</p>

              <div className="ticket-card__price">${category.price}</div>

              <label className="quantity-field">
                Quantity
                <input
                  type="number"
                  min="1"
                  max={category.available_quantity}
                  value={selectedQuantity}
                  onChange={(event) =>
                    handleQuantityChange(category.id, event.target.value)
                  }
                  disabled={category.available_quantity <= 0}
                />
              </label>

              <Button
                disabled={bookingLoading || category.available_quantity <= 0}
                onClick={() => handleBookTicket(category.id)}
              >
                {category.available_quantity <= 0
                  ? "Sold Out"
                  : bookingLoading
                  ? "Booking..."
                  : "Book Ticket"}
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MatchDetails;