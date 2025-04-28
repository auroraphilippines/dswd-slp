"use client";

import { useState, useMemo } from "react";
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
import { toast, Toaster } from "sonner";
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

export function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

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
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Manage your password and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your current password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password Requirements</Label>
              <span className="text-sm font-medium">
                {passwordStrength === 100 ? "Strong" : 
                 passwordStrength >= 75 ? "Good" :
                 passwordStrength >= 50 ? "Fair" :
                 passwordStrength >= 25 ? "Weak" : "Very Weak"}
              </span>
            </div>
            <Progress value={passwordStrength} className="h-2" />
            <ul className="text-sm text-muted-foreground space-y-1 mt-2">
              <li className="flex items-center">
                <span className={`h-1.5 w-1.5 rounded-full ${passwordForm.newPassword.length >= 8 ? "bg-green-500" : "bg-muted"} mr-2`}></span>
                <span className={passwordForm.newPassword.length >= 8 ? "text-green-500" : ""}>
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center">
                <span className={`h-1.5 w-1.5 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword) ? "bg-green-500" : "bg-muted"} mr-2`}></span>
                <span className={/(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword) ? "text-green-500" : ""}>
                  Uppercase and lowercase letters
                </span>
              </li>
              <li className="flex items-center">
                <span className={`h-1.5 w-1.5 rounded-full ${/\d/.test(passwordForm.newPassword) ? "bg-green-500" : "bg-muted"} mr-2`}></span>
                <span className={/\d/.test(passwordForm.newPassword) ? "text-green-500" : ""}>
                  At least one number
                </span>
              </li>
              <li className="flex items-center">
                <span className={`h-1.5 w-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? "bg-green-500" : "bg-muted"} mr-2`}></span>
                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? "text-green-500" : ""}>
                  At least one special character
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={!isFormValid}
            className="w-full"
          >
            {isLoading ? "Updating..." : isFormValid ? "Update Password" : "Complete All Requirements"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}