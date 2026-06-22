import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applyToEvent } from '../../services/applicationService';
import { X, Calendar, MapPin, Users, Clock, CheckCircle, Award, Heart, Sparkles, Send } from 'lucide-react';
const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 ' +
  'placeholder-gray-400 transition bg-white';

const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';
const EARN_ITEMS = [
  ev => `${ev.volunteerHours} certified volunteer hours`,
  () => 'Digital participation certificate',
  () => 'Leaderboard points & badges',
  () => 'Networking with the organizer',
];

const formatDate = iso => {
  const [y, m, d] = iso.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};
const ApplyModal = ({ event, onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    skills: user?.studentProfile?.skills ? user.studentProfile.skills.join(', ') : '',
    motivation: '',
    experience: '',
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        skills: prev.skills || (user.studentProfile?.skills ? user.studentProfile.skills.join(', ') : ''),
      }));
    }
  }, [user]);
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const canSubmit = form.name && form.email && form.phone && form.motivation && form.agreed;
  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    
    try {
      const submissionData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        skills: form.skills,
        motivation: form.motivation,
        experience: form.experience
      };
      
      await applyToEvent(event.id, submissionData);
      
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert(err.response?.data?.message || err.message || "Failed to submit application");
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-2xl lg:flex-row">
        {/* ── Left: Application Form ───────────────────── */}
        <div className="flex-1 p-6 lg:p-8"></div>