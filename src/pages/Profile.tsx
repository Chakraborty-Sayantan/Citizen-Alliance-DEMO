import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Edit,
  Camera,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserProfile, updateUserProfile, User } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCropDialog from "@/components/ImageCropDialog";
import EditProfileDialog from "@/components/EditProfileDialog";

const Profile = () => {
  const { toast } = useToast();
  const { user, login } = useAuth();
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState<{
    url: string;
    type: "profile" | "background";
  } | null>(null);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<User | null>({
    queryKey: ["profile", user?.email],
    queryFn: () => fetchUserProfile(user?.email || ""),
    enabled: !!user?.email,
  });

  const profileMutation = useMutation({
    mutationFn: (profileData: Partial<User>) =>
      updateUserProfile(user?.email || "", profileData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile", user?.email], updatedUser);
      login(updatedUser); // Update the user in the auth context
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "background"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage({ url: reader.result as string, type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedImageUrl: string) => {
    if (cropImage?.type === "profile") {
      profileMutation.mutate({ profileImage: croppedImageUrl });
    } else if (cropImage?.type === "background") {
      profileMutation.mutate({ backgroundImage: croppedImageUrl });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <main className="container mx-auto px-6 py-6 max-w-4xl">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <main className="container mx-auto px-6 py-6 max-w-4xl">
          <p className="text-destructive">Failed to load profile.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10">
            {profile.backgroundImage && (
              <img
                src={profile.backgroundImage}
                alt="Background"
                className="w-full h-full object-cover"
              />
            )}
            <label
              htmlFor="bg-upload"
              className="absolute bottom-2 right-2 bg-card p-1.5 rounded-full cursor-pointer hover:bg-accent"
            >
              <Camera className="h-4 w-4" />
              <input
                id="bg-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "background")}
              />
            </label>
          </div>
          <div className="px-6 pb-6">
            <div className="relative h-16">
              <div className="absolute -top-16">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-card">
                    <AvatarImage src={profile.profileImage} />
                    <AvatarFallback className="text-3xl">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-2 right-2 bg-card p-1.5 rounded-full cursor-pointer hover:bg-accent"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, "profile")}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {profile.title}
                </p>
                <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                  <span className="text-primary cursor-pointer hover:underline">
                    {profile.connections} connections
                  </span>
                </div>
              </div>
              <Button onClick={() => setEditModalOpen(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.about || "No information provided."}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Experience</h2>
              <div className="space-y-6">
                {profile.experience?.length ? (
                  profile.experience.map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exp.date}
                        </p>
                        <p className="text-sm mt-2 whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No experience added yet.
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-6">
                {profile.education?.length ? (
                  profile.education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{edu.school}</h3>
                        <p className="text-sm text-muted-foreground">
                          {edu.degree}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edu.date}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No education added yet.
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length ? (
                  profile.skills.map((skill, i) => (
                    <Badge key={i}>{skill}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No skills added yet.
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {cropImage && (
        <ImageCropDialog
          imageUrl={cropImage.url}
          aspect={cropImage.type === "profile" ? 1 / 1 : 16 / 6}
          onSave={handleCropSave}
          onClose={() => setCropImage(null)}
        />
      )}

      {editModalOpen && (
        <EditProfileDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          profile={profile}
          onSave={(data) => profileMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default Profile;