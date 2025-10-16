import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById, Post } from "@/lib/api";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6 max-w-2xl">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : error ? (
          <p className="text-destructive">Failed to load post.</p>
        ) : (
          post && <PostCard {...post} />
        )}
      </div>
    </div>
  );
};

export default PostPage;