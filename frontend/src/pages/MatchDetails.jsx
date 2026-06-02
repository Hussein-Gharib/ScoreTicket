import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/common/Button";

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticketCategories, setTicketCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicketCategories = async () => {
      try {
        const response = await api.get(`/ticket-categories/match/${id}`);
        setTicketCategories(response.data.ticketCategories);
      } catch (error) {
        console.log("Failed to fetch ticket categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketCategories();
  }, [id]);

  const handleBookTicket = async (ticketCategoryId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    setBookingLoading(true);

    try {
      await api.post(
        "/orders",
        {
          match_id: Number(id),
          ticket_category_id: ticketCategoryId,
          quantity: 1,
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
    return <p>Loading tickets...</p>;
  }

  return (
    <section className="match-details-page">
      <div className="section-header">
        <span>Ticket categories</span>
        <h1>Choose your ticket</h1>
        <p>Select a category and continue to booking.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      {ticketCategories.length === 0 && (
        <div className="empty-card">
          <h2>No tickets available</h2>
          <p>Ticket categories for this match will appear here soon.</p>
        </div>
      )}

      <div className="ticket-grid">
        {ticketCategories.map((category) => (
          <article className="ticket-card" key={category.id}>
            <h2>{category.name}</h2>
            <p>{category.available_quantity} tickets available</p>

            <div className="ticket-card__price">${category.price}</div>

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
        ))}
      </div>
    </section>
  );
}

export default MatchDetails;