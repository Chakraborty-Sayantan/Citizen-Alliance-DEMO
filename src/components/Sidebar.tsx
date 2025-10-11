import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Users, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden text-center">
        <Link to="/profile" className="hover:opacity-90 transition-opacity">
          <div className="h-16 relative">
            {user?.backgroundImage ? (
              <img
                src={user.backgroundImage}
                alt="background"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-primary/20 to-primary/10" />
            )}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <Avatar className="h-16 w-16 border-4 border-card">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="text-lg">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="pt-10 px-4 pb-4">
            <h3 className="font-semibold mt-2 hover:underline">
              {user?.name || "User Name"}
            </h3>
            <p className="text-sm text-muted-foreground h-5 truncate">
              {user?.title || ""}
            </p>
          </div>
        </Link>
        <div className="flex justify-between items-center px-4 py-4 border-t text-sm">
          <div>
            <p className="text-muted-foreground">Connections</p>
            <p className="font-semibold text-primary">
              {user?.connections || 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Profile views</p>
            <p className="font-semibold text-primary">
              {user?.profileViews || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto p-2"
          >
            <Bookmark className="h-4 w-4" />
            <span className="text-sm">Saved items</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto p-2"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">Groups</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-auto p-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Events</span>
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-xs text-muted-foreground mb-2">Premium</p>
        <h4 className="font-semibold text-sm mb-2">Try Premium for free</h4>
        <p className="text-xs text-muted-foreground">
          Get access to exclusive tools and insights
        </p>
      </Card>
    </div>
  );
};

export default Sidebar;