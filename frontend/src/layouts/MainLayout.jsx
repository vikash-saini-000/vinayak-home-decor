import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingParticles from '../components/ui/FloatingParticles';
import useLenis from '../hooks/useLenis';

const MainLayout = ({ children }) => {
  const { pathname } = useLocation();
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      <FloatingParticles count={20} />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
