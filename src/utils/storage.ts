import { DetectionResult, AdminCase } from '../types';
import { ChatSession, ChatMessage } from '../types';

const STORAGE_KEYS = {
  DETECTION_HISTORY: 'agro_detection_history',
  ADMIN_CASES: 'agro_admin_cases',
  USER_PREFERENCES: 'agro_user_preferences',
  CHAT_SESSIONS: 'agro_chat_sessions',
};

export const storage = {
  // Detection History
  saveDetection: (result: DetectionResult): void => {
    const history = storage.getDetectionHistory();
    const updated = [result, ...history.slice(0, 49)]; // Keep last 50
    localStorage.setItem(STORAGE_KEYS.DETECTION_HISTORY, JSON.stringify(updated));
    
    // Also save to admin cases
    const adminCase: AdminCase = {
      id: result.id,
      crop: result.crop,
      disease: result.disease,
      date: result.timestamp,
      language: result.language,
      confidence: result.confidence,
    };
    storage.saveAdminCase(adminCase);
  },

  getDetectionHistory: (): DetectionResult[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.DETECTION_HISTORY);
    return stored ? JSON.parse(stored) : [];
  },

  // Alias methods for dashboard compatibility
  getDetections: (): DetectionResult[] => {
    return storage.getDetectionHistory();
  },

  saveDetections: (detections: DetectionResult[]): void => {
    localStorage.setItem(STORAGE_KEYS.DETECTION_HISTORY, JSON.stringify(detections));
  },

  // Admin Cases
  saveAdminCase: (adminCase: AdminCase): void => {
    const cases = storage.getAdminCases();
    const updated = [adminCase, ...cases];
    localStorage.setItem(STORAGE_KEYS.ADMIN_CASES, JSON.stringify(updated));
  },

  getAdminCases: (): AdminCase[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_CASES);
    return stored ? JSON.parse(stored) : [];
  },

  // User Preferences
  savePreferences: (preferences: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },

  getPreferences: (): any => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : {};
  },

  // Export data as CSV
  exportAdminCasesToCSV: (): string => {
    const cases = storage.getAdminCases();
    const headers = ['ID', 'Crop', 'Disease', 'Date', 'Language', 'Confidence'];
    const csvContent = [
      headers.join(','),
      ...cases.map(case_ => [
        case_.id,
        case_.crop,
        case_.disease,
        case_.date,
        case_.language,
        case_.confidence
      ].join(','))
    ].join('\n');
    
    return csvContent;
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Chat Sessions
  saveChatSession: (session: ChatSession): void => {
    const sessions = storage.getChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    
    // Keep only last 20 sessions
    const updated = sessions.slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(updated));
  },

  getChatSessions: (): ChatSession[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    return stored ? JSON.parse(stored) : [];
  },

  getChatSession: (sessionId: string): ChatSession | null => {
    const sessions = storage.getChatSessions();
    return sessions.find(s => s.id === sessionId) || null;
  },

  addMessageToSession: (sessionId: string, message: ChatMessage): void => {
    const session = storage.getChatSession(sessionId);
    if (session) {
      session.messages.push(message);
      storage.saveChatSession(session);
    }
  }
};
