import { useState } from 'react';
import { Award, Download, X } from 'lucide-react';

const MOCK_CERTIFICATES = [
  { id: 1, volunteer: 'Nimasha Silva',   event: 'Tech Workshop for Youth', date: '2025-05-22', hours: 6 },
  { id: 2, volunteer: 'Sanduni Herath',  event: 'Tech Workshop for Youth', date: '2025-05-22', hours: 6 },
  { id: 3, volunteer: 'Kavya Raj',       event: 'Beach Cleanup Drive',     date: '2025-06-11', hours: 4 },
  { id: 4, volunteer: 'Kasun Mendis',    event: 'Art for Kids Workshop',   date: '2025-05-16', hours: 5 },
];

const VOLUNTEERS = [
  'Ashan Perera', 'Nimasha Silva', 'Dilshan Wickramasinghe', 'Kavya Raj',
  'Tharushi Jayawardena', 'Lahiru Fernando', 'Sanduni Herath', 'Kasun Mendis',
];

const EVENTS = [
  'Beach Cleanup Drive', 'Tech Workshop for Youth', 'Tree Planting Campaign',
  'Food Distribution', 'First Aid Training', 'Art for Kids Workshop',
];

const today = new Date().toISOString().split('T')[0];

const fieldClass =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-gray-50 ' +
  'outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all';

const Certificates = () => {
  const [certs, setCerts] = useState(MOCK_CERTIFICATES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ volunteer: '', event: '', date: today, hours: '' });
  const [issued, setIssued] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleIssue = (e) => {
    e.preventDefault();
    setCerts((prev) => [
      ...prev,
      { id: prev.length + 1, volunteer: form.volunteer, event: form.event, date: form.date, hours: Number(form.hours) },
    ]);
    setShowModal(false);
    setIssued(true);
    setTimeout(() => setIssued(false), 2500);
    setForm({ volunteer: '', event: '', date: today, hours: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ volunteer: '', event: '', date: today, hours: '' });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Certificates</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage and issue volunteer certificates</p>
      </div>

      {issued && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          Certificate issued successfully!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Issued',     value: certs.length, color: 'from-cyan-400 to-blue-500' },
          { label: 'Pending',    value: 3,             color: 'from-yellow-400 to-orange-400' },
          { label: 'Events',     value: 4,             color: 'from-blue-400 to-cyan-500' },
          { label: 'Volunteers', value: certs.length,  color: 'from-green-400 to-teal-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white`}>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-white/80 text-sm font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Issued Certificates</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
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
              {certs.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                        <span className="text-cyan-600 text-xs font-bold">{c.volunteer.charAt(0)}</span>
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

            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Volunteer <span className="text-red-400">*</span>
                </label>
                <select name="volunteer" value={form.volunteer} onChange={handleChange} required className={fieldClass}>
                  <option value="">Select a volunteer</option>
                  {VOLUNTEERS.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Event <span className="text-red-400">*</span>
                </label>
                <select name="event" value={form.event} onChange={handleChange} required className={fieldClass}>
                  <option value="">Select an event</option>
                  {EVENTS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
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
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm
                    bg-gradient-to-r from-cyan-400 to-blue-500
                    hover:from-cyan-500 hover:to-blue-600 transition-all"
                >
                  Issue Certificate
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
