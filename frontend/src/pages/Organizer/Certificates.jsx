import { useState, useEffect } from 'react';
import { Award, Download, X } from 'lucide-react';
import { getCertificates, issueCertificate } from '../../services/certificateService';
import { getMyEvents } from '../../services/eventService';
import { getEventVolunteers } from '../../services/applicationService';

const today = new Date().toISOString().split('T')[0];

const fieldClass =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-gray-50 ' +
  'outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all';

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ eventId: '', userId: '', date: today, hours: '' });
  const [issued, setIssued] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCertificates();
      setCerts(data);
    } catch (err) {
      setError('Could not load certificates from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCertificates(); }, []);

  const openModal = async () => {
    setShowModal(true);
    setSubmitError('');
    try {
      const data = await getMyEvents();
      setEvents(data);
    } catch (err) {
      setSubmitError('Could not load your events.');
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'eventId') {
      setForm((prev) => ({ ...prev, userId: '' }));
      setVolunteers([]);
      if (!value) return;
      setLoadingVolunteers(true);
      try {
        const data = await getEventVolunteers(value);
        setVolunteers(data);
      } catch (err) {
        setSubmitError('Could not load approved volunteers for this event.');
      } finally {
        setLoadingVolunteers(false);
      }
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const { certificate } = await issueCertificate({
        userId: form.userId,
        eventId: form.eventId,
        issueDate: form.date,
        hours: Number(form.hours),
      });
      await loadCertificates();
      setShowModal(false);
      setIssued(true);
      setTimeout(() => setIssued(false), 2500);
      setForm({ eventId: '', userId: '', date: today, hours: '' });
      setVolunteers([]);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to issue certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitError('');
    setForm({ eventId: '', userId: '', date: today, hours: '' });
    setVolunteers([]);
  };

  const thisMonthCount = certs.filter((c) => c.date?.slice(0, 7) === today.slice(0, 7)).length;
  const distinctEvents = new Set(certs.map((c) => c.eventId)).size;
  const distinctVolunteers = new Set(certs.map((c) => c.volunteerId)).size;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Certificates</h1>
        <p className="text-gray-500 text-md mt-0.5">Manage and issue volunteer certificates</p>
      </div>

      {issued && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-md font-medium">
          Certificate issued successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Issued',         value: certs.length,      color: 'from-cyan-400 to-blue-500' },
          { label: 'This Month',     value: thisMonthCount,    color: 'from-yellow-400 to-orange-400' },
          { label: 'Events',         value: distinctEvents,    color: 'from-blue-400 to-cyan-500' },
          { label: 'Volunteers',     value: distinctVolunteers,color: 'from-green-400 to-teal-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white`}>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-white/80 text-md font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Issued Certificates</h2>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-md font-semibold
              text-white bg-gradient-to-r from-cyan-400 to-blue-500
              hover:from-cyan-500 hover:to-blue-600 transition-all"
          >
            <Award className="w-4 h-4" /> Issue Certificate
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Volunteer', 'Event', 'Issue Date', 'Hours', 'Action'].map((h) => (
                  <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">Loading certificates…</td></tr>
              ) : certs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No certificates issued yet</td></tr>
              ) : certs.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                        <span className="text-cyan-600 text-xs font-bold">{c.volunteer?.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{c.volunteer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{c.event}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{c.date}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{c.hours}h</td>
                  <td className="px-5 py-3.5">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                      bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Issue Certificate</h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                {submitError}
              </div>
            )}

            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Event <span className="text-red-400">*</span>
                </label>
                <select name="eventId" value={form.eventId} onChange={handleChange} required className={fieldClass}>
                  <option value="">Select an event</option>
                  {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Volunteer <span className="text-red-400">*</span>
                </label>
                <select
                  name="userId" value={form.userId} onChange={handleChange} required
                  disabled={!form.eventId || loadingVolunteers}
                  className={fieldClass}
                >
                  <option value="">
                    {!form.eventId ? 'Select an event first' : loadingVolunteers ? 'Loading volunteers…' : volunteers.length === 0 ? 'No approved volunteers for this event' : 'Select a volunteer'}
                  </option>
                  {volunteers.map((v) => <option key={v.userId} value={v.userId}>{v.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">
                    Issue Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date" name="date" value={form.date} onChange={handleChange} required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">
                    Hours <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" name="hours" value={form.hours} onChange={handleChange}
                    required min="1" max="24" placeholder="e.g. 6"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm
                    bg-gradient-to-r from-cyan-400 to-blue-500
                    hover:from-cyan-500 hover:to-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Issuing…' : 'Issue Certificate'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-cyan-600 font-semibold text-sm
                    border border-cyan-200 hover:bg-cyan-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
