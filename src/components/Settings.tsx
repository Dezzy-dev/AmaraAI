import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Camera, Save, Crown, Zap, Shield, Sun, Moon, MapPin, UserPlus } from 'lucide-react';
import { useUser, UserData } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

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
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImageUrl || null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // State for UI feedback
  const [savingProfile, setSavingProfile] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const isPremiumUser = () => {
    return user.currentPlan === 'monthly_premium' || user.currentPlan === 'yearly_premium';
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
    let imageUrl = userData.profileImageUrl || null;

    if (profileImageFile) {
      try {
        const fileExt = profileImageFile.name.split('.').pop();
        const fileName = `${userData.id}-profile-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, profileImageFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

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

    try {
      const profileUpdates: Partial<UserData> = {
        name: editName,
        country: editCountry,
        profileImageUrl: imageUrl,
      };
      
      await updateUserData(profileUpdates);
      
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);

    } catch (error: any) {
      console.error('Error updating user profile:', error);
      alert(`Failed to save profile: ${error.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const getPlanDisplayName = () => {
    if (isPremiumUser()) return 'Premium';
    if (isActiveTrialUser()) return 'Trial';
    return 'Freemium';
  };

  const getPlanIcon = () => {
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
        {/* Success Message */}
        {showSaveMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✓ Changes saved successfully!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <UserPlus className="w-6 h-6 mr-3 text-purple-600" />
                Edit Your Profile
              </h2>
              
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

            {/* Development Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a frontend prototype. Profile changes are not persisted to a backend yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;