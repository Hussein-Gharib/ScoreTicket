import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bug,
  ChevronDown,
  CircleUserRound,
  Headphones,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  WalletCards,
} from "lucide-react";

const supportCategories = [
  {
    title: "My Account",
    description: "Profile settings, password help, and account security.",
    icon: CircleUserRound,
  },
  {
    title: "Tickets & Payments",
    description: "Bookings, digital tickets, payments, and refund information.",
    icon: WalletCards,
  },
  {
    title: "Match Tickets",
    description: "Ticket categories, availability, and match-day questions.",
    icon: Ticket,
  },
  {
    title: "Technical Issues",
    description: "Report loading problems, errors, or unexpected behavior.",
    icon: Bug,
  },
];

const faqs = [
  {
    question: "How do I find my booked tickets?",
    answer:
      "Log in to your account and open My Tickets from the sidebar. Every valid booking connected to your account will appear there.",
  },
  {
    question: "Can I cancel or refund a ticket?",
    answer:
      "Refund availability depends on the event policy. Contact support with your ticket code and booking details so the request can be reviewed.",
  },
  {
    question: "Why is my ticket not showing?",
    answer:
      "Make sure you are logged in with the same account used for the booking. You can also refresh the page and check whether the booking request completed successfully.",
  },
  {
    question: "How can I change my account information?",
    answer:
      "Open Settings from the sidebar. You will be able to update your username, email, notification preferences, and password once those settings are connected to the backend.",
  },
];

function Support() {
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return faqs;
    }

    return faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(normalizedSearch) ||
        faq.answer.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  return (
    <main className="support-page">
      <section className="support-hero">
        <p className="support-eyebrow">SUPPORT CENTER</p>

        <h1>How can we help you?</h1>

        <p className="support-hero-text">
          Search our help center or choose a category to find answers about
          your account, bookings, payments, and tickets.
        </p>

        <div className="support-search-wrapper">
          <Search size={24} />

          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search for articles, topics, or error messages..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="support-shortcut">
            <kbd>CTRL</kbd>
            <kbd>K</kbd>
          </div>
        </div>

        <div className="support-popular">
          <span>Popular:</span>
          <button type="button" onClick={() => setSearchTerm("password")}>
            Reset password
          </button>
          <button type="button" onClick={() => setSearchTerm("ticket")}>
            Ticket help
          </button>
          <button type="button" onClick={() => setSearchTerm("refund")}>
            Refund policy
          </button>
        </div>
      </section>

      <section className="support-category-grid">
        {supportCategories.map((category) => {
          const Icon = category.icon;

          return (
            <article className="support-category-card" key={category.title}>
              <div className="support-category-icon">
                <Icon size={30} />
              </div>

              <h2>{category.title}</h2>
              <p>{category.description}</p>
            </article>
          );
        })}
      </section>

      <section className="support-faq-section">
        <div className="support-section-heading">
          <div>
            <p className="support-eyebrow">COMMON QUESTIONS</p>
            <h2>Frequently asked questions</h2>
          </div>

          <button className="support-view-all" type="button">
            View all
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="support-faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="support-empty-search">
              No support articles matched your search.
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openQuestion === index;

              return (
                <article
                  className={`support-faq-item ${isOpen ? "is-open" : ""}`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="support-faq-question"
                    onClick={() =>
                      setOpenQuestion((currentQuestion) =>
                        currentQuestion === index ? null : index
                      )
                    }
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={22} />
                  </button>

                  {isOpen && (
                    <div className="support-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="support-contact-section">
        <div className="support-contact-heading">
          <div className="support-contact-main-icon">
            <Headphones size={28} />
          </div>

          <h2>Still need help?</h2>

          <p>
            Choose the support option that fits your problem. The buttons are
            UI only for now and can be connected to the backend next.
          </p>
        </div>

        <div className="support-contact-grid">
          <article className="support-contact-card">
            <MessageCircle size={30} />
            <h3>Live Chat</h3>
            <p>Start a quick conversation with the support team.</p>
            <button type="button">Start Chat</button>
          </article>

          <article className="support-contact-card">
            <Mail size={30} />
            <h3>Email Support</h3>
            <p>Send us a detailed message about your issue.</p>
            <button type="button">Send Email</button>
          </article>

          <article className="support-contact-card">
            <Users size={30} />
            <h3>Community</h3>
            <p>Find answers and discuss matches with other fans.</p>
            <button type="button">Visit Community</button>
          </article>
        </div>

        <div className="support-security-note">
          <ShieldCheck size={20} />
          <span>
            Never share your password, database information, or private token
            with support.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Support;