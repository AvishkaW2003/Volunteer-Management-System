import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applyToEvent } from '../../services/applicationService';
import { X, Calendar, MapPin, Users, Clock, CheckCircle, Award, Heart, Sparkles, Send } from 'lucide-react';
const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 ' +
  'placeholder-gray-400 transition bg-white';

const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';