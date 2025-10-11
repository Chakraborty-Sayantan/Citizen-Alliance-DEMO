import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { MapPin, Briefcase, GraduationCap, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Profile editing feature coming soon",
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10"></div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-start -mt-16 mb-4">
              <Avatar className="h-32 w-32 border-4 border-card">
                <AvatarFallback className="text-3xl">JD</AvatarFallback>
              </Avatar>
              <Button onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-lg text-muted-foreground">Senior Full Stack Developer</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    San Francisco, CA
                  </span>
                  <span className="text-primary cursor-pointer hover:underline">500+ connections</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">TypeScript</Badge>
              </div>
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
              <p className="text-muted-foreground leading-relaxed">
                Passionate full stack developer with 8+ years of experience building scalable web applications. 
                Specialized in React, Node.js, and cloud technologies. Strong advocate for clean code and best practices.
                Always eager to learn new technologies and share knowledge with the community.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Experience</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Senior Full Stack Developer</h3>
                    <p className="text-sm text-muted-foreground">Tech Corp Inc.</p>
                    <p className="text-sm text-muted-foreground">2020 - Present</p>
                    <p className="text-sm mt-2">Leading development of enterprise-level web applications using React and Node.js.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Full Stack Developer</h3>
                    <p className="text-sm text-muted-foreground">StartUp Solutions</p>
                    <p className="text-sm text-muted-foreground">2018 - 2020</p>
                    <p className="text-sm mt-2">Developed and maintained multiple client projects using modern web technologies.</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Bachelor of Science in Computer Science</h3>
                  <p className="text-sm text-muted-foreground">University of California</p>
                  <p className="text-sm text-muted-foreground">2014 - 2018</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                <Badge>JavaScript</Badge>
                <Badge>TypeScript</Badge>
                <Badge>React</Badge>
                <Badge>Node.js</Badge>
                <Badge>Express</Badge>
                <Badge>MongoDB</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>AWS</Badge>
                <Badge>Docker</Badge>
                <Badge>Git</Badge>
                <Badge>REST APIs</Badge>
                <Badge>GraphQL</Badge>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
