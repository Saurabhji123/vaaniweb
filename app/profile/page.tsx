'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import Navigation from '../components/Navigation';
import { 
  ProfileIcon, 
  EmailIcon, 
  GoogleIcon, 
  SettingsIcon, 
  PasswordIcon, 
  LogoutIcon, 
  SparklesIcon, 
  OverviewIcon, 
  WebsiteIcon,
  UploadIcon,
  TrashIcon,
  PricingIcon,
  FeedIcon
} from '../components/Icons';

type TabType = 'overview' | 'settings' | 'password';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, loading, logout, refreshUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Profile update state
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    // Set name from user
    if (user) {
      setName(user.name);
      setProfilePicture(user.profilePicture || '');
      setImagePreview(user.profilePicture || '');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Refresh user data from MongoDB on page load - only once
    const fetchUserData = async () => {
      if (token && user) {
        setRefreshing(true);
        await refreshUser();
        setRefreshing(false);
      }
    };
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim()) {
      setProfileError('Name is required');
      return;
    }

    setProfileLoading(true);

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: name.trim(),
          profilePicture: profilePicture || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileError(data.message || 'Failed to update profile');
        setProfileLoading(false);
        return;
      }

      updateUser(data.user);
      setProfileSuccess('Profile updated successfully!');
      setProfileLoading(false);
    } catch (error) {
      setProfileError('Network error. Please try again.');
      setProfileLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfilePicture(base64String);
      setImagePreview(base64String);
      setProfileError('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfilePicture('');
    setImagePreview('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!user) {
      setPasswordError('User not found');
      return;
    }

    // Only Google users WITHOUT password can set password without current password
    const canSetPasswordWithoutCurrent = user.authProvider === 'google' && !user.hasPassword;

    // For all others (email users or Google users who already set password), require current password
    if (!canSetPasswordWithoutCurrent && !currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setPasswordError('New password and confirmation are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const requestBody: any = { newPassword };
      
      // Include currentPassword if required
      if (!canSetPasswordWithoutCurrent) {
        requestBody.currentPassword = currentPassword;
      }

      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || 'Failed to change password');
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess(data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordLoading(false);
      
      // Refresh user data to update hasPassword flag
      await refreshUser();
    } catch (error) {
      setPasswordError('Network error. Please try again.');
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to delete account');
        setDeleteLoading(false);
        setShowDeleteConfirm(false);
        return;
      }

      // Account deleted successfully
      alert(data.message || 'Your account has been permanently deleted.');
      
      // Logout and redirect to home
      logout();
      router.push('/');
    } catch (error) {
      alert('Network error. Please try again.');
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'ultra': return 'from-yellow-400 to-orange-500';
      case 'pro': return 'from-blue-500 to-purple-600';
      case 'starter': return 'from-green-500 to-teal-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const sitesRemaining = user.monthlyLimit === -1 ? '∞' : user.monthlyLimit - user.sitesCreated;
  const usagePercentage = user.monthlyLimit === -1 ? 0 : (user.sitesCreated / user.monthlyLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center md:text-left">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                    <ProfileIcon className="text-white" size={40} />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-black mb-2">{user.name}</h1>
                  <p className="text-pink-100 text-lg">{user.email}</p>
                </div>
              </div>
              <div className={`px-6 py-3 bg-gradient-to-r ${getPlanBadgeColor(user.plan)} rounded-full font-bold text-white text-lg uppercase shadow-lg`}>
                {user.plan} Plan
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <OverviewIcon size={20} />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <SettingsIcon size={20} />
                Settings
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'password'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <PasswordIcon size={20} />
                Password
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 font-semibold">Sites Created</h3>
                      <WebsiteIcon className="text-purple-600" size={32} />
                    </div>
                    <p className="text-4xl font-black text-gray-900">{user.sitesCreated}</p>
                    <p className="text-sm text-gray-500 mt-2">This month</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 font-semibold">Monthly Limit</h3>
                      <OverviewIcon className="text-blue-600" size={32} />
                    </div>
                    <p className="text-4xl font-black text-gray-900">
                      {user.monthlyLimit === -1 ? '∞' : user.monthlyLimit}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Total allowed</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-600 font-semibold">Remaining</h3>
                      <SparklesIcon className="text-green-600" size={32} />
                    </div>
                    <p className="text-4xl font-black text-gray-900">{sitesRemaining}</p>
                    <p className="text-sm text-gray-500 mt-2">Sites left</p>
                  </div>
                </div>

                {user.monthlyLimit !== -1 && (
                  <div className="bg-gray-100 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-gray-700 font-semibold">Monthly Usage</h3>
                      <span className="text-gray-600 font-bold">{Math.round(usagePercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          usagePercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-green-500 to-teal-500'
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      {usagePercentage >= 90 ? (
                        <>
                          <span className="text-red-500 font-bold">⚠</span>
                          <span className="text-red-600 font-semibold">Almost at your limit!</span>
                        </>
                      ) : usagePercentage >= 70 ? (
                        <>
                          <span className="text-orange-500 font-bold">⚡</span>
                          <span className="text-orange-600 font-semibold">Getting close to your limit</span>
                        </>
                      ) : (
                        <>
                          <span className="text-green-500 font-bold">✓</span>
                          <span className="text-green-600 font-semibold">You have plenty of sites remaining</span>
                        </>
                      )}
                    </p>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg"
                    >
                      <SparklesIcon size={24} />
                      <span>Create Website</span>
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition font-semibold shadow-lg"
                    >
                      <PricingIcon size={24} />
                      <span>Upgrade Plan</span>
                    </Link>
                    <Link
                      href="/feed"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-teal-700 transition font-semibold shadow-lg"
                    >
                      <FeedIcon size={24} />
                      <span>Browse Showcase</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition font-semibold shadow-lg"
                    >
                      <LogoutIcon size={24} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Profile Settings</h2>
                  
                  {profileError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                      {profileError}
                    </div>
                  )}
                  
                  {profileSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                      {profileSuccess}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Profile" 
                              className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-200 flex items-center justify-center">
                              <ProfileIcon className="text-purple-600" size={40} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={profileLoading}
                          />
                          <div className="flex gap-3">
                            <label
                              htmlFor="profileImage"
                              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                            >
                              <UploadIcon size={18} />
                              Upload Image
                            </label>
                            {imagePreview && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                                disabled={profileLoading}
                              >
                                <TrashIcon size={18} />
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Max file size: 5MB. Supports: JPG, PNG, GIF
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={profileLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {profileLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>

                {/* Account Information */}
                <div className="border-t pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Account Type</p>
                        <p className="text-gray-900 font-medium mt-1 flex items-center gap-2">
                          {user.authProvider === 'google' ? (
                            <>
                              <GoogleIcon size={20} />
                              <span>Google Account</span>
                            </>
                          ) : (
                            <>
                              <EmailIcon size={20} className="text-gray-600" />
                              <span>Email Account</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Current Plan</p>
                        <p className="text-gray-900 font-medium mt-1 uppercase">{user.plan}</p>
                      </div>
                      <Link
                        href="/pricing"
                        className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                      >
                        Upgrade →
                      </Link>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Monthly Limit</p>
                        <p className="text-gray-900 font-medium mt-1">
                          {user.monthlyLimit === -1 ? 'Unlimited' : `${user.monthlyLimit} websites`}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Websites Created</p>
                        <p className="text-gray-900 font-medium mt-1">{user.sitesCreated} this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  {user.authProvider === 'google' && !user.hasPassword ? 'Set Password' : 'Change Password'}
                </h2>
                
                {user.authProvider === 'google' && !user.hasPassword && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <GoogleIcon size={20} />
                      <span>Google Account Detected</span>
                    </p>
                    <p className="text-sm">
                      You signed up with Google. Set a password below to enable email/password login as backup.
                    </p>
                  </div>
                )}
                
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Show current password field for email users OR Google users who already have password */}
                  {(user.authProvider === 'email' || (user.authProvider === 'google' && user.hasPassword)) && (
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={passwordLoading}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      {user.authProvider === 'google' && !user.hasPassword ? 'Password' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Minimum 6 characters"
                      disabled={passwordLoading}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      {user.authProvider === 'google' && !user.hasPassword ? 'Confirm Password' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Re-enter new password"
                      disabled={passwordLoading}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading 
                      ? (user.authProvider === 'google' && !user.hasPassword ? 'Setting Password...' : 'Changing Password...') 
                      : (user.authProvider === 'google' && !user.hasPassword ? 'Set Password' : 'Change Password')
                    }
                  </button>
                </form>

                <div className="mt-8 p-6 border-2 border-red-200 rounded-xl bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrashIcon size={24} className="text-red-600" />
                    <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                    >
                      <TrashIcon size={20} />
                      <span>Delete Account</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <p className="text-red-800 font-semibold text-center mb-2">
                          ⚠️ Final Warning!
                        </p>
                        <p className="text-red-700 text-sm text-center">
                          This action CANNOT be undone. Your account and all {user.sitesCreated} generated pages will be permanently deleted.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleteLoading}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <TrashIcon size={20} />
                              <span>Yes, Delete Forever</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
