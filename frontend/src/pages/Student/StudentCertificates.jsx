import { useState } from 'react';
import { Award, Download, Eye, X, Clock, Star, Calendar } from 'lucide-react';

const MOCK_CERTIFICATES = [
  {
    id: 1,
    event: 'Beach Cleanup Drive',
    organizer: 'Eco Club',
    volunteerName: 'Alex Johnson',
    completedOn: 'Apr 15, 2026',
    hours: 6,
    reputationPoints: 80,
  },
  {
    id: 2,
    event: 'Community Garden Day',
    organizer: 'Green Team',
    volunteerName: 'Alex Johnson',
    completedOn: 'Mar 10, 2026',
    hours: 4,
    reputationPoints: 70,
  },
  {
    id: 3,
    event: 'Youth Tutoring Program',
    organizer: 'Education First',
    volunteerName: 'Alex Johnson',
    completedOn: 'Feb 20, 2026',
    hours: 8,
    reputationPoints: 100,
  },
  {
    id: 4,
    event: 'Food Bank Volunteering',
    organizer: 'Care Club',
    volunteerName: 'Alex Johnson',
    completedOn: 'Jan 15, 2026',
    hours: 5,
    reputationPoints: 60,
  },
];

/* ── Download: open new window + print ─────────────── */
const downloadCertificate = cert => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Certificate — ${cert.event}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f1f5f9; display: flex; align-items: center;
           justify-content: center; min-height: 100vh;
           font-family: 'Georgia', 'Times New Roman', serif; }
    .frame { padding: 6px;
             background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
             border-radius: 20px; width: 780px; }
    .cert  { background: #fff; border-radius: 15px; padding: 56px 64px; text-align: center; }
    .logo-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px; }
    .logo-circle { width: 48px; height: 48px; border-radius: 12px;
                   background: linear-gradient(135deg,#60a5fa,#a855f7);
                   display:flex;align-items:center;justify-content:center;
                   color:#fff;font-size:18px;font-weight:900;letter-spacing:-1px; }
    .org-name { font-size: 22px; font-weight: 800; color: #1e1b4b;
                font-family: 'Arial', sans-serif; }
    .divider  { height: 3px; border-radius: 2px;
                background: linear-gradient(90deg,#60a5fa,#a855f7);
                margin: 0 auto 32px; width: 80px; }
    .cert-title { font-size: 13px; letter-spacing: 5px; text-transform: uppercase;
                  color: #7c3aed; font-family: 'Arial', sans-serif;
                  font-weight: 700; margin-bottom: 20px; }
    .certifies  { font-size: 15px; color: #6b7280; margin-bottom: 12px; }
    .name  { font-size: 38px; color: #1e1b4b; font-style: italic;
             font-weight: 700; margin-bottom: 14px; letter-spacing: 1px; }
    .desc  { font-size: 15px; color: #6b7280; margin-bottom: 12px; }
    .event { font-size: 26px; font-weight: 800; color: #4f46e5;
             font-family: 'Arial', sans-serif; margin-bottom: 8px; }
    .org   { font-size: 14px; color: #6b7280; margin-bottom: 36px; }
    .stats { display: flex; justify-content: center; gap: 32px; margin-bottom: 40px; }
    .stat  { background: #f5f3ff; border-radius: 14px;
             padding: 18px 28px; min-width: 120px; }
    .stat-val  { font-size: 26px; font-weight: 800; color: #7c3aed;
                 font-family: 'Arial', sans-serif; }
    .stat-lbl  { font-size: 11px; color: #9ca3af; text-transform: uppercase;
                 letter-spacing: 1px; margin-top: 4px; font-family: 'Arial', sans-serif; }
    .footer-divider { border-top: 1px solid #e5e7eb; padding-top: 28px;
                      display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-line  { border-top: 2px solid #d1d5db; padding-top: 8px; width: 180px;
                 font-size: 12px; color: #9ca3af; text-align: center;
                 font-family: 'Arial', sans-serif; }
    @media print { body { background: white; }
                   .frame { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="frame">
    <div class="cert">
      <div class="logo-row">
        <div class="logo-circle">VH</div>
        <span class="org-name">VolunteerHub</span>
      </div>
      <div class="divider"></div>
      <div class="cert-title">Certificate of Participation</div>
      <p class="certifies">This certifies that</p>
      <p class="name">${cert.volunteerName}</p>
      <p class="desc">has successfully completed volunteer service at</p>
      <p class="event">${cert.event}</p>
      <p class="org">Organized by <strong>${cert.organizer}</strong></p>
      <div class="stats">
        <div class="stat">
          <div class="stat-val">${cert.hours}h</div>
          <div class="stat-lbl">Volunteer Hours</div>
        </div>
        <div class="stat">
          <div class="stat-val">${cert.reputationPoints}</div>
          <div class="stat-lbl">Reputation Points</div>
        </div>
        <div class="stat">
          <div class="stat-val">${cert.completedOn}</div>
          <div class="stat-lbl">Completed On</div>
        </div>
      </div>
      <div class="footer-divider">
        <div class="sig-line">Authorized Signature</div>
        <div class="sig-line">VolunteerHub Administration</div>
      </div>
    </div>
  </div>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
};

/* ── Certificate Preview Modal ──────────────────────── */
const CertificateModal = ({ cert, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto bg-black/50 backdrop-blur-sm"
    onClick={e => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl">

      {/* Modal toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-600">Certificate Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCertificate(cert)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-blue-400 to-purple-500 text-white
              hover:from-blue-500 hover:to-purple-600 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Certificate body */}
      <div className="p-6">
        <div className="p-1.5 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500">
          <div className="px-10 py-10 text-center bg-white rounded-xl">

            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500">
                <span className="text-sm font-black text-white">VH</span>
              </div>
              <span className="text-xl font-extrabold text-gray-800">VolunteerHub</span>
            </div>

            {/* Accent line */}
            <div className="w-16 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />

            {/* Title */}
            <p className="text-xs font-bold uppercase tracking-[4px] text-purple-500 mb-5">
              Certificate of Participation
            </p>

            <p className="mb-2 text-sm text-gray-400">This certifies that</p>
            <p className="mb-3 text-3xl italic font-bold text-gray-800">{cert.volunteerName}</p>
            <p className="mb-2 text-sm text-gray-400">has successfully completed volunteer service at</p>
            <p className="mb-1 text-xl font-extrabold text-purple-600">{cert.event}</p>
            <p className="text-sm text-gray-400 mb-7">
              Organized by <span className="font-semibold text-gray-600">{cert.organizer}</span>
            </p>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Clock,    value: `${cert.hours}h`, label: 'Volunteer Hours'    },
                { icon: Star,     value: cert.reputationPoints, label: 'Reputation Points' },
                { icon: Calendar, value: cert.completedOn, label: 'Completed On' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="px-2 py-3 bg-purple-50 rounded-xl">
                  <Icon className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                  <p className="text-lg font-extrabold text-purple-600">{value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between pt-5 border-t border-gray-100">
              <div className="text-center">
                <div className="w-32 border-t border-gray-300 pt-1.5 mx-auto">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Authorized Signature</p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-40 border-t border-gray-300 pt-1.5 mx-auto">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">VolunteerHub Administration</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Main Page ──────────────────────────────────────── */
const StudentCertificates = () => {
  const [viewing, setViewing] = useState(null);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
          <Award className="w-8 h-8 text-purple-500" /> My Certificates
        </h1>
        <p className="mt-1 text-gray-500">Download your volunteering certificates</p>
      </div>

      {/* Certificate Cards — 2-column grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {MOCK_CERTIFICATES.map(cert => (
          <div
            key={cert.id}
            className="overflow-hidden transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
          >
            {/* Gradient top strip */}
            <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500" />

            <div className="flex items-start gap-4 p-5">
              {/* Award icon */}
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50">
                <Award className="w-6 h-6 text-purple-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-800 truncate">{cert.event}</h3>
                <p className="text-sm text-gray-400 mt-0.5">Completed on {cert.completedOn}</p>
                <p className="text-sm text-gray-400">{cert.hours} hours volunteered</p>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => setViewing(cert)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold
                      bg-gradient-to-r from-blue-400 to-purple-500 text-white
                      hover:from-blue-500 hover:to-purple-600 transition-all shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    onClick={() => downloadCertificate(cert)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold
                      border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {viewing && (
        <CertificateModal cert={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
};

export default StudentCertificates;
