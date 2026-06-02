import "../styles/global.css";

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      {children}
    </div>
  );
}

export default MainLayout;