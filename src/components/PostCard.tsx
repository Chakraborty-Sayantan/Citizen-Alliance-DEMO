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
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Post,
  likePost,
  commentOnPost,
  User,
  sendConnectionRequest,
  deletePost,
  repostPost,
  replyToComment,
  likeComment,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const PostCard = (post: Post) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const displayPost = post.isRepost && post.originalPost ? post.originalPost : post;

  const isLiked = user ? displayPost.likes.includes(user._id) : false;
  const isOwnPost = user?._id === displayPost.author._id;
  const isConnected = user?.connections?.some(
    (connection: User | string) =>
      (typeof connection === 'string' ? connection : connection._id) === displayPost.author._id
  );

  const likeMutation = useMutation({
    mutationFn: () => likePost(displayPost._id),
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
      commentOnPost(displayPost._id, newComment),
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
    mutationFn: () => sendConnectionRequest(displayPost.author._id),
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: `Your request to connect with ${displayPost.author.name} has been sent.`,
      });
    },
  });

  const deleteMutation = useMutation({
      mutationFn: () => deletePost(post._id),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["posts"] });
          queryClient.invalidateQueries({ queryKey: ["profilePosts", user?._id] });
          toast({
              title: "Post deleted",
          })
      }
  })

  const repostMutation = useMutation({
      mutationFn: () => repostPost(displayPost._id, ""),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast({
            title: "Post reposted",
        })
      }
  })

  const replyMutation = useMutation({
      mutationFn: ({ postId, commentId, reply }: { postId: string, commentId: string, reply: { text: string }}) => replyToComment(postId, commentId, reply),
      onSuccess: (updatedPost) => {
          queryClient.setQueryData(['posts'], (oldData: Post[] | undefined) => oldData ? oldData.map(p => p._id === updatedPost._id ? updatedPost : p) : []);
          setReplyingTo(null);
          setReplyText("");
          toast({ description: "Reply posted" });
      }
  })

  const commentLikeMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: string, commentId: string }) => likeComment(postId, commentId),
    onSuccess: (updatedPost) => {
        queryClient.setQueryData(['posts'], (oldData: Post[] | undefined) => oldData ? oldData.map(p => p._id === updatedPost._id ? updatedPost : p) : []);
    }
  })

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && user) {
      commentMutation.mutate({ text: commentText, author: user });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(displayPost.timestamp), {
    addSuffix: true,
  });

  const handleReplySubmit = (e: React.FormEvent, postId: string, commentId: string) => {
      e.preventDefault();
      if (replyText.trim() && user) {
          replyMutation.mutate({ postId, commentId, reply: { text: replyText } });
      }
  }


  return (
    <Card>
      {post.isRepost && post.originalPost && (
          <div className="px-6 pt-4 text-sm text-muted-foreground">
              Reposted by <Link to={`/profile/${post.author.email}`} className="font-semibold hover:underline">{post.author.name}</Link>
          </div>
      )}
      <CardHeader className="flex flex-row items-start gap-3 pb-3">
        <Avatar>
          <AvatarImage src={displayPost.author.profileImage} alt={displayPost.author.name} />
          <AvatarFallback>
            {displayPost.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link to={`/profile/${displayPost.author.email}`}>
            <h4 className="font-semibold hover:underline">
              {displayPost.author.name}
            </h4>
          </Link>
          <p className="text-sm text-muted-foreground">{displayPost.author.title}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {isOwnPost ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate()}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : !isConnected && (
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
        <p className="text-sm whitespace-pre-wrap">{displayPost.content}</p>
        {displayPost.attachment && (
          <div className="mt-4">
            {displayPost.attachment.type === "image" && (
              <img
                src={displayPost.attachment.url}
                alt="Post attachment"
                className="max-h-96 w-full rounded-md object-contain bg-muted"
              />
            )}
            {displayPost.attachment.type === "video" && (
              <video
                src={displayPost.attachment.url}
                controls
                className="max-h-96 w-full rounded-md"
              />
            )}
            {displayPost.attachment.type === "document" && (
              <a
                href={displayPost.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border p-2 hover:bg-accent"
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">
                  {displayPost.attachment.name}
                </span>
              </a>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 pb-3 border-b w-full">
          <ThumbsUp className="h-3 w-3" />
          <span>{displayPost.likes.length} likes</span>
          <span className="ml-auto">{displayPost.comments.length} comments</span>
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
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => repostMutation.mutate()}>
            <Repeat2 className="h-4 w-4" />
            <span className="text-sm">Repost</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" disabled>
            <Send className="h-4 w-4" />
            <span className="text-sm">Send</span>
          </Button>
        </div>
        {showComments && (
          <div id="comments" className="w-full mt-4 pt-4 border-t">
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
              {displayPost.comments.map((comment) => (
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
                    <div className="flex items-center gap-2">
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => commentLikeMutation.mutate({ postId: displayPost._id, commentId: comment._id })}>
                          Like
                      </Button>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}>
                          Reply
                      </Button>
                    </div>
                    {comment.likes && comment.likes.length > 0 && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comment.likes.length}</span>
                      </div>
                    )}

                    {/* Replies Section */}
                    <div className="mt-2 space-y-2 pl-4 border-l">
                        {comment.replies && comment.replies.map(reply => (
                             <div key={reply._id} className="flex items-start gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={reply.user.profileImage} alt={reply.user.name} />
                                    <AvatarFallback className="text-xs">{reply.user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div className="bg-background rounded-md p-2 text-xs w-full">
                                    <p className="font-semibold">{reply.user.name}</p>
                                    <p>{reply.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Input Form */}
                    {replyingTo === comment._id && (
                        <form onSubmit={(e) => handleReplySubmit(e, displayPost._id, comment._id)} className="flex gap-2 mt-2">
                            <Input
                                placeholder={`Reply to ${comment.user.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="h-8 text-xs"
                            />
                            <Button type="submit" size="sm" disabled={!replyText.trim() || replyMutation.isPending}>
                                Post
                            </Button>
                        </form>
                    )}
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