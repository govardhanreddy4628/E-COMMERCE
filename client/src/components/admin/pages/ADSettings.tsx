import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Switch } from "../../../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { useAuth } from "../../../context/AuthContext";

const AdminSettings = () => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL_LOCAL || "http://localhost:8080";
  const { accessToken } = useAuth();

  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);


  // --- ENABLE MFA FLOW ---
  const handleEnableMFA = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/generate`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setQrCodeUrl(data.qr);
      setSecret(data.base32);
      //setQrCodeUrl(data.qrCode);      // base64 QR from backend
      //setSecret(data.secret);         // base32 secret
      setShowEnableDialog(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };


  // On page load → fetch MFA status
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/status`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const data = await res.json();
      setTwoFactorEnabled(data.enabled);
    })();
  }, []);

  

  // Verify the code entered by user
  const handleVerifyCode = async () => {
    setIsVerifying(true);

    if (verificationCode.length !== 6) return;

    try {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/verify-setup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: verificationCode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTwoFactorEnabled(true);
      setShowEnableDialog(false);
      setVerificationCode("");

      toast({
        title: "MFA Enabled",
        description: "Store your backup codes safely:\n" + data.backupCodes.join(", "),
      });
    } catch (err: any) {
      toast({
        title: "Invalid Code",
        description: err.message || "Wrong authenticator code.",
        variant: "destructive",
      });
    }

    setIsVerifying(false);
  };

  // Disable MFA
  const handleDisableMFA = async () => {
    setIsVerifying(true);

    if (verificationCode.length !== 6) return;

    try {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/disable`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: verificationCode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTwoFactorEnabled(false);
      setShowDisableDialog(false);
      setVerificationCode("");

      toast({
        title: "MFA Disabled",
        description: "Two-factor authentication is turned off.",
      });
    } catch (err: any) {
      toast({
        title: "Invalid Code",
        description: err.message || "Wrong authenticator code.",
        variant: "destructive",
      });
    }
    setIsVerifying(false);

  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast({
      title: "Copied",
      description: "Secret key copied to clipboard.",
    });
  };

  const handleMFAToggle = (checked: boolean) => {
    if (checked) {
      handleEnableMFA();
    } else {
      setShowDisableDialog(true);
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your store</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive marketing and promotional content</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the admin panel looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleMFAToggle} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save All Settings</Button>
          </div>
        </div>
      </div>

      {/* Enable MFA Dialog */}
      <Dialog open={showEnableDialog} onOpenChange={setShowEnableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code below with Google Authenticator or any compatible authenticator app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-muted rounded-lg">
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
              )}
            </div>

            {/* Secret Key */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Or enter this key manually:</Label>
              <div className="flex items-center gap-2">
                <Input value={secret} readOnly className="font-mono text-xs" />
                <Button size="icon" variant="outline" onClick={copySecret}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Verification Code Input */}
            <div className="space-y-2">
              <Label htmlFor="verify-code">Enter the 6-digit code from your app:</Label>
              <Input
                id="verify-code"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-widest"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEnableDialog(false);
                setVerificationCode("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleVerifyCode} disabled={isVerifying || verificationCode.length !== 6}>
              {isVerifying ? "Verifying..." : "Verify & Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable MFA Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code from your authenticator app to disable MFA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disable-code">Authentication Code:</Label>
              <Input
                id="disable-code"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-widest"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDisableDialog(false);
                setVerificationCode("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisableMFA}
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Disable MFA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;
