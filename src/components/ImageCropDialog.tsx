// src/components/ImageCropDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropDialogProps {
  imageUrl: string | null;
  aspect: number;
  onSave: (croppedImageUrl: string) => void;
  onClose: () => void;
}

const ImageCropDialog = ({
  imageUrl,
  aspect,
  onSave,
  onClose,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
    setImgElement(e.currentTarget);
  };

  const handleCrop = () => {
    if (!imgElement || !crop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgElement.naturalWidth / imgElement.width;
    const scaleY = imgElement.naturalHeight / imgElement.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      imgElement,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    onSave(canvas.toDataURL("image/jpeg"));
    onClose();
  };

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop your image</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspect}
          >
            <img src={imageUrl} onLoad={onImageLoad} alt="Crop preview" />
          </ReactCrop>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;