import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchUserSettings,
  updateUserSettings,
  updateUserProfile,
  Settings as AppSettings,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const Settings = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading: isLoadingSettings } =
    useQuery<AppSettings>({
      queryKey: ["settings", user?.email],
      queryFn: fetchUserSettings, // This is now correct
      enabled: !!user?.email,
    });

  const settingsMutation = useMutation({
    mutationFn: updateUserSettings, // This is now correct
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["settings", user?.email], updatedSettings);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    },
     onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  const profileMutation = useMutation({
    mutationFn: updateUserProfile, // This is now correct
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile", user?.email], updatedUser);
      updateUser(updatedUser);
      toast({
        title: "Account saved",
        description: "Your account information has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      headline: "",
      location: "",
    },
  });

  useEffect(() => {
    if (user) {
        reset({
            name: user.name,
            email: user.email,
            headline: user.title || "",
            location: user.location || "",
        });
    }
  }, [user, reset]);


  const handleAccountSave = handleSubmit((data) => {
    profileMutation.mutate({
      name: data.name,
      title: data.headline,
      location: data.location,
    });
  });

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <main className="container mx-auto px-6 py-6 max-w-4xl">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <form onSubmit={handleAccountSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input id="headline" {...register("headline")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register("location")} />
                </div>
                <Button type="submit" disabled={profileMutation.isPending}>
                  {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to everyone
                    </p>
                  </div>
                  <Switch
                    checked={settings?.profileVisibility}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ profileVisibility: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Activity Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're active
                    </p>
                  </div>
                  <Switch
                    checked={settings?.activityStatus}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ activityStatus: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Search Engines</Label>
                    <p className="text-sm text-muted-foreground">
                      Let search engines find your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings?.allowSearchEngines}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ allowSearchEngines: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings?.emailNotifications}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Message Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new messages
                    </p>
                  </div>
                  <Switch
                    checked={settings?.messageNotifications}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ messageNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Connection Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about new connection requests
                    </p>
                  </div>
                  <Switch
                    checked={settings?.connectionRequests}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ connectionRequests: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about relevant job postings
                    </p>
                  </div>
                  <Switch
                    checked={settings?.jobAlerts}
                    onCheckedChange={(checked) =>
                      settingsMutation.mutate({ jobAlerts: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;