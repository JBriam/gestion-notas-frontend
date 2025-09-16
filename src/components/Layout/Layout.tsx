import Footer from "../Body/Footer";
import Header from "../Body/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}