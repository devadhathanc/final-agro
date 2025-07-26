export interface DetectionResult {
  id: string;
  crop: string;
  disease: string;
  remedy: string;
  identification: string;
  preventiveMeasures: string[];
  timestamp: string;
  imageUrl?: string;
  Ref_images?: {
    healthy?: string;
    early?: string;
    moderate?: string;
    severe?: string;
  };
  location : string;
  language: string;
  confidence?: number;
}

export interface CropType {
  id: string;
  name: string;
  icon: string;
}

export interface AdminCase {
  id: string;
  crop: string;
  disease: string;
  date: string;
  language: string;
  confidence: number;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context?: {
    crop?: string;
    disease?: string;
    detectionResult?: DetectionResult;
  };
  createdAt: string;
}