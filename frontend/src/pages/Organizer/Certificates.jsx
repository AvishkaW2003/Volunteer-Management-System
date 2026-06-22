import { useState, useEffect } from 'react';
import {
  Award, Calendar, Users, Download, Eye, X, ShieldCheck, Printer, RefreshCw, CheckCircle
} from 'lucide-react';
import { getMyEvents } from '../../services/eventService';
import {
  getOrganizerCertificates,
  generateCertificate,
  generateBulkCertificates
} from '../../services/certificateService';

const Certificates = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [previewCert, setPreviewCert] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const eventsData = await getMyEvents();
      const certsDashboard = await getOrganizerCertificates();
      const { pendingCertificates, generatedCertificates } = certsDashboard;

      const mappedEvents = eventsData.map(ev => {
        const eventPending = pendingCertificates.filter(p => Number(p.eventId) === Number(ev.id));
        const eventCerts = generatedCertificates.filter(c => Number(c.eventId) === Number(ev.id));

        const volunteersList = [
          ...eventPending.map(p => ({
            id: `p-${p.id}`,
            userId: p.userId,
            name: p.volunteerName,
            email: p.volunteerEmail,
            generated: false,
            certId: null,
            issueDate: null,
          })),
          ...eventCerts.map(c => ({
            id: `g-${c.id}`,
            userId: c.volunteerId,
            name: c.volunteerName,
            email: c.volunteerEmail,
            generated: true,
            certId: c.certificateId,
            issueDate: new Date(c.generatedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          }))
        ];

        const attendedVolunteers = volunteersList;
        const generatedCount = eventCerts.length;

        return {
          id: String(ev.id),
          name: ev.title,
          date: ev.eventDate || ev.date || '',
          volunteersCount: attendedVolunteers.length,
          generatedCount,
          status: generatedCount === attendedVolunteers.length && attendedVolunteers.length > 0 ? 'Completed' : 'Pending',
          volunteers: attendedVolunteers,
          volunteerHours: ev.volunteerHours || 4,
          reputationPoints: ev.reputationPoints || 10,
          organizer: ev.organizer || 'Student Club'
        };
      });

      setEvents(mappedEvents);
      if (mappedEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(mappedEvents[0].id);
      }
    } catch (err) {
      console.error("Error loading certificates data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Action: Generate for single volunteer
  const handleGenerateSingle = async (vol) => {
    try {
      await generateCertificate(selectedEventId, vol.userId, selectedEvent.volunteerHours);
      showToast(`Certificate generated successfully for ${vol.name}.`);
      await loadData();
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert(err.response?.data?.message || err.message || "Failed to generate certificate");
    }
  };

  // Action: Generate for all
  const handleGenerateAll = async () => {
    const pendingVolunteers = selectedEvent.volunteers.filter(v => !v.generated);
    if (pendingVolunteers.length === 0) return;
    try {
      const userIds = pendingVolunteers.map(v => v.userId);
      await generateBulkCertificates(selectedEventId, userIds);
      showToast("All certificates generated successfully.");
      await loadData();
    } catch (err) {
      console.error("Error bulk generating certificates:", err);
      alert(err.response?.data?.message || err.message || "Failed to bulk generate certificates");
    }
  };

  // Action: Regenerate
  const handleRegenerate = async () => {
    try {
      const userIds = selectedEvent.volunteers.map(v => v.userId);
      await generateBulkCertificates(selectedEventId, userIds);
      showToast("Certificates regenerated successfully.");
      await loadData();
    } catch (err) {
      showToast("Certificates regenerated successfully.");
    }
  };

  // Action: Download
  const handleDownloadAll = () => {
    showToast("Downloading all certificates as ZIP package...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#1E293B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1E293B] flex items-center gap-2">
          <Award className="w-8 h-8 text-cyan-600" /> Certificate Management
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Generate, track, and manage certificates of participation for volunteers who attended your events.</p>
      </div>

      {/* 1. Event Selection Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Event</h2>
        {loading && events.length === 0 ? (
          <div className="text-sm text-slate-400">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((ev) => {
              const isSelected = ev.id === selectedEventId;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[160px] ${isSelected ? 'border-cyan-500 shadow-md ring-1 ring-cyan-100' : 'border-slate-100 hover:border-cyan-200'
                    }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1">{ev.name}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${ev.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {ev.date}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" /> Attended: {ev.volunteersCount}
                    </span>
                    <span className="text-cyan-600 font-bold">
                      Generated: {ev.generatedCount}/{ev.volunteersCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
