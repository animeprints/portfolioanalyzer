import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Palette,
  Save,
  Link as LinkedinIcon,
  Code as Github,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { profileService } from '../services/profileService';
import NeonButton from '../components/UI/NeonButton';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useStore();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setLinkedinUrl(currentUser.preferences.linkedin_url || '');
      setGithubUrl(currentUser.preferences.github_url || '');
      setWebsiteUrl(currentUser.preferences.website_url || '');
      setLanguage(currentUser.preferences.language || 'en');
      setTheme(currentUser.preferences.theme || 'dark');
      setNotifications(currentUser.preferences.notifications !== false); // default true
    }
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Validate password change
      if (newPassword) {
        if (!currentPassword) {
          setMessage({ type: 'error', text: 'Please enter your current password to set a new one.' });
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match.' });
          setSaving(false);
          return;
        }
      }

      // Prepare update payload according to backend API
      const updateData: any = {
        name,
        email,
        language,
        theme,
        linkedin_url: linkedinUrl || undefined,
        github_url: githubUrl || undefined,
        website_url: websiteUrl || undefined,
        notifications,
      };

      // Only include password fields if changing password
      if (currentPassword && newPassword) {
        updateData.current_password = currentPassword;
        updateData.new_password = newPassword;
      }

      await profileService.updateProfile(updateData);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Update local user
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          name,
          email,
          preferences: {
            ...currentUser.preferences,
            linkedin_url: linkedinUrl,
            github_url: githubUrl,
            website_url: websiteUrl,
            language,
            theme,
            notifications,
          },
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Account Information</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Change Password
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-field"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Leave blank to keep current password
                </p>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Social Links</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4 text-blue-400" /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Profile
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Personal Website
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-dark-800">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Theme
                </label>
                <div className="flex gap-4">
                  {(['dark', 'light', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-3 rounded-xl border transition-all capitalize ${
                        theme === t
                          ? 'border-cyan-500 bg-cyan-500/20 text-white'
                          : 'border-white/20 text-gray-400 hover:border-white/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-gray-400 text-sm">Receive updates and tips</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifications ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-end"
          >
            <NeonButton
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saving}
              icon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </NeonButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
