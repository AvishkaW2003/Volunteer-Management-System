import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applyToEvent } from '../../services/applicationService';
import { X, Calendar, MapPin, Users, Clock, CheckCircle, Award, Heart, Sparkles, Send } from 'lucide-react';