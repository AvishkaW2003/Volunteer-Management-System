import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Star, Tag, AlignLeft, ShieldCheck } from 'lucide-react';
import { getEventById } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import ApplyModal from "./Student/ApplyModel";


const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent({
            ...data,
            date: data.date || data.eventDate,
            totalSlots: data.totalSlots || data.maxVolunteers || data.volunteerRequired || 30,
            acceptedCount: data.acceptedCount !== undefined ? data.acceptedCount : 0,
            organizer: data.organizer || (data.User ? data.User.name : 'Student Club'),
            volunteerHours: data.volunteerHours || Math.round((data.reputationPoints || 80) / 10) || 4,
            description: data.description || 'No description available for this event.',
          });
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleApplyClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'student') {
        setShowApplyModal(true);
      } else {
        alert('Organizers and admins cannot apply for events. Please sign in with a volunteer student account.');
      }
    } else {
      navigate('/signin');
    }
  };

  const formatDate = iso => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAuthorizedToView = () => {
    if (!event) return false;
    if (user?.role === 'admin' || user?.role === 'organizer') return true;
    const approved = (event.approvalStatus || 'Approved') === 'Approved';
    const notArchived = event.status !== 'Archived';
    return approved && notArchived;
  };

  if (!isAuthorizedToView()) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Event Not Found</h2>
        <p className="text-gray-500 mt-2">The event you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 text-blue-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const spotsLeft = event.totalSlots - event.acceptedCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Back navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold mb-6 transition-colors border-none bg-transparent cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner image */}
        <div className="h-64 sm:h-80 w-full relative bg-gray-100">
          <img 
            src={event.image || `https://picsum.photos/seed/${encodeURIComponent(event.title)}/800/400`} 
            alt={event.title} 
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.src = 'https://picsum.photos/seed/defaultbanner/800/400';
            }}
          />
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {event.category}
          </div>
        </div>

        {/* Content wrapper */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{event.organizer}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{event.title}</h1>
            </div>
            
            {/* Reputation Points Badge */}
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm w-fit self-start sm:self-auto">
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="text-sm font-bold text-white">{event.reputationPoints} Points</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Date & Time</p>
                <p className="text-sm font-bold text-gray-700">{formatDate(event.date)}</p>
                <p className="text-xs text-gray-500">{event.time || '09:00 AM'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Location</p>
                <p className="text-sm font-bold text-gray-700">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Capacity</p>
                <p className="text-sm font-bold text-gray-700">
                  {isFull ? 'Event Full' : `${spotsLeft} spots left`}
                </p>
                <p className="text-xs text-gray-500">{event.acceptedCount} / {event.totalSlots} filled</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-gray-400" /> Event Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Earn list */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-400" /> What You'll Earn
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                {event.volunteerHours} certified volunteer hours
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                Digital participation certificate
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                Leaderboard points & badges
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                Networking with active student clubs
              </li>
            </ul>
          </div>

          {/* Apply Banner */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Earn {event.volunteerHours} Volunteer Hours</p>
                <p className="text-xs text-gray-400">Marked upon host confirmation of attendance.</p>
              </div>
            </div>

            <button
              disabled={isFull}
              onClick={handleApplyClick}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm
                ${isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-md'
                }`}
            >
              {isFull ? 'Registration Full' : 'Register & Apply Now'}
            </button>
          </div>

        </div>
      </div>
      {showApplyModal && (
        <ApplyModal 
          event={event} 
          onClose={() => setShowApplyModal(false)} 
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
