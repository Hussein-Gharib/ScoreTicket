function Admin() {
  return (
    <section className="admin-page">
      <div className="section-header">
        <span>Admin Panel</span>
        <h1>Manage ScoreTicket</h1>
        <p>Add teams, stadiums, matches, and ticket categories.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Teams</h2>
          <p>Create and manage football teams.</p>
        </div>

        <div className="admin-card">
          <h2>Stadiums</h2>
          <p>Add stadium information and capacity.</p>
        </div>

        <div className="admin-card">
          <h2>Matches</h2>
          <p>Create upcoming football fixtures.</p>
        </div>

        <div className="admin-card">
          <h2>Ticket Categories</h2>
          <p>Add Standard, Premium, and VIP ticket options.</p>
        </div>
      </div>
    </section>
  );
}

export default Admin;