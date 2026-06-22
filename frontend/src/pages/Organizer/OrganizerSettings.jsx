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
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gray-200'
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform duration-200 ${
          checked ? 'transform translate-x-5' : ''
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
