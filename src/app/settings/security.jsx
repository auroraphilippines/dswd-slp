"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import { auth } from "@/service/firebase";
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebase";

export function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: user.email,
            });
          }
        } else {
          // Redirect to login if not authenticated
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Error loading user data");
      }
    };

    checkAuth();
  }, []);

  // Check if all password requirements are met
  const isPasswordValid = useMemo(() => {
    if (!passwordForm.newPassword) return false;
    
    // Check all password requirements
    const hasMinLength = passwordForm.newPassword.length >= 8;
    const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword);
    const hasNumber = /\d/.test(passwordForm.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword);
    
    return hasMinLength && hasUpperLower && hasNumber && hasSpecial;
  }, [passwordForm.newPassword]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      passwordForm.currentPassword && // Has current password
      isPasswordValid && // New password meets all requirements
      passwordForm.newPassword === passwordForm.confirmPassword && // Passwords match
      !isLoading // Not currently loading
    );
  }, [passwordForm, isPasswordValid, isLoading]);

  const validatePassword = (password) => {
    let strength = 0;
    let validationErrors = {};

    // Length check
    if (password.length >= 8) {
      strength += 25;
    } else {
      validationErrors.length = "Password must be at least 8 characters";
    }

    // Uppercase and lowercase check
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      strength += 25;
    } else {
      validationErrors.cases = "Password must include uppercase and lowercase letters";
    }

    // Number check
    if (/\d/.test(password)) {
      strength += 25;
    } else {
      validationErrors.number = "Password must include at least one number";
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 25;
    } else {
      validationErrors.special = "Password must include at least one special character";
    }

    return { strength, validationErrors };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "newPassword") {
      const { strength } = validatePassword(value);
      setPasswordStrength(strength);
    }

    // Clear errors when typing
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleUpdatePassword = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validate form
      let validationErrors = {};

      if (!passwordForm.currentPassword) {
        validationErrors.currentPassword = "Current password is required";
      }

      if (!passwordForm.newPassword) {
        validationErrors.newPassword = "New password is required";
      } else {
        const { validationErrors: passwordErrors } = validatePassword(passwordForm.newPassword);
        if (Object.keys(passwordErrors).length > 0) {
          validationErrors = { ...validationErrors, ...passwordErrors };
        }
      }

      if (!passwordForm.confirmPassword) {
        validationErrors.confirmPassword = "Please confirm your new password";
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const user = auth.currentUser;
      if (!user || !user.email) {
        toast.error("Please sign in again to update your password");
        return;
      }

      try {
        // Create credential with current password
        const credential = EmailAuthProvider.credential(
          user.email,
          passwordForm.currentPassword
        );

        // Reauthenticate user
        await reauthenticateWithCredential(user, credential);
        
        // If reauthentication successful, update password
        await updatePassword(user, passwordForm.newPassword);

        // Clear form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength(0);

        toast.success("Password updated successfully");
      } catch (authError) {
        console.error("Authentication error:", authError);
        
        if (authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
          setErrors({ currentPassword: "Current password is incorrect" });
          toast.error("Current password is incorrect");
        } else if (authError.code === 'auth/requires-recent-login') {
          // Force user to reauthenticate
          toast.error("For security reasons, please sign out and sign in again to update your password");
        } else if (authError.code === 'auth/too-many-requests') {
          toast.error("Too many attempts. Please try again later");
        } else {
          toast.error("Failed to update password. Please try again");
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An unexpected error occurred. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[#004225]/5 to-[#004225]/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#004225] to-[#004225]/70 bg-clip-text text-transparent">
            Password Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your password and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
            <div className="relative group">
              <Input
                id="current-password"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your current password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#004225]/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#004225]/60" />
                ) : (
                  <Eye className="h-4 w-4 text-[#004225]/60" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
            <div className="relative group">
              <Input
                id="new-password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#004225]/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#004225]/60" />
                ) : (
                  <Eye className="h-4 w-4 text-[#004225]/60" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
            <div className="relative group">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#004225]/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#004225]/60" />
                ) : (
                  <Eye className="h-4 w-4 text-[#004225]/60" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Password Strength</Label>
              <span className="text-sm font-medium text-[#004225]">
                {passwordStrength === 100 ? "Strong" : 
                 passwordStrength >= 75 ? "Good" :
                 passwordStrength >= 50 ? "Fair" :
                 passwordStrength >= 25 ? "Weak" : "Very Weak"}
              </span>
            </div>
            <Progress 
              value={passwordStrength} 
              className="h-2 bg-[#004225]/10"
              style={{
                '--progress-foreground': 'linear-gradient(to right, #004225, rgba(0, 66, 37, 0.7))'
              }}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${passwordForm.newPassword.length >= 8 ? "bg-[#004225]" : "bg-[#004225]/20"}`} />
                <span className={`text-xs ${passwordForm.newPassword.length >= 8 ? "text-[#004225]" : "text-muted-foreground"}`}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword) ? "bg-[#004225]" : "bg-[#004225]/20"}`} />
                <span className={`text-xs ${/(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword) ? "text-[#004225]" : "text-muted-foreground"}`}>
                  Uppercase & lowercase
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/\d/.test(passwordForm.newPassword) ? "bg-[#004225]" : "bg-[#004225]/20"}`} />
                <span className={`text-xs ${/\d/.test(passwordForm.newPassword) ? "text-[#004225]" : "text-muted-foreground"}`}>
                  At least one number
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? "bg-[#004225]" : "bg-[#004225]/20"}`} />
                <span className={`text-xs ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? "text-[#004225]" : "text-muted-foreground"}`}>
                  Special character
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={!isFormValid}
            className="w-full bg-[#004225] hover:bg-[#004225]/90 text-white transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </div>
            ) : isFormValid ? (
              "Update Password"
            ) : (
              "Complete All Requirements"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}