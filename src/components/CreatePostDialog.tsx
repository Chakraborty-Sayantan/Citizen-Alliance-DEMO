import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (content: string) => void;
}

const CreatePostDialog = ({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    onPostCreated(content);
    setContent("");
    onOpenChange(false);
    toast({
      title: "Post created!",
      description: "Your post has been shared with your network",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>Share your thoughts with your network</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-xs text-muted-foreground">Post to anyone</p>
            </div>
          </div>
          
          <Textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none border-0 focus-visible:ring-0 text-base"
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2 text-primary">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-green-600">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-orange-600">
                <FileText className="h-5 w-5" />
              </Button>
            </div>
            <Button onClick={handlePost} disabled={!content.trim()}>
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
