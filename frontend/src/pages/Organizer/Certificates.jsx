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
