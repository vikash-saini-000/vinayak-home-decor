import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

const DashboardLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-20 pb-20 md:pb-8">
      <Outlet />
    </main>
    <MobileNav />
  </div>
);

export default DashboardLayout;
