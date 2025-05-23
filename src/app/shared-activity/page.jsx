"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import NextImage from "next/image";
import { MapPin } from "lucide-react";
import { ImageModal } from "../dashboard/image-modal";
import { getProfilePhotoFromLocalStorage } from "@/service/storage";

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

export default function SharedActivityPage() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityId = searchParams.get('activity');
        if (!activityId) {
          setError("No activity ID provided");
          setLoading(false);
          return;
        }

        const activityDoc = await getDoc(doc(db, "activities", activityId));
        if (!activityDoc.exists()) {
          setError("Activity not found");
          setLoading(false);
          return;
        }

        const activityData = activityDoc.data();
        let userData = null;
        let photoURL = null;

        try {
          const userDocRef = doc(db, "users", activityData.userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            userData = userDoc.data();
            photoURL = userData.photoURL || getProfilePhotoFromLocalStorage(activityData.userId);
          } else {
            photoURL = getProfilePhotoFromLocalStorage(activityData.userId);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          photoURL = getProfilePhotoFromLocalStorage(activityData.userId);
        }

        setActivity({
          id: activityDoc.id,
          ...activityData,
          name: userData?.name || activityData.name || "Anonymous",
          role: userData?.role || activityData.role || "User",
          email: userData?.email || activityData.email,
          createdAt: activityData.createdAt?.toDate() || new Date(),
          municipalityName: activityData.municipalityName || MUNICIPALITIES.find(m => m.id === activityData.municipality)?.name || activityData.municipality,
          photoURL: photoURL || null
        });
      } catch (error) {
        console.error("Error fetching activity:", error);
        setError("Failed to load activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [searchParams]);

  const getUserInitials = (name) => {
    if (!name) return "AN";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Activity not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              {activity.photoURL ? (
                <img
                  src={activity.photoURL}
                  alt={activity.name}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getUserInitials(activity.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{activity.name}</p>
              {activity.role && (
                <p className="text-xs text-primary mt-1">
                  {activity.role}
                </p>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                {activity.municipalityName}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(activity.createdAt, "MMMM d, yyyy")} • {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">{activity.description}</p>
          {activity.images && activity.images.length > 0 && (
            <div className={`grid gap-2 ${
              activity.images.length === 5 
                ? 'grid-cols-3 auto-rows-fr' 
                : activity.images.length === 6
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-2 md:grid-cols-3'
            }`}>
              {activity.images.map((imageUrl, index) => (
                <div
                  key={`${activity.id}-image-${index}`}
                  className={`relative cursor-pointer transition-transform hover:scale-[1.02] group ${
                    activity.images.length === 5
                      ? index >= 3 
                        ? 'col-span-3 md:col-span-1 aspect-[4/3]' 
                        : 'aspect-square'
                      : activity.images.length === 6
                        ? 'aspect-square'
                        : 'aspect-square'
                  } ${
                    activity.images.length === 5 && index >= 3
                      ? 'md:col-start-' + (index - 2)
                      : ''
                  }`}
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <NextImage
                    src={imageUrl}
                    alt={`Activity image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes={
                      activity.images.length === 5
                        ? index >= 3
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, 33vw"
                        : "(max-width: 768px) 50vw, 33vw"
                    }
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="text-white text-sm">Click to view</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ImageModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </div>
  );
} 