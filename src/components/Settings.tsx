import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Camera, Save, Crown, Zap, Shield, Sun, Moon, MapPin, UserPlus, LogOut, AlertTriangle } from 'lucide-react';
import useUser from '../contexts/useUser';
import { UserData } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface SettingsProps {
  user: UserData;
  onBack: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onBack, isDark, toggleDarkMode }) => {
  const { userData, updateUserData } = useUser();

  // State for form fields
  const [editName, setEditName] = useState(user.name);
  const [editCountry, setEditCountry] = useState(user.country || '');
  
  // State for image handling
  const [profileImage, setProfileImage] = useState<string | null>(user.profile_image_url || null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // State for UI feedback
  const [savingProfile, setSavingProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isPremiumUser = () => {
    return user.isJudge || user.currentPlan === 'monthly_premium' || user.currentPlan === 'yearly_premium';
  };

  const isTrialUser = () => {
    return user.currentPlan === 'monthly_trial' || user.currentPlan === 'yearly_trial';
  };

  const isActiveTrialUser = () => {
    if (!isTrialUser()) return false;
    
    if (user.trialEndDate) {
      const trialEndDate = new Date(user.trialEndDate);
      const now = new Date();
      return now < trialEndDate;
    }
    
    return true;
  };

  const getTrialDaysRemaining = () => {
    if (!user.trialEndDate) return 0;
    const trialEndDate = new Date(user.trialEndDate);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!userData) return;
    
    setSavingProfile(true);
    let imageUrl = userData.profile_image_url || null;

    if (profileImageFile) {
      try {
        const fileExt = profileImageFile.name.split('.').pop();
        const newFileName = `profile.${fileExt}`;
        const filePath = `${userData.id}/${newFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, profileImageFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        if (publicUrlData) {
            imageUrl = publicUrlData.publicUrl;
        } else {
            console.error("Could not get public URL for the uploaded image.");
        }
        
      } catch (error: any) {
        console.error('Error uploading profile image:', error);
        alert(`Failed to upload image: ${error.message}`);
        setSavingProfile(false);
        return;
      }
    }

    // Check if there are any actual changes to save
    const hasProfileInfoChanged = editName !== user.name || editCountry !== (user.country || '');
    const hasProfileImageChanged = imageUrl !== user.profile_image_url;

    if (!hasProfileInfoChanged && !hasProfileImageChanged) {
      toast.info("No changes to save.");
      setSavingProfile(false);
      return;
    }

    try {
      const profileUpdates: Partial<UserData> = {};
      if (hasProfileInfoChanged) {
        profileUpdates.name = editName;
        profileUpdates.country = editCountry;
      }
      if (hasProfileImageChanged) {
        profileUpdates.profile_image_url = imageUrl;
      }
      
      await updateUserData(profileUpdates);
      
      toast.success("Profile saved successfully!");

    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast.error(`Failed to save profile: ${error.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Show success toast
      toast.success('You have successfully logged out', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });

      // Navigate to landing page
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'landing' } }));

    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const getPlanDisplayName = () => {
    if (user.isJudge) return 'Judge Premium';
    if (isPremiumUser()) return 'Premium';
    if (isActiveTrialUser()) return 'Trial';
    return 'Freemium';
  };

  const getPlanIcon = () => {
    if (user.isJudge) return <Crown className="w-5 h-5 text-yellow-500" fill="currentColor" />;
    if (isPremiumUser()) return <Crown className="w-5 h-5 text-yellow-500" fill="currentColor" />;
    if (isActiveTrialUser()) return <Zap className="w-5 h-5 text-purple-500" />;
    return <Shield className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                disabled={savingProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:bg-purple-400"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <UserPlus className="w-6 h-6 mr-3 text-purple-600" />
                Edit Your Profile
              </h2>
              
              {/* Judge Badge */}
              {user.isJudge && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-center">
                    <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" fill="currentColor" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Judge Account</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">You have unlimited access to all premium features.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Profile Image & Form */}
              <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                {/* Image Uploader */}
                <div className="flex-shrink-0 flex flex-col items-center space-y-3 mb-6 md:mb-0">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl relative overflow-hidden">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        editName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                      <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload</p>
                </div>
                
                {/* Form Fields */}
                <div className="w-full space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      placeholder="Email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Country
                    </label>
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., United States"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                  <div className="flex items-center space-x-2">
                    {getPlanIcon()}
                    <span className="font-medium text-gray-900 dark:text-white">{getPlanDisplayName()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                {isActiveTrialUser() && user.trialEndDate && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">Trial Ends</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {new Date(user.trialEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Privacy Settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your privacy</p>
                    </div>
                  </div>
                </button>
                
                {!user.isJudge && (
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Crown className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Upgrade Plan</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get premium features</p>
                      </div>
                    </div>
                  </button>
                )}

                {/* Logout Button */}
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full text-left p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-200">
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200">Sign Out</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Log out of your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Help & Support</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Contact Support</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get help when you need it</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sign Out</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You'll need to sign in again to access your account and continue your conversations with Amara.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;