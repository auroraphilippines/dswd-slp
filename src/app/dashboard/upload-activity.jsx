"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X, MapPin } from "lucide-react";
import NextImage from "next/image";
import { auth, db } from "@/service/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const MAX_IMAGES = 6;

const MUNICIPALITIES = [
  { id: 'baler', name: 'Baler' },
  { id: 'casiguran', name: 'Casiguran' },
  { id: 'dilasag', name: 'Dilasag' },
  { id: 'dinalungan', name: 'Dinalungan' },
  { id: 'dingalan', name: 'Dingalan' },
  { id: 'dipaculao', name: 'Dipaculao' },
  { id: 'maria-aurora', name: 'Maria Aurora' },
  { id: 'san-luis', name: 'San Luis' }
];

const showToast = (message, type = 'default') => {
  toast(message, {
    className: type === 'success' 
      ? 'bg-green-500 text-white border-green-600'
      : type === 'error'
        ? 'bg-red-500 text-white border-red-600'
        : '',
  });
};

export function UploadActivity() {
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userData, setUserData] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          showToast("Failed to load user data", 'error');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > MAX_IMAGES) {
      showToast(`Maximum ${MAX_IMAGES} images allowed`, 'error');
      return;
    }

    // Check file sizes
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit before compression
        showToast("Each image must be less than 5MB", 'error');
        return;
      }
    }

    const newSelectedImages = [...selectedImages, ...files];
    setSelectedImages(newSelectedImages);

    // Generate previews for new images
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!auth.currentUser) {
      showToast("Please log in to upload activities", 'error');
      return;
    }

    if (selectedImages.length === 0 || !description.trim()) {
      showToast("Please select at least one image and add a description", 'error');
      return;
    }

    if (!selectedMunicipality) {
      showToast("Please select a municipality", 'error');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Compress images
      const totalImages = selectedImages.length;
      const compressedImages = [];

      for (let i = 0; i < totalImages; i++) {
        const compressedImage = await compressImage(selectedImages[i]);
        compressedImages.push(compressedImage);
        setUploadProgress(((i + 1) / totalImages) * 100);
      }

      // Create activity document with images directly included
      const activityData = {
        description: description.trim(),
        userId: auth.currentUser.uid,
        name: userData?.name || "Anonymous",
        email: userData?.email || auth.currentUser.email,
        role: userData?.role || "User",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        images: compressedImages,
        totalImages: compressedImages.length,
        municipality: selectedMunicipality.toLowerCase(),
        municipalityName: MUNICIPALITIES.find(m => m.id === selectedMunicipality)?.name || selectedMunicipality
      };

      // Add activity document
      await addDoc(collection(db, "activities"), activityData);

      // Reset form
      setDescription("");
      setSelectedImages([]);
      setImagePreviews([]);
      setUploadProgress(0);
      setSelectedMunicipality("");
      
      showToast("Activity shared successfully", 'success');
    } catch (error) {
      console.error("Error uploading activity:", error);
      showToast("Failed to share activity", 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Municipality</label>
          <Select
            value={selectedMunicipality}
            onValueChange={setSelectedMunicipality}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select municipality">
                {selectedMunicipality ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {MUNICIPALITIES.find(m => m.id === selectedMunicipality)?.name}
                  </div>
                ) : (
                  "Select municipality"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MUNICIPALITIES.map((municipality) => (
                <SelectItem 
                  key={municipality.id} 
                  value={municipality.id}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="What's happening? Share your activity..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <div className="flex flex-wrap gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <div className="h-24 w-24 border rounded-lg overflow-hidden">
                <div className="relative h-full w-full">
                  <NextImage
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-background rounded-full border shadow-sm hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {selectedImages.length < MAX_IMAGES && (
            <div className="h-24 w-24">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
                multiple
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">
                  Add Images
                </span>
              </label>
            </div>
          )}
        </div>
        {selectedImages.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {selectedImages.length} of {MAX_IMAGES} images selected
          </p>
        )}
        <Button
          onClick={handleUpload}
          disabled={isUploading || selectedImages.length === 0 || !description.trim() || !selectedMunicipality}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading... {Math.round(uploadProgress)}%
            </>
          ) : (
            "Share Activity"
          )}
        </Button>
      </div>
    </div>
  );
} 