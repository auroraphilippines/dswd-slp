"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Lock,
  Shield,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  Globe,
  History,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFirestore } from 'firebase/firestore';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

export function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    deviceManagement: true,
    ipRestrictions: false,
  });
  const [user, setUser] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const updateSecuritySetting = (key, value) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: value,
    });
  };

  const [loginHistory] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.1",
      time: "Today, 10:30 AM",
      status: "Success",
    },
    {
      id: 2,
      device: "Safari on macOS",
      location: "San Francisco, USA",
      ip: "192.168.1.2",
      time: "Yesterday, 3:15 PM",
      status: "Success",
    },
    {
      id: 3,
      device: "Firefox on Ubuntu",
      location: "Unknown Location",
      ip: "192.168.1.3",
      time: "3 days ago, 8:45 PM",
      status: "Failed",
    },
  ]);

  // Mock current password - In real app, this would come from your auth system
  const MOCK_CURRENT_PASSWORD = "currentpass123";

  // Check auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const calculatePasswordStrength = (password) => {
    const checks = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calculate score based on criteria met
    const score = Object.values(checks).filter(Boolean).length * 20; // 20% for each criteria

    return {
      ...checks,
      score
    };
  };

  const handlePasswordChange = (field) => (e) => {
    const newValue = e.target.value;
    setPasswordFields(prev => ({
      ...prev,
      [field]: newValue
    }));
    setPasswordError(""); // Clear any previous errors

    // Update password strength when new password changes
    if (field === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(newValue));
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setIsUpdating(true);
      setPasswordError("");

      if (!user) {
        toast.error("You must be logged in to change your password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPasswordError("You must be logged in to change your password");
        return;
      }

      // Reauthenticate user before password change
      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          passwordFields.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      } catch (error) {
        console.error('Reauthentication error:', error);
        toast.error("Current password is incorrect", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPasswordError("Current password is incorrect");
        return;
      }

      // Validate new password strength
      if (!passwordStrength.hasMinLength || !passwordStrength.hasUpperCase || !passwordStrength.hasLowerCase || !passwordStrength.hasNumber || !passwordStrength.hasSpecialChar) {
        toast.warning("Password does not meet strength requirements", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPasswordError("New password does not meet strength requirements");
        return;
      }

      // Validate password match
      if (passwordFields.newPassword !== passwordFields.confirmPassword) {
        toast.error("New password and confirmation do not match", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPasswordError("New password and confirmation do not match");
        return;
      }

      // Update password in Firebase
      await updatePassword(user, passwordFields.newPassword);

      // Clear the form
      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast.success("🔒 Password updated successfully! Please log in again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        icon: "🔒"
      });

      // Sign out the user
      const auth = getAuth();
      await signOut(auth);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      console.error('Password update error:', error);
      toast.error("Failed to update password. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
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
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Account Security
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Sessions & History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={passwordFields.currentPassword}
                    onChange={handlePasswordChange("currentPassword")}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordFields.newPassword}
                  onChange={handlePasswordChange("newPassword")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordFields.confirmPassword}
                  onChange={handlePasswordChange("confirmPassword")}
                />
              </div>
              {passwordError && (
                <div className="text-sm text-red-500 mt-2">
                  {passwordError}
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Password Strength</Label>
                  <span className={`text-sm font-medium ${
                    passwordStrength.score >= 60 ? "text-green-500" :
                    passwordStrength.score >= 40 ? "text-yellow-500" :
                    "text-red-500"
                  }`}>
                    {passwordStrength.score === 100 ? "Strong" :
                     passwordStrength.score >= 60 ? "Good" :
                     passwordStrength.score >= 40 ? "Fair" :
                     passwordStrength.score >= 20 ? "Weak" : "Very Weak"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength.score >= 60 ? "bg-green-500" :
                      passwordStrength.score >= 40 ? "bg-yellow-500" :
                      passwordStrength.score >= 20 ? "bg-red-500" :
                      "bg-red-300"
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li className="flex items-center">
                    <span className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasMinLength ? 'bg-green-500' : 'bg-muted'} mr-2`}></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? 'bg-green-500' : 'bg-muted'} mr-2`}></span>
                    Uppercase and lowercase letters
                  </li>
                  <li className="flex items-center">
                    <span className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-muted'} mr-2`}></span>
                    At least one number
                  </li>
                  <li className="flex items-center">
                    <span className={`h-1.5 w-1.5 rounded-full ${passwordStrength.hasSpecialChar ? 'bg-green-500' : 'bg-muted'} mr-2`}></span>
                    At least one special character
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdatePassword}
                disabled={isUpdating || !passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword}
              >
                {isUpdating ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure additional security measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="login-alerts">Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for new login attempts
                  </p>
                </div>
                <Switch
                  id="login-alerts"
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("loginAlerts", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="device-management">Device Management</Label>
                  <p className="text-sm text-muted-foreground">
                    Track and manage devices that have access to your account
                  </p>
                </div>
                <Switch
                  id="device-management"
                  checked={securitySettings.deviceManagement}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("deviceManagement", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restrictions">IP Restrictions</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit access to your account from specific IP addresses
                  </p>
                </div>
                <Switch
                  id="ip-restrictions"
                  checked={securitySettings.ipRestrictions}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("ipRestrictions", checked)
                  }
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) =>
                      updateSecuritySetting("sessionTimeout", value)
                    }
                  >
                    <SelectTrigger id="session-timeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) =>
                      updateSecuritySetting("passwordExpiry", value)
                    }
                  >
                    <SelectTrigger id="password-expiry">
                      <SelectValue placeholder="Select expiry period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    updateSecuritySetting("twoFactorAuth", checked)
                  }
                />
              </div>

              {!securitySettings.twoFactorAuth ? (
                <div className="rounded-lg border p-4 mt-4">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">
                        Enhance your account security
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Two-factor authentication adds an additional layer of
                        security to your account by requiring more than just a
                        password to sign in.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 border-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Authenticator App
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Smartphone className="h-8 w-8 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Use an app like Google Authenticator or Authy
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          Active
                        </Badge>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          SMS Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Smartphone className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Receive codes via text message
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          Set Up
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Security Keys</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Key className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Use a physical security key
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm">
                          Set Up
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium">Recovery Codes</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recovery codes can be used to access your account if you
                      lose your 2FA device.
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm">
                        View Codes
                      </Button>
                      <Button variant="outline" size="sm">
                        Generate New Codes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and login history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Current Session</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Chrome on Windows • New York, USA
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Started 2 hours ago • IP: 192.168.1.1
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Current
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md bg-muted">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Mobile App</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        iPhone 13 • San Francisco, USA
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Started 1 day ago • IP: 192.168.1.4
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Sign Out All Other Sessions</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Recent login attempts to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginHistory.map((login) => (
                  <div
                    key={login.id}
                    className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium">{login.device}</h4>
                        <Badge
                          variant="outline"
                          className={
                            login.status === "Success"
                              ? "ml-2 bg-green-50 text-green-700 border-green-200"
                              : "ml-2 bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {login.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {login.location} • IP: {login.ip}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {login.time}
                      </p>
                    </div>
                    {login.status === "Failed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Report
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View Full History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
