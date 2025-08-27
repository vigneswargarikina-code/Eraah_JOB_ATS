import { Link, useLocation } from "react-router-dom";
import { BarChart3, Kanban } from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { href: "/kanban", label: "Kanban Board", icon: Kanban },
    { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card shadow-soft">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link 
              to="/" 
              className="text-xl font-extrabold text-blue-900"
            >
              Vigneswar's JobTracker
            </Link>
            
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-smooth
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
