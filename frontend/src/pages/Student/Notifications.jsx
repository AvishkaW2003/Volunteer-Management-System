import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Star, Award, UserCheck, Clock, CheckCircle2, XCircle, ClipboardList } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';