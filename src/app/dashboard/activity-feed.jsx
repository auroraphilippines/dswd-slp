"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/service/firebase";
import { collection, query, orderBy, limit, getDocs, doc, getDoc, deleteDoc, where, startAfter } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import NextImage from "next/image";
import { Progress } from "@/components/ui/progress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageModal } from "./image-modal";
import { EditActivityModal } from "./edit-activity-modal";
import { MoreVertical, Edit, Trash2, Loader2, MapPin, Filter, Calendar, Share2, Facebook, MessageCircle, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfilePhotoFromLocalStorage } from "@/service/storage";

const ITEMS_PER_PAGE = 20;

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

const MONTHS = [
  { id: '01', name: 'January' },
  { id: '02', name: 'February' },
  { id: '03', name: 'March' },
  { id: '04', name: 'April' },
  { id: '05', name: 'May' },
  { id: '06', name: 'June' },
  { id: '07', name: 'July' },
  { id: '08', name: 'August' },
  { id: '09', name: 'September' },
  { id: '10', name: 'October' },
  { id: '11', name: 'November' },
  { id: '12', name: 'December' }
].map(month => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
  const monthNum = parseInt(month.id);
  
  // If the month is in the past this year, show current year
  // If the month is in the future or current month, also show current year
  const year = currentYear;
  
  return {
    ...month,
    name: `${month.name} ${year}`,
    year: year
  };
});

export function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedMunicipality, setSelectedMunicipality] = useState("all");
  const [availableMunicipalities, setAvailableMunicipalities] = useState([]);
  const [userPermissions, setUserPermissions] = useState({
    readOnly: false,
    accessProject: true,
    accessParticipant: true,
    accessFileStorage: true,
    accessActivities: true
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activityToShare, setActivityToShare] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [selectedMonth, selectedMunicipality]);

  // Reset when month changes
  useEffect(() => {
    if (selectedMonth === "all") {
      setAvailableMunicipalities(MUNICIPALITIES);
    } else {
      updateAvailableMunicipalities();
    }
  }, [selectedMonth]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserPermissions({
              readOnly: userData.permissions?.readOnly ?? false,
              accessProject: userData.permissions?.accessProject ?? true,
              accessParticipant: userData.permissions?.accessParticipant ?? true,
              accessFileStorage: userData.permissions?.accessFileStorage ?? true,
              accessActivities: userData.permissions?.accessActivities ?? true
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };
    fetchUserPermissions();
  }, []);

  const updateAvailableMunicipalities = async () => {
    if (selectedMonth === "all") {
      setAvailableMunicipalities(MUNICIPALITIES);
      return;
    }

    try {
      const [month, year] = selectedMonth.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

      const activitiesRef = collection(db, "activities");
      const monthQuery = query(
        activitiesRef,
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate)
      );

      const querySnapshot = await getDocs(monthQuery);
      const municipalities = new Set();

      querySnapshot.forEach((doc) => {
        const activity = doc.data();
        if (activity.municipality) {
          // Store municipality ID in lowercase
          municipalities.add(activity.municipality.toLowerCase());
        }
      });

      // Filter municipalities that match the IDs in our data
      const filteredMunicipalities = MUNICIPALITIES.filter(m => 
        municipalities.has(m.id.toLowerCase())
      );

      console.log("Available municipalities:", filteredMunicipalities.map(m => m.name));
      setAvailableMunicipalities(filteredMunicipalities);
    } catch (error) {
      console.error("Error updating municipalities:", error);
      setAvailableMunicipalities(MUNICIPALITIES);
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
  };

  const handleUpdate = (updatedActivity) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );
  };

  const handleDelete = async (activityId) => {
    setActivityToDelete(activityId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "activities", activityToDelete));
      setActivities(prev => prev.filter(a => a.id !== activityToDelete));
      toast("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast("Failed to delete activity");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setActivityToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const handleShare = (activity) => {
    setActivityToShare(activity);
    setShowShareModal(true);
  };

  const shareToFacebook = () => {
    if (!activityToShare) return;
    const shareableLink = `${window.location.origin}/shared-activity?activity=${activityToShare.id}`;
    const shareTitle = "Check out this DSWD SLP activity!";
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  };

  const shareToMessenger = () => {
    if (!activityToShare) return;
    const shareableLink = `${window.location.origin}/shared-activity?activity=${activityToShare.id}`;
    
    // Check if it's a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open Messenger app first
      const messengerAppUrl = `fb-messenger://share/?link=${encodeURIComponent(shareableLink)}`;
      const messengerWebUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareableLink)}&app_id=YOUR_FACEBOOK_APP_ID&redirect_uri=${encodeURIComponent(window.location.origin)}`;
      
      // Try to open the app, if it fails, fall back to web version
      window.location.href = messengerAppUrl;
      
      // Set a timeout to check if the app opened
      setTimeout(() => {
        // If we're still on the same page after 2 seconds, open the web version
        if (document.hidden === false) {
          window.open(messengerWebUrl, '_blank', 'width=600,height=400');
        }
      }, 2000);
    } else {
      // For desktop, open the web version
      const messengerWebUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareableLink)}&app_id=YOUR_FACEBOOK_APP_ID&redirect_uri=${encodeURIComponent(window.location.origin)}`;
      window.open(messengerWebUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyLink = async () => {
    if (!activityToShare) return;
    try {
      const shareableLink = `${window.location.origin}/shared-activity?activity=${activityToShare.id}`;
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
    }
  };

  const fetchActivities = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setProgress(10);
      }

      let activitiesQuery;
      const baseQuery = collection(db, "activities");

      // Start with a simple query that only orders by date
      let queryConstraints = [orderBy("createdAt", "desc")];

      // Add pagination if loading more
      if (loadMore && lastVisible) {
        queryConstraints.push(startAfter(lastVisible));
      }

      // Add limit
      queryConstraints.push(limit(ITEMS_PER_PAGE));

      // Create the query
      activitiesQuery = query(baseQuery, ...queryConstraints);

      try {
        const querySnapshot = await getDocs(activitiesQuery);
        console.log("Query successful, processing results...");

        // Filter results in memory
        let filteredDocs = querySnapshot.docs;

        // Apply municipality filter in memory if selected
        if (selectedMunicipality !== "all") {
          filteredDocs = filteredDocs.filter(doc => {
            const data = doc.data();
            // Check against the lowercase municipality field
            return data.municipality === selectedMunicipality;
          });
        }

        // Apply date filter in memory if needed
        if (selectedMonth && selectedMonth !== "all") {
          const [month, year] = selectedMonth.split('-');
          const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

          filteredDocs = filteredDocs.filter(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate();
            return createdAt >= startDate && createdAt <= endDate;
          });
        }

        if (filteredDocs.length === 0 && !loadMore) {
          setActivities([]);
          toast("No activities found for the selected filters");
          setHasMore(false);
          return;
        }

        const activitiesData = await Promise.all(
          filteredDocs.map(async (docSnapshot) => {
            const activityData = docSnapshot.data();
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

            return {
              id: docSnapshot.id,
              ...activityData,
              name: userData?.name || activityData.name || "Anonymous",
              role: userData?.role || activityData.role || "User",
              email: userData?.email || activityData.email,
              createdAt: activityData.createdAt?.toDate() || new Date(),
              municipalityName: activityData.municipalityName || MUNICIPALITIES.find(m => m.id === activityData.municipality)?.name || activityData.municipality,
              photoURL: photoURL || null
            };
          })
        );

        if (loadMore) {
          setActivities(prev => [...prev, ...activitiesData]);
        } else {
          setActivities(activitiesData);
        }

        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
        setProgress(100);

      } catch (error) {
        console.error("Query error:", error);
        toast("Error loading activities. Please try again.");
      }
    } catch (error) {
      console.error("Fatal error:", error);
      toast("Error loading activities. Please try refreshing the page.");
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
        setProgress(0);
      }
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchActivities(true);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "AN";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isReadOnly = () => {
    return userPermissions.readOnly || !userPermissions.accessActivities;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" limit={3} />
        <div className="w-full space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Loading activities... {progress}%
          </p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" limit={3} />
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Month">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedMonth !== "all" ? MONTHS.find(m => `${m.id}-${m.year}` === selectedMonth)?.name : 'All Months'}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {MONTHS.map((month) => (
                <SelectItem key={`${month.id}-${month.year}`} value={`${month.id}-${month.year}`}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Municipality">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedMunicipality !== "all" 
                    ? MUNICIPALITIES.find(m => m.id === selectedMunicipality)?.name 
                    : 'All Municipalities'}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Municipalities</SelectItem>
              {availableMunicipalities.map((municipality) => (
                <SelectItem key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(selectedMonth !== "all" || selectedMunicipality !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMonth("all");
              setSelectedMunicipality("all");
            }}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {activities.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No activities found. Be the first to share an activity!
            </p>
          </CardContent>
        </Card>
      )}

      {activities.length > 0 && activities.map((activity) => (
        <Card key={activity.id} id={`activity-${activity.id}`} className="transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
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

              {auth.currentUser && activity.userId === auth.currentUser.uid && !isReadOnly() && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-muted p-2 rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(activity)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(activity)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(activity.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
      ))}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full max-w-xs"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      <ImageModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />

      <EditActivityModal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        activity={editingActivity}
        onUpdate={handleUpdate}
        userPermissions={userPermissions}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-2">
            <h2 className="text-lg font-semibold mb-2">Delete Activity</h2>
            <p className="mb-4">Are you sure you want to delete this activity?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-2">
            <h2 className="text-lg font-semibold mb-4">Share Activity</h2>
            <div className="space-y-3">
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                Share on Facebook
              </button>
              <button
                onClick={shareToMessenger}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#0084FF] text-white hover:bg-[#0084FF]/90 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Share on Messenger
              </button>
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Link className="h-5 w-5" />
                Copy Link
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setActivityToShare(null);
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 