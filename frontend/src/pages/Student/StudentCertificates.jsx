import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, Eye, X, Clock, Calendar, CheckCircle } from 'lucide-react';
import { getMyCertificates, downloadCertificatePdf } from '../../services/certificateService';
const downloadCertificate = async (cert) => {
  try {
    const blobData = await downloadCertificatePdf(cert.id);
    const blob = new Blob([blobData], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `certificate-${cert.certificateId || cert.id}.pdf`;
    link.click();
  } catch (error) {
    console.error("Failed to download certificate PDF", error);
  }
};
/* ── Certificate Preview Modal ──────────────────────── */
const CertificateModal = ({ cert, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto bg-black/50 backdrop-blur-sm"
    onClick={e => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl animate-scaleUp">
      {/* Modal toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-600">Certificate Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCertificate(cert)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>