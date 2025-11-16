import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, Receipt, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Pricing", path: "#pricing" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg blur-md group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gradient-primary p-2 rounded-lg shadow-colored">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <span className="text-xl md:text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              TripSplit
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="font-medium"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/trips")}
                  className="font-medium"
                >
                  My Trips
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.name || user?.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="font-medium"
                >
                  Sign In
                </Button>

                <Button
                  onClick={() => navigate("/signup")}
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background/95 backdrop-blur-lg",
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 space-y-2 border-t border-border mt-4">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {user?.name || user?.email}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick("/dashboard")}
                    className="w-full justify-start font-medium"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick("/trips")}
                    className="w-full justify-start font-medium"
                  >
                    My Trips
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start font-medium text-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick("/login")}
                    className="w-full justify-start font-medium"
                  >
                    Log In
                  </Button>

                  <Button
                    onClick={() => handleNavClick("/signup")}
                    className="w-full shadow-md"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
