import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Post,
  likePost,
  commentOnPost,
  repostPost,
  sendPost,
  User,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "./ui/input";

const PostCard = (post: Post) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const likeMutation = useMutation({
    mutationFn: () => likePost(post.id),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) =>
        oldData
          ? oldData.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          : []
      );
      if (updatedPost.isLiked) {
        toast({
          description: "You liked this post",
        });
      }
    },
  });

  const commentMutation = useMutation({
    mutationFn: (newComment: { text: string; author: User }) =>
      commentOnPost(post.id, newComment),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) =>
        oldData
          ? oldData.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          : []
      );
      setCommentText("");
      toast({
        description: "Comment added",
      });
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && user) {
      commentMutation.mutate({ text: commentText, author: user });
    }
  };

  // TODO: Implement full repost and send functionality
  const repostMutation = useMutation({
    mutationFn: () => repostPost(post.id),
    onSuccess: () => {
      toast({
        description: "Post reposted to your network",
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => sendPost(post.id),
    onSuccess: () => {
      toast({
        description: "Post sent via message",
      });
    },
  });

  const timeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 pb-3">
        <Avatar>
          <AvatarFallback>
            {post.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold">{post.author.name}</h4>
          <p className="text-sm text-muted-foreground">{post.author.title}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
        {post.attachment && (
          <div className="mt-4">
            {post.attachment.type === "image" && (
              <img
                src={post.attachment.url}
                alt="Post attachment"
                className="max-h-96 w-full rounded-md object-contain"
              />
            )}
            {post.attachment.type === "video" && (
              <video
                src={post.attachment.url}
                controls
                className="max-h-96 w-full rounded-md"
              />
            )}
            {post.attachment.type === "document" && (
              <a
                href={post.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border p-2 hover:bg-accent"
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">
                  {post.attachment.name}
                </span>
              </a>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 pb-3 border-b w-full">
          <ThumbsUp className="h-3 w-3" />
          <span>{post.likes} likes</span>
          <span className="ml-auto">{post.comments.length} comments</span>
        </div>
        <div className="flex items-center justify-around w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${post.isLiked ? "text-primary" : ""}`}
            onClick={() => likeMutation.mutate()}
          >
            <ThumbsUp
              className={`h-4 w-4 ${post.isLiked ? "fill-primary" : ""}`}
            />
            <span className="text-sm">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">Comment</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => repostMutation.mutate()}
          >
            <Repeat2 className="h-4 w-4" />
            <span className="text-sm">Repost</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => sendMutation.mutate()}
          >
            <Send className="h-4 w-4" />
            <span className="text-sm">Send</span>
          </Button>
        </div>
        {showComments && (
          <div className="w-full mt-4 pt-4 border-t">
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" disabled={!commentText.trim()}>
                Post
              </Button>
            </form>
            <div className="space-y-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {comment.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-md p-2 text-sm w-full">
                    <p className="font-semibold">{comment.author.name}</p>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;