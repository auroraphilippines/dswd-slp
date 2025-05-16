"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Trash2, Replace } from "lucide-react";
import Image from "next/image";
import { db, auth } from "@/service/firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress with lower quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };
    };
  });
};

export function EditActivityModal({ isOpen, onClose, activity, onUpdate }) {
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (activity) {
      setDescription(activity.description || "");
      setExistingImages(activity.images || []);
      setNewImages([]);
      setDeletedImages([]);
    }
  }, [activity]);

  const handleImageUpload = async (e, replaceIndex = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalImages = existingImages.length + newImages.length;
    
    if (replaceIndex === null && files.length + totalImages > 6) {
      toast.error(`Maximum 6 images allowed. You can add ${6 - totalImages} more images.`);
      return;
    }

    // If replacing an existing image
    if (replaceIndex !== null && replaceIndex >= 0) {
      const oldImageUrl = existingImages[replaceIndex];
      setDeletedImages(prev => [...prev, oldImageUrl]);
      
      const newImageFile = files[0];
      const previewUrl = URL.createObjectURL(newImageFile);
      
      // Update existing images array with temporary preview
      const newExistingImages = [...existingImages];
      newExistingImages[replaceIndex] = previewUrl;
      setExistingImages(newExistingImages);
      
      // Store the new file with its target index
      setNewImages(prev => [...prev, { 
        file: newImageFile, 
        replaceIndex,
        previewUrl 
      }]);
      return;
    }

    // For new images
    const newImageFiles = files.map(file => {
      const previewUrl = URL.createObjectURL(file);
      return {
        file,
        replaceIndex: null,
        previewUrl
      };
    });
    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const handleRemoveExistingImage = (imageUrl, index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setDeletedImages(prev => [...prev, imageUrl]);
  };

  const handleRemoveNewImage = (index) => {
    const imageToRemove = newImages[index];
    if (imageToRemove.replaceIndex !== null) {
      setExistingImages(prev => prev.filter((_, i) => i !== imageToRemove.replaceIndex));
    }
    URL.revokeObjectURL(imageToRemove.previewUrl);
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!activity?.id || !auth.currentUser) {
      toast.error("You must be logged in to update activities");
      return;
    }

    try {
      setLoading(true);

      // Get final images array by processing both existing and new images
      let finalImages = [...existingImages].filter(url => !deletedImages.includes(url));

      // Convert and add new images
      for (const imageData of newImages) {
        try {
          let base64;
          if (imageData.file.size > 500000) { // If file is larger than 500KB, compress it
            base64 = await compressImage(imageData.file);
          } else {
            base64 = await convertImageToBase64(imageData.file);
          }

          if (imageData.replaceIndex !== null) {
            // Replace existing image
            finalImages[imageData.replaceIndex] = base64;
          } else {
            // Add new image
            finalImages.push(base64);
          }
        } catch (error) {
          console.error("Error processing image:", error);
          toast.error(`Failed to process image: ${imageData.file.name}`);
        }
      }

      // Remove any undefined/null entries and ensure unique URLs
      finalImages = finalImages.filter(Boolean);

      // Check total size of images
      const totalSize = finalImages.reduce((size, img) => size + (img.length * 0.75), 0); // base64 size in bytes
      if (totalSize > 900000) { // If total size is more than 900KB
        throw new Error("Total image size is too large. Please try with fewer or smaller images.");
      }

      // Update the activity document
      const activityRef = doc(db, "activities", activity.id);
      const updatedActivity = {
        description: description.trim(),
        images: finalImages,
        updatedAt: new Date(),
        totalImages: finalImages.length,
        lastEditedBy: auth.currentUser.uid
      };

      await updateDoc(activityRef, updatedActivity);

      // Clean up preview URLs
      newImages.forEach(image => {
        if (image.previewUrl) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });

      // Update local state
      onUpdate({
        ...activity,
        ...updatedActivity,
      });

      toast.success("Activity updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error(error.message || "Failed to update activity. Please try with fewer or smaller images.");
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      newImages.forEach(image => {
        if (image.previewUrl) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [newImages]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl max-h-[90vh] p-2 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 sm:py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Update your activity description..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* Existing Images */}
              {existingImages.map((url, index) => (
                <div key={`${url}-${index}`} className="relative group aspect-square">
                  {url && !deletedImages.includes(url) && (
                    <>
                      <Image
                        src={url}
                        alt={`Activity image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="p-1.5 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="hidden"
                          />
                          <Replace className="h-4 w-4 text-white" />
                        </label>
                        <button
                          onClick={() => handleRemoveExistingImage(url, index)}
                          className="p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* New Images Preview */}
              {newImages.map((imageData, index) => (
                <div key={index} className="relative group aspect-square">
                  {imageData.previewUrl && (
                    <>
                      <Image
                        src={imageData.previewUrl}
                        alt={`New image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </>
                  )}
                </div>
              ))}

              {/* Upload Button */}
              {existingImages.length + newImages.length < 6 && (
                <label className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                  <div className="text-center space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload Image</p>
                  </div>
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {6 - (existingImages.length + newImages.length)} images remaining (maximum 6)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 