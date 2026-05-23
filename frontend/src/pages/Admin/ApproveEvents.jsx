import { CalendarCheck, CheckCircle, XCircle, Clock } from 'lucide-react';

const MOCK_EVENTS = [
  { id: 1, title: 'Beach Cleanup Drive',      organizer: 'Eco Club',       date: '2026-06-10', status: 'pending' },
  { id: 2, title: 'Blood Donation Camp',       organizer: 'Health Society', date: '2026-06-15', status: 'pending' },
  { id: 3, title: 'Tree Planting Marathon',    organizer: 'Green Team',     date: '2026-06-20', status: 'approved' },
  { id: 4, title: 'Food Distribution Drive',  organizer: 'Care Club',      date: '2026-06-25', status: 'rejected' },
];

const statusBadge = {
  pending:  { cls: 'bg-amber-100 text-amber-700',   icon: Clock,       label: 'Pending'  },
  approved: { cls: 'bg-green-100 text-green-700',   icon: CheckCircle, label: 'Approved' },
  rejected: { cls: 'bg-red-100 text-red-500',       icon: XCircle,     label: 'Rejected' },
};

const ApproveEvents = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <CalendarCheck className="w-8 h-8 text-indigo-500" /> Event Approvals
      </h1>
      <p className="text-gray-500 mt-1">Review and approve or reject submitted events</p>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Event', 'Organizer', 'Date', 'Status', 'Actions'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_EVENTS.map(ev => {
            const { cls, icon: Icon, label } = statusBadge[ev.status];
            return (
              <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800">{ev.title}</td>
                <td className="px-5 py-3.5 text-gray-500">{ev.organizer}</td>
                <td className="px-5 py-3.5 text-gray-500">{ev.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                    <Icon className="w-3 h-3" /> {label}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {ev.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors">Approve</button>
                      <button className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold transition-colors">Reject</button>
                    </div>
                  )}
                  {ev.status !== 'pending' && <span className="text-gray-300 text-xs">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default ApproveEvents;
