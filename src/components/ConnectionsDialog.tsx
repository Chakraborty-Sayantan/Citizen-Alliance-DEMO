import {Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { User } from "@/lib/api";
  import { Link } from "react-router-dom";
  
  interface ConnectionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    connections: string[];
    allUsers: User[];
  }
  
  const ConnectionsDialog = ({
    open,
    onOpenChange,
    connections,
    allUsers,
  }: ConnectionsDialogProps) => {
    const connectionUsers = allUsers.filter(user => connections.includes(user.email));
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connections</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {connectionUsers.length > 0 ? (
              connectionUsers.map(user => (
                <div key={user.email} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/profile/${user.email}`} onClick={() => onOpenChange(false)}>
                      <p className="font-semibold hover:underline">{user.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">{user.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No connections to display.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ConnectionsDialog;