"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, User, Shield, Building2, Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { updateProfile, updateOrganization, updatePassword } from "@/app/actions/settings-actions"

interface SettingsUser {
  name?: string | null;
  email?: string | null;
  organization?: { name: string } | null;
}

export function SettingsContent({ user }: { user: SettingsUser }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({ name: user.name || "", email: user.email || "" })
  const [orgData, setOrgData] = useState({ name: user.organization?.name || "" })
  const [password, setPassword] = useState("")

  const handleProfileSave = async () => {
    if (!profileData.name) return toast.error("Name is required")
    setLoading(true)
    try {
      await updateProfile(profileData)
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleOrgSave = async () => {
    if (!orgData.name) return toast.error("Organization name is required")
    setLoading(true)
    try {
      await updateOrganization(orgData)
      toast.success("Organization updated successfully")
    } catch {
      toast.error("Failed to update organization")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSave = async () => {
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters")
    setLoading(true)
    try {
      await updatePassword(password)
      toast.success("Password updated successfully")
      setPassword("")
    } catch {
      toast.error("Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="col-span-1 space-y-2">
        <Button 
          variant={activeTab === "profile" ? "secondary" : "ghost"} 
          className="w-full justify-start font-medium"
          onClick={() => setActiveTab("profile")}
        >
          <User className="mr-2 h-4 w-4" /> Profile
        </Button>
        <Button 
          variant={activeTab === "organization" ? "secondary" : "ghost"} 
          className="w-full justify-start font-medium"
          onClick={() => setActiveTab("organization")}
        >
          <Building2 className="mr-2 h-4 w-4" /> Organization
        </Button>
        <Button 
          variant={activeTab === "security" ? "secondary" : "ghost"} 
          className="w-full justify-start font-medium"
          onClick={() => setActiveTab("security")}
        >
          <Shield className="mr-2 h-4 w-4" /> Security
        </Button>
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="destructive" className="w-full justify-start font-medium" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-3 space-y-6">
        {activeTab === "profile" && (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Update your personal information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.name} 
                    onChange={(e) => setProfileData(p => ({ ...p, name: e.target.value }))} 
                    placeholder="Your name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    value={profileData.email} 
                    disabled 
                  />
                  <p className="text-xs text-slate-500">Your email cannot be changed.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800/50 pt-6">
              <Button onClick={handleProfileSave} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "organization" && (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Update your organization&apos;s information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input 
                  id="orgName" 
                  value={orgData.name} 
                  onChange={(e) => setOrgData(p => ({ ...p, name: e.target.value }))} 
                  placeholder="Organization name" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800/50 pt-6">
              <Button onClick={handleOrgSave} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "security" && (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Minimum 6 characters" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800/50 pt-6">
              <Button onClick={handlePasswordSave} disabled={loading || password.length < 6}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
