"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NextImage from "next/image";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { auth } from "@/service/firebase";

// Add custom styles to override Dialog defaults
const dialogStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  maxWidth: '100%',
  maxHeight: '100%',
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: 0,
  zIndex: 50,
  backgroundColor: 'black'
};

export function ImageModal({ isOpen, onClose, imageUrl }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = document.querySelector('.fullscreen-container');
        if (element) {
          await element.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleEdit = (activity) => {
    // Navigate to edit page or open edit modal
    router.push(`/activities/${activity.id}/edit`);
    // OR
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onClose}
    >
      <DialogContent 
        className={cn(
          "!p-0 !m-0 !rounded-none !border-0 !shadow-none",
          "!max-w-none !w-screen !h-screen !inset-0",
          "!top-0 !left-0 !translate-x-0 !translate-y-0",
          "bg-black"
        )}
      >
        <DialogTitle className="sr-only">Image Viewer</DialogTitle>
        
        <div className="fullscreen-container w-full h-full bg-black">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Image controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[60] flex items-center gap-2 bg-black/50 p-2 rounded-full">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full hover:bg-black/30 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full hover:bg-black/30 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 rounded-full hover:bg-black/30 transition-colors"
              title="Rotate"
            >
              <RotateCw className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full hover:bg-black/30 transition-colors"
              title={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                {isFullScreen ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                ) : (
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                )}
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-black/30 transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Image container */}
          <div 
            className="w-full h-full flex items-center justify-center bg-black"
            style={{
              cursor: scale > 1 ? 'move' : 'default'
            }}
          >
            {imageUrl && (
              <div
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <NextImage
                  src={imageUrl}
                  alt="Full size image"
                  fill
                  className="object-contain"
                  priority
                  sizes="100vw"
                  quality={100}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}