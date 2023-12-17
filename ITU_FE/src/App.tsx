/**
 * Author: Andrej Mokris xmokri01
 */

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ModeToggle } from './components/mode-toggle';
import { UserNav } from './components/nav-bar/user-nav';
import { MainNav } from './components/nav-bar/main-nav';
import { LogInPage } from './pages/log-in-page';
import { HomePage } from './pages/home-page';
import { useEffect } from 'react';
import { api_client } from './utils/api-client';
import { Toaster } from './components/ui/toaster';
import { Footer } from './components/footer';
import { ShopDetailPage } from './pages/shop-detail-page';
import useAuthStore from './store/user-store';
import { EventsPage } from './pages/events-page';
import { CalendarPage } from './pages/calendar-page';
import { MarketplacePage } from './pages/marketplace-page';
import { MyOrdersPage } from './pages/MyOrders/my-orders';
import EventDetailPage from './pages/event-detail-page';

function App() {
  const currentPath = useLocation();
  const navigate = useNavigate();

  const userStore = useAuthStore();

  useEffect(() => {
    const verifyUser = async () => {
      const resp = await userStore.fetchUser();
      if (!resp) {
        navigate('/login');
      }
    };
    if (!userStore.isAuthenticated) {
      verifyUser();
    }
    const token = localStorage.getItem('authToken');
    api_client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen w-full">
      {!currentPath.pathname.startsWith('/login') && (
        <div className="border-b mb-4 w-full sticky top-0 dark:bg-[#020817] bg-white z-20">
          <div className="flex h-16 items-center px-4">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
              <ModeToggle />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center w-full h-full relative flex-grow">
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/home" Component={HomePage} />
          <Route path="/events" Component={EventsPage} />
          <Route path="/events/:id" Component={EventDetailPage} />
          <Route path="/login" Component={LogInPage} />
          <Route path="/shop/:id" Component={ShopDetailPage} />
          <Route path="/calendar" Component={CalendarPage} />
          <Route path="/marketplace" Component={MarketplacePage} />
          <Route path="/myorders" Component={MyOrdersPage} />
        </Routes>
        <Toaster />
        {!location.pathname.startsWith('/login') && <Footer />}
      </div>
    </div>
  );
}

export default App;
