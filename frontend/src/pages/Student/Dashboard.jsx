import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Award, Clock, MapPin, Download, Eye, X } from 'lucide-react';
import { getStudentDashboard } from '../../services/userService';
import { downloadCertificatePdf } from '../../services/certificateService';

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