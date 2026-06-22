import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getOrganizerSettings,
  updateOrganizerSettings,
  changePassword
} from '../../services/userService';
import {
  Building,
  Mail,
  Phone,
  Globe,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Upload,
  FileText,
  Check,
  X,
  Camera,
  Bell,
  Award,
  Calendar,
  Users,
  UserCheck,
  Loader2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 ' +
  'focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 ' +
  'placeholder-gray-400 transition bg-white disabled:bg-gray-50 disabled:text-gray-400';

const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
    <div className="p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500
          flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);

const CustomToggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={onChange}
    className="flex items-center gap-3 cursor-pointer focus:outline-none text-left"
  >
    <div
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gray-200'
        }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform duration-200 ${checked ? 'transform translate-x-5' : ''
          }`}
      />
    </div>
    <span className="text-sm text-gray-600 font-medium">{label}</span>
  </button>
);

const MOCK_ORGANIZER_SETTINGS = {
  orgName: 'IEEE Student Branch',
  email: 'ieee@university.edu',
  phone: '+94 11 2345678',
  organizationType: 'IEEE',
  description: 'The IEEE Student Branch organizes technical workshops, community outreach programs, and volunteer events for students.',
  university: 'State University',
  websiteUrl: 'https://ieee.university.edu',
  socialMediaLinks: { facebook: 'https://facebook.com/ieee', twitter: 'https://twitter.com/ieee', linkedin: 'https://linkedin.com/company/ieee', instagram: 'https://instagram.com/ieee' },
  members: [
    { name: 'Nimal Perera', role: 'President' },
    { name: 'Kavindu Silva', role: 'Vice President' },
    { name: 'Anura De Silva', role: 'Secretary' }
  ],
  eventPreferences: { defaultCategory: 'Technology', defaultVolunteerLimit: 40, defaultEventLocation: 'Main Auditorium' },
  notifications: {
    newApplicationSubmitted: true,
    applicationApprovedRejected: true,
    eventApprovedByAdmin: true,
    eventRejectedByAdmin: true,
    attendanceReminders: true,
    certificateGenerationReminders: true,
    weeklyActivitySummary: true
  },
  certificateSettings: { organizerName: 'Dr. Rohan Goonetilleke', signature: '', template: 'Default', footerText: 'In recognition of outstanding volunteer service.' },
  logo: '',
  stats: {
    eventsCreated: 12,
    applicationsReceived: 245,
    approvedVolunteers: 180,
    certificatesGenerated: 142
  }
};

const CATEGORIES = [
  'Community Service',
  'Environment',
  'Education',
  'Health',
  'Technology',
  'Sports',
  'Arts & Culture'
];

const OrganizerSettings = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Settings State
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationType, setOrganizationType] = useState('IEEE');
  const [description, setDescription] = useState('');
  const [university, setUniversity] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [socialMediaLinks, setSocialMediaLinks] = useState({ facebook: '', twitter: '', linkedin: '', instagram: '' });
  const [members, setMembers] = useState([]);
  const [eventPreferences, setEventPreferences] = useState({ defaultCategory: '', defaultVolunteerLimit: 30, defaultEventLocation: '' });
  const [notifications, setNotifications] = useState({
    newApplicationSubmitted: true,
    applicationApprovedRejected: true,
    eventApprovedByAdmin: true,
    eventRejectedByAdmin: true,
    attendanceReminders: true,
    certificateGenerationReminders: true,
    weeklyActivitySummary: true
  });
  const [certificateSettings, setCertificateSettings] = useState({ organizerName: '', signature: '', template: 'Default', footerText: '' });
  const [logo, setLogo] = useState('');
  const [stats, setStats] = useState({
    eventsCreated: 0,
    applicationsReceived: 0,
    approvedVolunteers: 0,
    certificatesGenerated: 0
  });

  // Local Members Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('President');
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [editingMemberName, setEditingMemberName] = useState('');
  const [editingMemberRole, setEditingMemberRole] = useState('President');

  // Password Update State
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        let settingsData;

        if (token && token.startsWith('dummy')) {
          settingsData = JSON.parse(localStorage.getItem('mock_org_settings')) || MOCK_ORGANIZER_SETTINGS;
        } else {
          try {
            settingsData = await getOrganizerSettings();
          } catch (e) {
            console.log('API error. Using mock data.', e);
            settingsData = JSON.parse(localStorage.getItem('mock_org_settings')) || MOCK_ORGANIZER_SETTINGS;
          }
        }

        setOrgName(settingsData.orgName || '');
        setEmail(settingsData.email || '');
        setPhone(settingsData.phone || '');
        setOrganizationType(settingsData.organizationType || 'IEEE');
        setDescription(settingsData.description || '');
        setUniversity(settingsData.university || '');
        setWebsiteUrl(settingsData.websiteUrl || '');
        setSocialMediaLinks(settingsData.socialMediaLinks || { facebook: '', twitter: '', linkedin: '', instagram: '' });
        setMembers(settingsData.members || []);
        setEventPreferences(settingsData.eventPreferences || { defaultCategory: '', defaultVolunteerLimit: 30, defaultEventLocation: '' });
        setNotifications({
          newApplicationSubmitted: settingsData.notifications?.newApplicationSubmitted ?? true,
          applicationApprovedRejected: settingsData.notifications?.applicationApprovedRejected ?? true,
          eventApprovedByAdmin: settingsData.notifications?.eventApprovedByAdmin ?? true,
          eventRejectedByAdmin: settingsData.notifications?.eventRejectedByAdmin ?? true,
          attendanceReminders: settingsData.notifications?.attendanceReminders ?? true,
          certificateGenerationReminders: settingsData.notifications?.certificateGenerationReminders ?? true,
          weeklyActivitySummary: settingsData.notifications?.weeklyActivitySummary ?? true
        });
        setCertificateSettings(settingsData.certificateSettings || { organizerName: '', signature: '', template: 'Default', footerText: '' });
        setLogo(settingsData.logo || '');
        setStats(settingsData.stats || { eventsCreated: 0, applicationsReceived: 0, approvedVolunteers: 0, certificatesGenerated: 0 });

      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Could not load profile settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Image Upload and Removal Handlers
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG formats are supported for organization logo.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo('');
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG formats are supported for signature.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertificateSettings(prev => ({ ...prev, signature: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    setCertificateSettings(prev => ({ ...prev, signature: '' }));
  };

   // MembersCRUD Operations
    const handleAddMember = () => {
      const cleanName = newMemberName.trim();
      if (!cleanName) return;
      
      const duplicate = members.some(m => m.name.toLowerCase() === cleanName.toLowerCase());
      if (duplicate) {
        setError('A member with this name already exists.');
        return;
      }
      
      setError('');
      const newMember = { name: cleanName, role: newMemberRole };
      setMembers([...members, newMember]);
      setNewMemberName('');
      setNewMemberRole('President');
    };
  
    const handleRemoveMember = (index) => {
      setMembers(members.filter((_, i) => i !== index));
    };
  
    const handleStartEditMember = (index) => {
      setEditingMemberIndex(index);
      setEditingMemberName(members[index].name);
      setEditingMemberRole(members[index].role);
    };
  
    const handleSaveEditMember = () => {
      const cleanName = editingMemberName.trim();
      if (!cleanName) return;
  
      const duplicate = members.some((m, i) => i !== editingMemberIndex && m.name.toLowerCase() === cleanName.toLowerCase());
      if (duplicate) {
        setError('A member with this name already exists.');
        return;
      }
  
      setError('');
      const updated = [...members];
      updated[editingMemberIndex] = { name: cleanName, role: editingMemberRole };
      setMembers(updated);
      setEditingMemberIndex(null);
      setEditingMemberName('');
    };
  
    // Social Links Updater
    const handleSocialChange = (key, value) => {
      setSocialMediaLinks(prev => ({
        ...prev,
        [key]: value
      }));
    };
  
    // Event Preferences Updater
    const handlePrefChange = (key, value) => {
      setEventPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    };
  
    // Global Save
    const handleSaveSettings = async () => {
      setSaving(true);
      setError('');
      setSuccess('');
  
      if (!orgName.trim()) {
        setError('Organization Name is required.');
        setSaving(false);
        return;
      }
  
      const payload = {
        orgName,
        phone,
        organizationType,
        description,
        university,
        websiteUrl,
        socialMediaLinks,
        members,
        eventPreferences,
        notifications,
        certificateSettings,
        logo
      };
  
      try {
        const token = localStorage.getItem('token');
        if (token && token.startsWith('dummy')) {
          localStorage.setItem('mock_org_settings', JSON.stringify(payload));
          updateUser({
            ...user,
            name: orgName,
            phone,
            organizerProfile: {
              ...user?.organizerProfile,
              ...payload
            }
          });
        } else {
          await updateOrganizerSettings(payload);
          updateUser({
            ...user,
            name: orgName,
            phone,
            organizerProfile: {
              ...user?.organizerProfile,
              ...payload
            }
          });
        }
        setSuccess('Settings successfully updated!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccess(''), 4000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to save settings details.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setSaving(false);
      }
    };
  
    // Password Changer Action
    const handlePasswordUpdate = async (e) => {
      e.preventDefault();
      setPasswordError('');
      setPasswordSuccess('');
  
      const { current, newPass, confirm } = passwords;
      if (!current || !newPass || !confirm) {
        setPasswordError('Please fill in all password fields.');
        return;
      }
  
      if (newPass !== confirm) {
        setPasswordError('New password and confirmation do not match.');
        return;
      }
  
      if (newPass.length < 6) {
        setPasswordError('New password must be at least 6 characters.');
        return;
      }
  
      setPasswordUpdating(true);
      try {
        const token = localStorage.getItem('token');
        if (token && token.startsWith('dummy')) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setPasswordSuccess('Password successfully updated!');
        } else {
          await changePassword({ currentPassword: current, newPassword: newPass });
          setPasswordSuccess('Password successfully updated!');
        }
        setPasswords({ current: '', newPass: '', confirm: '' });
        setTimeout(() => setPasswordSuccess(''), 4000);
      } catch (err) {
        setPasswordError(err.response?.data?.message || 'Failed to update password. Verify current password.');
      } finally {
        setPasswordUpdating(false);
      }
    };
  
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          <p className="text-gray-500 text-sm font-semibold">Loading settings profile...</p>
        </div>
      );
    }
  
    const statConfig = [
      { label: 'Events Created', value: stats.eventsCreated, icon: Calendar, bg: 'bg-cyan-50 text-cyan-600' },
      { label: 'Applications Received', value: stats.applicationsReceived, icon: Users, bg: 'bg-blue-50 text-blue-600' },
      { label: 'Approved Volunteers', value: stats.approvedVolunteers, icon: UserCheck, bg: 'bg-emerald-50 text-emerald-600' },
      { label: 'Certificates Generated', value: stats.certificatesGenerated, icon: Award, bg: 'bg-indigo-50 text-indigo-600' }
    ];
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            Settings <Sparkles className="w-6 h-6 text-cyan-500" />
          </h1>
          <p className="mt-1.5 text-gray-500 text-base">
            Manage your organization profile, preferences, members list, templates, and security configuration.
          </p>
        </div>