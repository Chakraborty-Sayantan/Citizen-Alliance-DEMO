import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createPost } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
      setFile(null);
      setPreview(null);
      onOpenChange(false);
      toast({
        title: "Post created!",
        description: "Your post has been shared with your network",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 30MB.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePost = () => {
    if (!content.trim() && !file) {
      toast({
        title: "Empty post",
        description: "Please write something or add a file.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post.",
        variant: "destructive",
      });
      return;
    }

    let attachment;
    if (file) {
      const fileType = file.type.split("/")[0];
      attachment = {
        type:
          fileType === "image" || fileType === "video" ? fileType : "document",
        url: URL.createObjectURL(file), // In a real app, this would be a URL from your storage service
        name: file.name,
      };
    }

    mutation.mutate({
      author: {
        name: user.name,
        email: user.email,
        title: "Senior Developer", // Replace with dynamic title later
      },
      content,
      attachment,
    });
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

          {preview && (
            <div className="relative">
              {file?.type.startsWith("image/") && (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-60 w-full rounded-md object-contain"
                />
              )}
              {file?.type.startsWith("video/") && (
                <video
                  src={preview}
                  controls
                  className="max-h-60 w-full rounded-md"
                />
              )}
              {!file?.type.startsWith("image/") &&
                !file?.type.startsWith("video/") && (
                  <div className="flex items-center gap-2 rounded-md border p-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">{file?.name}</span>
                  </div>
                )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-primary"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Image className="h-5 w-5" />
              </Button>
              <input
                type="file"
                id="video-upload"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-green-600"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                <Video className="h-5 w-5" />
              </Button>
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-orange-600"
                onClick={() => document.getElementById("doc-upload")?.click()}
              >
                <FileText className="h-5 w-5" />
              </Button>
            </div>
            <Button
              onClick={handlePost}
              disabled={(!content.trim() && !file) || mutation.isPending}
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