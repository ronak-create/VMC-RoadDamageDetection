import { motion } from "framer-motion"
import { MapPin, AlertTriangle, Settings, User, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: MapPin, href: "/" },
    { label: "Reports", icon: AlertTriangle, href: "/#reports" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="relative flex items-center justify-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 h-9 w-9 rounded-xl border-2 border-primary/30"
            />
          </div>
          <div className="font-display font-bold text-xl">
            <span className="text-primary">Road</span>
            <span className="text-secondary">Zen</span>
          </div>
        </motion.div>

        {/* Navigation */}
        {user && (
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </motion.a>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {user ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">User profile</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="default"
                className="hidden sm:flex bg-gradient-primary hover:shadow-glow transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              className="hidden sm:flex bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header;
