import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const currentPath = useLocation();

  const navItems = {
    '/': {
      name: 'Home',
      privateRoute: false
    }
  };
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {Object.entries(navItems).map(([path, { name }], i) => {
        const isActive = currentPath.pathname.startsWith(path);
        return (
          <Link
            to={path}
            key={i}
            className={`text-xs sm:text-sm transition-colors hover:text-primary ${isActive && 'font-bold'}`}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
