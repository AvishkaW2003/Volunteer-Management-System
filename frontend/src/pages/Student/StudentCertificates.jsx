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