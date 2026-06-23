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
const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingCert, setViewingCert] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await getStudentDashboard();
        setData(res);
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
        setData({
          joinedEventsCount: 0,
          reputationPoints: 0,
          certificatesCount: 0,
          volunteerHours: 0,
          joinedEvents: [],
          certificates: [],
          hoursHistory: [],
          reputationActivities: [],
          rankLevel: 'Beginner Volunteer'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Events Joined',       value: data.joinedEventsCount, icon: Calendar },
    { label: 'Reputation Points',   value: data.reputationPoints, icon: Trophy   },
    { label: 'Certificates Earned', value: data.certificatesCount,  icon: Award    },
    { label: 'Volunteer Hours',     value: data.volunteerHours,  icon: Clock    },
  ];