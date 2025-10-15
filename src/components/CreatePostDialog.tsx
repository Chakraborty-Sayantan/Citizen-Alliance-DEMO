import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createPost, Post } from "@/lib/api"; // Import Post type if needed
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for Base64 efficiency

type AttachmentState = {
  file: File;
  preview: string;
  type: "image" | "video" | "document";
};

const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<AttachmentState | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
      setAttachment(null);
      onOpenChange(false);
      toast({
        title: "Post created!",
        description: "Your post has been shared with your network",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const fileTypeRaw = file.type.split("/")[0];
      const fileType = fileTypeRaw === "image" || fileTypeRaw === "video" ? fileTypeRaw : "document";
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          file: file,
          preview: reader.result as string,
          type: fileType,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!content.trim() && !attachment) {
      toast({
        title: "Empty post",
        description: "Please write something or add an attachment.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to post.",
        variant: "destructive",
      });
      return;
    }
    
    // Explicitly define the type here to match CreatePostData
    const postData: {
      content: string;
      attachment?: { type: "image" | "video" | "document"; url: string; name: string };
    } = {
      content,
    };

    if (attachment) {
      postData.attachment = {
        type: attachment.type, // This is now correctly typed
        url: attachment.preview,
        name: attachment.file.name,
      };
    }

    mutation.mutate(postData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profileImage} alt={user?.name} />
              <AvatarFallback>
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Post to anyone</p>
            </div>
          </div>

          <Textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-0 focus-visible:ring-0 text-base"
          />

          {attachment && (
            <div className="relative">
              {attachment.type === 'image' && (
                <img
                  src={attachment.preview}
                  alt="Preview"
                  className="max-h-60 w-full rounded-md object-contain bg-muted"
                />
              )}
              {attachment.type === 'video' && (
                <video
                  src={attachment.preview}
                  controls
                  className="max-h-60 w-full rounded-md"
                />
              )}
              {attachment.type === 'document' && (
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">{attachment.file.name}</span>
                  </div>
                )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setAttachment(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-primary"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Image className="h-5 w-5" />
                 <span className="text-sm">Media</span>
              </Button>
            </div>
            <Button
              onClick={handlePost}
              disabled={(!content.trim() && !attachment) || mutation.isPending}
            >
              {mutation.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;