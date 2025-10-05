import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, UserPlus, Briefcase, Calendar } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      type: "like",
      icon: ThumbsUp,
      text: "Sarah Johnson and 12 others liked your post",
      time: "2h ago",
      unread: true
    },
    {
      type: "comment",
      icon: MessageSquare,
      text: "Michael Chen commented on your post",
      time: "5h ago",
      unread: true
    },
    {
      type: "connection",
      icon: UserPlus,
      text: "Emily Rodriguez accepted your connection request",
      time: "1d ago",
      unread: false
    },
    {
      type: "job",
      icon: Briefcase,
      text: "New job posting matches your profile: Senior Developer at TechCorp",
      time: "2d ago",
      unread: false
    },
    {
      type: "event",
      icon: Calendar,
      text: "Reminder: Tech Conference 2025 starts tomorrow",
      time: "3d ago",
      unread: false
    },
    {
      type: "like",
      icon: ThumbsUp,
      text: "Your post is getting attention! 50+ people viewed it",
      time: "4d ago",
      unread: false
    },
    {
      type: "connection",
      icon: UserPlus,
      text: "David Lee wants to connect with you",
      time: "5d ago",
      unread: false
    },
    {
      type: "comment",
      icon: MessageSquare,
      text: "New comment on your article about AI trends",
      time: "1w ago",
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${
                    notification.unread ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    notification.unread ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <notification.icon className={`h-5 w-5 ${
                      notification.unread ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.unread ? "font-medium" : ""}`}>
                      {notification.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
