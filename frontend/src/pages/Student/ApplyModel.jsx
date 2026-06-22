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