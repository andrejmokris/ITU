import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ModeToggle } from './components/mode-toggle';
import { UserNav } from './components/nav-bar/user-nav';
import { MainNav } from './components/nav-bar/main-nav';
import { LogInPage } from './pages/log-in-page';
import { HomePage } from './pages/home-page';
import { useEffect } from 'react';
import { api_client } from './utils/api-client';
import { Toaster } from './components/ui/toaster';
import { toast } from './components/ui/use-toast';
import { Footer } from './components/footer';
import { ShopDetailPage } from './pages/shop-detail-page';

function App() {
  const currentPath = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentPath.pathname.startsWith('/login')) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: 'You need to log in',
          variant: 'destructive'
        });
        navigate('/login');
      }
      api_client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [currentPath.pathname, navigate]);

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
          <Route path="/login" Component={LogInPage} />
          <Route path="/shop/:id" Component={ShopDetailPage} />
        </Routes>
        <Toaster />
        {!location.pathname.startsWith('/login') && <Footer />}
      </div>
    </div>
  );
}

export default App;
