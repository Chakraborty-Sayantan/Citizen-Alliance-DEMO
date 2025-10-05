import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video, FileText } from "lucide-react";

const Home = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      author: "Sarah Johnson",
      title: "Product Manager at TechCorp",
      content: "Excited to announce our new product launch! After months of hard work, we're finally ready to share what we've been building. Stay tuned for more updates!",
      timestamp: "2h ago",
      likes: 124,
      comments: 18
    },
    {
      author: "Michael Chen",
      title: "Software Engineer",
      content: "Just finished an amazing webinar on AI and machine learning. The future of technology is fascinating! What are your thoughts on the ethical implications of AI?",
      timestamp: "5h ago",
      likes: 89,
      comments: 12
    },
    {
      author: "Emily Rodriguez",
      title: "Marketing Director",
      content: "Thrilled to share that our campaign exceeded all expectations! Thank you to everyone who contributed to this success. Great teamwork makes the dream work!",
      timestamp: "1d ago",
      likes: 256,
      comments: 34
    }
  ]);

  const handlePostCreated = (content: string) => {
    const newPost = {
      author: "John Doe",
      title: "Senior Developer",
      content,
      timestamp: "Just now",
      likes: 0,
      comments: 0
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start text-muted-foreground"
                  onClick={() => setCreatePostOpen(true)}
                >
                  Start a post
                </Button>
              </div>
              <div className="flex items-center justify-around">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-primary"
                  onClick={() => setCreatePostOpen(true)}
                >
                  <Image className="h-5 w-5" />
                  <span className="text-sm">Photo</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-green-600"
                  onClick={() => setCreatePostOpen(true)}
                >
                  <Video className="h-5 w-5" />
                  <span className="text-sm">Video</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-orange-600"
                  onClick={() => setCreatePostOpen(true)}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Article</span>
                </Button>
              </div>
            </Card>

            <CreatePostDialog 
              open={createPostOpen}
              onOpenChange={setCreatePostOpen}
              onPostCreated={handlePostCreated}
            />

            {posts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>

          <div className="lg:col-span-3">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">LinkLedge News</h3>
              <div className="space-y-4">
                {[
                  "Tech industry trends for 2025",
                  "Remote work best practices",
                  "Career development tips",
                  "Networking strategies",
                  "Industry insights"
                ].map((item, index) => (
                  <div key={index}>
                    <p className="text-sm font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">2d ago • 1,234 readers</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
