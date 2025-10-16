import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, MessageSquare, UserPlus, Briefcase, Calendar, Repeat2 } from "lucide-react";
import { fetchNotifications, markAllNotificationsAsRead, Notification } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import io from 'socket.io-client';

const iconMap: { [key: string]: React.ElementType } = {
    like: ThumbsUp,
    comment: MessageSquare,
    reply: MessageSquare,
    repost: Repeat2,
    connection_request: UserPlus,
    connection_accepted: UserPlus,
    job: Briefcase,
    event: Calendar,
}

const Notifications = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
    });

    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on('new_notification', (newNotification) => {
            queryClient.setQueryData(['notifications'], (oldData: Notification[] | undefined) => {
                return [newNotification, ...(oldData || [])]
            })
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient]);


  const markAllReadMutation = useMutation({
      mutationFn: markAllNotificationsAsRead,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          toast({
              description: "All notifications marked as read."
          })
      }
  })

  const handleNotificationClick = (id: string) => {
    const updatedNotifications = notifications?.map(n => n._id === id ? { ...n, read: true } : n);
    queryClient.setQueryData(["notifications"], updatedNotifications);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <Button variant="link" onClick={() => markAllReadMutation.mutate()} disabled={!notifications?.some(n => !n.read)}>
                    Mark all as read
                </Button>
            </div>
            <div className="space-y-1">
              {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-start gap-4 p-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/4" />
                          </div>
                      </div>
                  ))
              ) : (
                notifications?.filter(n => n.sender).map((notification) => {
                    const Icon = iconMap[notification.type];
                    const notificationText = notification.type === 'like' ? `${notification.sender.name} liked your post.` :
                                             notification.type === 'comment' ? `${notification.sender.name} commented on your post.` :
                                             notification.type === 'reply' ? `${notification.sender.name} replied to your comment.` :
                                             notification.type === 'repost' ? `${notification.sender.name} reposted your post.` :
                                             notification.type === 'connection_request' ? `${notification.sender.name} sent you a connection request.` :
                                             notification.type === 'connection_accepted' ? `${notification.sender.name} accepted your connection request.` : "New notification";
                    const link = notification.post ? `/post/${notification.post._id}` : `/profile/${notification.sender.email}`;

                    return (
                    <Link to={link} key={notification._id} onClick={() => handleNotificationClick(notification._id)}>
                        <div
                        className={`flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${
                            !notification.read ? "bg-primary/5" : ""
                        }`}
                        >
                        <div className={`p-2 rounded-full ${
                            !notification.read ? "bg-primary/20" : "bg-muted"
                        }`}>
                            <Icon className={`h-5 w-5 ${
                            !notification.read ? "text-primary" : "text-muted-foreground"
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>
                                {notificationText}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                        {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        )}
                        </div>
                    </Link>
                )
            })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;