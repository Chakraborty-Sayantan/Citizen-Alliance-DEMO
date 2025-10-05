import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Users, Briefcase, MessageSquare, Bell, Grid3x3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Users, label: "My Network", path: "/network" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: MessageSquare, label: "Messaging", path: "/messaging" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card border-b shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/home">
              <h1 className="text-xl font-bold text-primary">LinkLedge</h1>
            </Link>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="w-64 pl-10 bg-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center gap-1 h-14 px-4 rounded-none border-b-2 ${
                    isActive(item.path)
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs hidden lg:block">{item.label}</span>
                </Button>
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-14 px-4 rounded-none border-b-2 border-transparent text-muted-foreground hover:text-foreground"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">ME</AvatarFallback>
                  </Avatar>
                  <span className="text-xs hidden lg:block">Me</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-14 px-4 rounded-none border-b-2 border-transparent text-muted-foreground hover:text-foreground"
            >
              <Grid3x3 className="h-5 w-5" />
              <span className="text-xs hidden lg:block">For Business</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
