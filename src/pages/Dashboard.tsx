import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Crown, 
  Clock,
  Heart,
  BookOpen,
  Zap,
  AlertCircle,
  CheckCircle,
  User,
  BarChart3,
  PenTool,
  Smile,
  X,
  ChevronRight,
  Sparkles,
  Target,
  Activity,
  Eye,
  Edit3,
  Menu
} from 'lucide-react';
import useUser from '../contexts/useUser';
import { useChat } from '../contexts/ChatContext';
import SessionHistory from '../components/SessionHistory';
import { db, TherapySession, MoodLog, JournalEntry } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { initializePaystack } from '../utils/paystack';

// Affirmations and quotes for daily inspiration
const DAILY_AFFIRMATIONS = [
  "You're doing the best you can, and that's enough.",
  "Every feeling is valid. You're safe here.",
  "Let's take a breath together.",
  "Your mental health matters, and so do you.",
  "Progress isn't always linear, and that's okay.",
  "You have the strength to face whatever comes your way.",
  "It's okay to not be okay sometimes.",
  "You're worthy of love, care, and compassion.",
  "Small steps forward are still progress.",
  "You're not alone in thi\s journey.",
  "Your feelings are temporary, but your strength is permanent.",
  "Today is a new opportunity to be kind to yourself."
];

const Dashboard: React.FC = () => {
  // ... rest of the code remains exactly the same ...
};

export default Dashboard;