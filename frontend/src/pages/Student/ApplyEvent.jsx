import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, XCircle, ClipboardList, X, User, Mail, Phone, Tag, MessageSquare, BookOpen, Calendar, Building2 } from 'lucide-react';
import { getMyApplications } from '../../services/applicationService';