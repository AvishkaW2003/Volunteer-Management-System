import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, Eye, X, Clock, Calendar, CheckCircle } from 'lucide-react';
import { getMyCertificates, downloadCertificatePdf } from '../../services/certificateService';