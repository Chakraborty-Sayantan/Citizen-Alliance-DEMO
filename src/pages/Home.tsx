import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchNews, Post, NewsArticle } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import NewsCard from "@/components/NewsCard";

const Home = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const { user } = useAuth();

  const {
    data: posts,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const {
    data: news,
    isLoading: isLoadingNews,
    error: newsError,
  } = useQuery<NewsArticle[]>({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

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
                  <AvatarFallback>
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
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
            />

            {isLoadingPosts ? (
              <div className="space-y-4">
                <Card className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </Card>
              </div>
            ) : postsError ? (
              <p className="text-destructive">Failed to load posts.</p>
            ) : (
              posts?.map((post) => <PostCard key={post.id} {...post} />)
            )}
          </div>

          <div className="lg:col-span-3">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">LinkLedge News</h3>
              <div className="space-y-4">
                {isLoadingNews ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : newsError ? (
                  <p className="text-xs text-destructive">
                    Failed to load news.
                  </p>
                ) : (
                  news?.map((article, index) => (
                    <NewsCard key={index} {...article} />
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;