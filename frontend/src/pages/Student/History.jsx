import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle } from 'lucide-react';
import { getMyAttendance } from '../../services/attendanceService';

const History = () => {