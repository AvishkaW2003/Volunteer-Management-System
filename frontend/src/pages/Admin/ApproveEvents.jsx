import { useState, useEffect } from 'react';
import { 
  CalendarCheck, CheckCircle, XCircle, Clock, MapPin, Calendar, 
  Users, Award, Eye, ThumbsUp, ThumbsDown, X, RefreshCw, FolderOpen
} from 'lucide-react';
import { 
  getPendingEvents, 
  approveEvent, 
  rejectEvent 
} from '../../services/adminService';

const statusBadge = {
  pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    label: 'Pending Approval'
  },
  approved: {
    bg: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
    label: 'Approved'
  },
  rejected: {
    bg: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
    label: 'Rejected'
  }
};

const ApproveEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected
  const [selectedEvent, setSelectedEvent] = useState(null); // For Details Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchEvents = async (status) => {
    setLoading(true);
    try {
      const data = await getPendingEvents(status);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(activeTab);
  }, [activeTab]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApprove = async (id, title) => {
    if (!window.confirm(`Are you sure you want to approve "${title}"?`)) {
      return;
    }
    try {
      await approveEvent(id);
      setEvents(events.filter(e => e.id !== id));
      if (isModalOpen && selectedEvent?.id === id) {
        setIsModalOpen(false);
      }
      showToast('Event approved successfully!');
    } catch (err) {
      console.error('Error approving event:', err);
      alert(err.response?.data?.message || 'Failed to approve event.');
    }
  };

  const handleReject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to reject "${title}"?`)) {
      return;
    }
    try {
      await rejectEvent(id);
      setEvents(events.filter(e => e.id !== id));
      if (isModalOpen && selectedEvent?.id === id) {
        setIsModalOpen(false);
      }
      showToast('Event rejected successfully.');
    } catch (err) {
      console.error('Error rejecting event:', err);
      alert(err.response?.data?.message || 'Failed to reject event.');
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-8 h-8 text-teal-600" /> Event Approvals
          </h1>
          <p className="text-slate-500 mt-1">Review and manage events posted by club organizers.</p>
        </div>
        <button 
          onClick={() => fetchEvents(activeTab)}
          className="p-2 text-teal-600 hover:bg-teal-50 border border-teal-100 rounded-xl transition-all"
          title="Refresh Events"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'pending', label: 'Pending Approvals', count: null },
          { id: 'approved', label: 'Approved Events', count: null },
          { id: 'rejected', label: 'Rejected Events', count: null }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all capitalize -mb-px ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200">
          {error}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const badge = statusBadge[event.status] || statusBadge.pending;
          const BadgeIcon = badge.icon;
          const defaultImage = "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800";
          const eventImage = event.image || defaultImage;

          return (
            <div 
              key={event.id} 
              className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden flex flex-col hover:shadow-md hover:shadow-teal-100/30 transition-all duration-200"
            >
              {/* Event Cover Image */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={eventImage} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border ${badge.bg}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  {badge.label}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1" title={event.title}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-teal-600 font-semibold mt-1">
                    By {event.User?.name || 'Rotaract Club'}
                  </p>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-1">
                  {event.description}
                </p>

                {/* Event Details Summary */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="truncate">{event.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="truncate">{event.time || "10:00 AM"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 col-span-2">
                    <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-teal-50/40 p-2.5 rounded-xl text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{event.volunteerRequired} Max Vol.</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center border-l border-teal-100">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>{event.reputationPoints || 10} RP</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleViewDetails(event)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 text-xs font-bold bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>

                {event.status === 'pending' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReject(event.id, event.title)}
                      className="flex items-center gap-1 text-white text-xs font-bold bg-[#EF4444] hover:bg-red-600 px-3 py-2 rounded-xl transition-all shadow-sm shadow-red-100"
                      title="Reject Event"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(event.id, event.title)}
                      className="flex items-center gap-1 text-white text-xs font-bold bg-[#22C55E] hover:bg-green-600 px-3 py-2 rounded-xl transition-all shadow-sm shadow-green-100"
                      title="Approve Event"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-teal-100">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">No events found</p>
            <p className="text-xs text-slate-400 mt-1">There are currently no events in the "{activeTab}" status.</p>
          </div>
        )}
      </div>

      {/* DETAILS VIEW MODAL */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-teal-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Cover */}
            <div className="relative h-60 bg-slate-100 overflow-hidden">
              <img 
                src={selectedEvent.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800"} 
                alt={selectedEvent.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-slate-950/40 hover:bg-slate-950/60 p-2 rounded-full text-white backdrop-blur-sm transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              <span className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-md backdrop-blur-md ${statusBadge[selectedEvent.status]?.bg || 'bg-amber-50 text-amber-700'}`}>
                {selectedEvent.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                {selectedEvent.status === 'approved' && <CheckCircle className="w-3.5 h-3.5" />}
                {selectedEvent.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                {statusBadge[selectedEvent.status]?.label || 'Pending Approval'}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                  Club Event Proposal
                </span>
                <h2 className="text-2xl font-extrabold text-slate-800 mt-1 leading-snug">
                  {selectedEvent.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">
                  Organized by: <span className="text-teal-600 font-semibold">{selectedEvent.User?.name || 'Leo Club'}</span>
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-teal-50/30 rounded-xl border border-teal-50">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>{selectedEvent.eventDate}</span>
                  </div>
                </div>

                <div className="space-y-1 border-l border-slate-200/50 pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>{selectedEvent.time || "10:00 AM"}</span>
                  </div>
                </div>

                <div className="space-y-1 border-l border-slate-200/50 pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reputation</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>{selectedEvent.reputationPoints || 10} Points</span>
                  </div>
                </div>

                <div className="space-y-1 border-l border-slate-200/50 pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Volunteers</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{selectedEvent.volunteerRequired} Max</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-teal-600" /> Location / Venue
                </span>
                <p className="text-sm font-semibold text-slate-800 pl-5">
                  {selectedEvent.location}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                  Event Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line max-h-44 overflow-y-auto pr-2">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all"
                >
                  Close Window
                </button>

                {selectedEvent.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(selectedEvent.id, selectedEvent.title)}
                      className="flex items-center gap-1.5 text-white text-xs font-bold bg-[#EF4444] hover:bg-red-600 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Reject Event</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedEvent.id, selectedEvent.title)}
                      className="flex items-center gap-1.5 text-white text-xs font-bold bg-[#22C55E] hover:bg-green-600 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Approve Event</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveEvents;
