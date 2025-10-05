import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  author: string;
  title: string;
  content: string;
  timestamp: string;
  likes?: number;
  comments?: number;
}

const PostCard = ({ author, title, content, timestamp, likes = 0, comments = 0 }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    if (!isLiked) {
      toast({
        description: "You liked this post",
      });
    }
  };

  const handleComment = () => {
    setCommentCount(commentCount + 1);
    toast({
      description: "Comment added",
    });
  };

  const handleRepost = () => {
    toast({
      description: "Post reposted to your network",
    });
  };

  const handleSend = () => {
    toast({
      description: "Post sent via message",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar>
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
      </div>
      <p className="text-sm mb-4">{content}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 pb-3 border-b">
        <ThumbsUp className="h-3 w-3" />
        <span>{likeCount} likes</span>
        <span className="ml-auto">{commentCount} comments</span>
      </div>
      <div className="flex items-center justify-around">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${isLiked ? 'text-primary' : ''}`}
          onClick={handleLike}
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-primary' : ''}`} />
          <span className="text-sm">Like</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={handleComment}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">Comment</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={handleRepost}
        >
          <Repeat2 className="h-4 w-4" />
          <span className="text-sm">Repost</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
          <span className="text-sm">Send</span>
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
