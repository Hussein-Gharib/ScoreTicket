import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <Sidebar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
