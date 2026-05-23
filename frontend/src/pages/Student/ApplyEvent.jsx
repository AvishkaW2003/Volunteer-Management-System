import { ClipboardList, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const MOCK_APPLICATIONS = [
  { id: 1, event: 'Beach Cleanup Drive',    date: '2026-06-10', status: 'pending'  },
  { id: 2, event: 'Blood Donation Camp',    date: '2026-06-15', status: 'approved' },
  { id: 3, event: 'Tree Planting Marathon', date: '2026-06-20', status: 'rejected' },
];

const statusBadge = {
  pending:  { cls: 'bg-amber-100 text-amber-700',  icon: Clock,        label: 'Pending'  },
  approved: { cls: 'bg-green-100 text-green-700',  icon: CheckCircle,  label: 'Approved' },
  rejected: { cls: 'bg-red-100   text-red-500',    icon: ClipboardList, label: 'Rejected' },
};

const ApplyEvent = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <ClipboardList className="w-8 h-8 text-purple-500" /> My Applications
      </h1>
      <p className="text-gray-500 mt-1">Track the status of your volunteer applications</p>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Event', 'Date', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_APPLICATIONS.map(app => {
            const { cls, icon: Icon, label } = statusBadge[app.status];
            return (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800">{app.event}</td>
                <td className="px-5 py-3.5 text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {app.date}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                    <Icon className="w-3 h-3" /> {label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default ApplyEvent;
