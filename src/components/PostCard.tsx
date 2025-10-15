// src/components/PostCard.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  FileText,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Post,
  likePost,
  commentOnPost,
  User,
  sendConnectionRequest,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";

const PostCard = (post: Post) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isLiked = user ? post.likes.includes(user._id) : false;

  const likeMutation = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) =>
        oldData
          ? oldData.map((p) => (p._id === updatedPost._id ? updatedPost : p))
          : []
      );
    },
  });

  const commentMutation = useMutation({
    mutationFn: (newComment: { text: string; author: User }) =>
      commentOnPost(post._id, newComment),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) =>
        oldData
          ? oldData.map((p) => (p._id === updatedPost._id ? updatedPost : p))
          : []
      );
      setCommentText("");
      toast({
        description: "Comment added",
      });
    },
  });
  
  const connectMutation = useMutation({
    mutationFn: () => sendConnectionRequest(post.author._id),
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: `Your request to connect with ${post.author.name} has been sent.`,
      });
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && user) {
      commentMutation.mutate({ text: commentText, author: user });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 pb-3">
        <Avatar>
          <AvatarImage src={post.author.profileImage} alt={post.author.name} />
          <AvatarFallback>
            {post.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link to={`/profile/${post.author.email}`}>
            <h4 className="font-semibold hover:underline">
              {post.author.name}
            </h4>
          </Link>
          <p className="text-sm text-muted-foreground">{post.author.title}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {user?.email !== post.author.email && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        {post.attachment && (
          <div className="mt-4">
            {post.attachment.type === "image" && (
              <img
                src={post.attachment.url}
                alt="Post attachment"
                className="max-h-96 w-full rounded-md object-contain bg-muted"
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
          <span>{post.likes.length} likes</span>
          <span className="ml-auto">{post.comments.length} comments</span>
        </div>
        <div className="flex items-center justify-around w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-primary" : ""}`}
            onClick={() => likeMutation.mutate()}
          >
            <ThumbsUp
              className={`h-4 w-4 ${isLiked ? "fill-primary" : ""}`}
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
          {/* Repost and Send functionality can be implemented later */}
          <Button variant="ghost" size="sm" className="gap-2" disabled>
            <Repeat2 className="h-4 w-4" />
            <span className="text-sm">Repost</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" disabled>
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
              <Button type="submit" disabled={!commentText.trim() || commentMutation.isPending}>
                Post
              </Button>
            </form>
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.user.profileImage}
                      alt={comment.user.name}
                    />
                    <AvatarFallback>
                      {comment.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-md p-2 text-sm w-full">
                    <p className="font-semibold">{comment.user.name}</p>
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