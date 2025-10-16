import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllUsers,
  User,
  fetchConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  sendConnectionRequest,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Network = () => {
  const { toast } = useToast();
  const { user: currentUser, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const { data: invitations, isLoading: isLoadingInvitations } = useQuery<User[]>({
    queryKey: ["connectionRequests", currentUser?.email],
    queryFn: () => fetchConnectionRequests(),
    enabled: !!currentUser?.email,
  });

  const acceptMutation = useMutation({
    mutationFn: (fromUser: User) => acceptConnectionRequest(fromUser._id),
    onSuccess: (_, fromUser) => {
      queryClient.invalidateQueries({ queryKey: ["connectionRequests", currentUser?.email] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (currentUser) {
        const updatedConnections = [...(currentUser.connections || []), fromUser];
        updateUser({ connections: updatedConnections });
      }
      toast({
        title: "Connection accepted",
        description: `You are now connected with ${fromUser.name}`,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (fromUser: User) => rejectConnectionRequest(fromUser._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connectionRequests", currentUser?.email] });
      toast({
        description: "Invitation ignored",
      });
    },
  });

  const connectMutation = useMutation({
    mutationFn: (toUserId: string) => sendConnectionRequest(toUserId),
    onSuccess: (_, toUserId) => {
      const targetUser = users?.find(u => u._id === toUserId);
      toast({
        title: "Invitation sent",
        description: `Connection request sent to ${targetUser?.name}`,
      });
      queryClient.setQueryData(['users'], (oldData: User[] | undefined) => 
        oldData ? oldData.filter(u => u._id !== toUserId) : []
      );
    },
    onError: (error: Error) => {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
        })
    }
  });

  const currentUserConnectionIds =
    currentUser?.connections?.map((c) => (typeof c === "string" ? c : c._id)) || [];
  const invitationIds = invitations?.map(inv => inv._id) || [];

  const suggestions =
    users?.filter(
      (u) =>
        u._id !== currentUser?._id &&
        !invitationIds.includes(u._id) &&
        !currentUserConnectionIds.includes(u._id)
    ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4 sticky top-20">
              <h3 className="font-semibold mb-4">Manage my network</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Connections</span>
                  <span className="ml-auto text-sm">
                    {currentUser?.connections?.length || 0}
                  </span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm">Invitations</span>
                  <span className="ml-auto text-sm">
                    {invitations?.length || 0}
                  </span>
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-9 space-y-6">
            {isLoadingInvitations ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              invitations &&
              invitations.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Invitations ({invitations.length})
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {invitations.map((requestingUser) => (
                      <Card key={requestingUser._id} className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={requestingUser.profileImage} />
                            <AvatarFallback className="text-lg">
                              {requestingUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {requestingUser.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {requestingUser.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => acceptMutation.mutate(requestingUser)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => rejectMutation.mutate(requestingUser)}
                          >
                            Ignore
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            )}

            <div>
              <h2 className="text-xl font-bold mb-4">People you may know</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingUsers
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} className="p-4">
                        <div className="text-center">
                          <Skeleton className="h-20 w-20 mx-auto mb-3 rounded-full" />
                          <Skeleton className="h-4 w-3/4 mx-auto mb-2 rounded" />
                          <Skeleton className="h-4 w-1/2 mx-auto mb-3 rounded" />
                          <Skeleton className="h-10 w-full rounded" />
                        </div>
                      </Card>
                    ))
                  : suggestions.map((person) => (
                      <Card key={person._id} className="p-4">
                        <div className="text-center">
                          <Avatar className="h-20 w-20 mx-auto mb-3">
                            <AvatarImage src={person.profileImage} /> 
                            <AvatarFallback className="text-xl">
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Link to={`/profile/${person.email}`}>
                            <h4 className="font-semibold mb-1 hover:underline">{person.name}</h4>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2 min-h-[2.5rem]">
                            {person.title}
                          </p>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => connectMutation.mutate(person._id)}
                            disabled={connectMutation.isPending}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </div>
                      </Card>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;