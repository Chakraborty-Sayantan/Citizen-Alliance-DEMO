import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, disconnectUser } from "@/lib/api";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import {  AlertDialog,  AlertDialogAction,  AlertDialogCancel,  AlertDialogContent,  AlertDialogDescription,  AlertDialogFooter,  AlertDialogHeader,
  AlertDialogTitle,  AlertDialogTrigger,} from "@/components/ui/alert-dialog";


interface ConnectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connections: User[];
}

const ConnectionsDialog = ({
  open,
  onOpenChange,
  connections,
}: ConnectionsDialogProps) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const disconnectMutation = useMutation({
        mutationFn: disconnectUser,
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ["profile", user?.email] });
            toast({
                title: "Disconnected",
                description: "You have successfully disconnected from this user."
            })
        }
    })
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connections</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {connections && connections.length > 0 ? (
            connections.map((connectionUser) => (
              <div key={connectionUser._id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar>
                    <AvatarImage src={connectionUser.profileImage} />
                    <AvatarFallback>
                        {connectionUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                    </Avatar>
                    <div>
                    <Link
                        to={`/profile/${connectionUser.email}`}
                        onClick={() => onOpenChange(false)}
                    >
                        <p className="font-semibold hover:underline">{connectionUser.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">{connectionUser.title}</p>
                    </div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">Disconnect</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove {connectionUser.name} from your connections.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => disconnectMutation.mutate(connectionUser._id)}>Disconnect</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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