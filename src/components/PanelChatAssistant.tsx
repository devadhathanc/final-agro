import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User,
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { chatWithLLM } from '../utils/llmService';
import { storage } from '../utils/storage';
import { ChatMessage, ChatSession, DetectionResult } from '../types';

interface PanelChatAssistantProps {
  detectionResult?: DetectionResult;
}

const PanelChatAssistant: React.FC<PanelChatAssistantProps> = ({ 
  detectionResult
}) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId] = useState(() => Date.now().toString() + Math.random().toString(36).substr(2, 9));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      // Send welcome message when component mounts
      const welcomeMessage = getWelcomeMessage();
      setMessages([welcomeMessage]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (): ChatMessage => {
    const welcomeTexts = {
      en: detectionResult 
        ? `Hello! I can help you understand the detected ${detectionResult.disease} in your ${detectionResult.crop} and provide treatment advice. What would you like to know?`
        : "Hello! I'm your farming assistant. Ask me about crop diseases, pest control, fertilizers, or any farming questions.",
      hi: detectionResult
        ? `नमस्ते! मैं आपके ${detectionResult.crop} में पाई गई ${detectionResult.disease} को समझने और इसके इलाज में मदद कर सकता हूँ। आप क्या जानना चाहते हैं?`
        : "नमस्ते! मैं आपका कृषि सहायक हूँ। फसल की बीमारियों, कीट नियंत्रण, उर्वरक या किसी ��ी कृषि प्रश्न के बारे में पूछें।",
      ta: detectionResult
        ? `வணக்கம்! உங்கள் ${detectionResult.crop} இல் கண்டறியப்பட்ட ${detectionResult.disease} பற்றி புரிந்துகொள்ளவும் சிகிச்சை ஆலோசனை வழங்கவும் என்னால் உதவ முடியும். நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?`
        : "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். பயிர் நோய்கள், பூச்சி கட்டுப்பாடு, உரங்கள் அல்லது எந்த விவசாய கேள்விகளையும் கேளுங்கள்।",
      bn: detectionResult
        ? `নমস্কার! আমি আপনার ${detectionResult.crop} এ সনাক্ত করা ${detectionResult.disease} বুঝতে এবং চিকিৎসার পরামর্শ দিতে সাহায্য করতে পারি। আপনি কী জানতে চান?`
        : "নমস্কার! আমি আপনার কৃষি সহায়ক। ফসলের রোগ, কীটপতঙ্গ নিয়ন্ত্রণ, সার বা যেকোনো কৃষি প্রশ্ন সম্পর্কে জিজ্ঞাসা করুন।"
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: welcomeTexts[language as keyof typeof welcomeTexts] || welcomeTexts.en,
      timestamp: new Date().toISOString(),
      language
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      language
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatWithLLM({
        message: userMessage.content,
        language,
        context: detectionResult ? {
          crop: detectionResult.crop,
          disease: detectionResult.disease,
          detectionResult
        } : undefined,
        chatHistory: messages.slice(-5) // Send last 5 messages for context
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        language
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save chat session
      const session: ChatSession = {
        id: sessionId,
        messages: finalMessages,
        context: detectionResult ? {
          crop: detectionResult.crop,
          disease: detectionResult.disease,
          detectionResult
        } : undefined,
        createdAt: new Date().toISOString()
      };
      storage.saveChatSession(session);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        language
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 
                                  language === 'ta' ? 'ta-IN' : 
                                  language === 'bn' ? 'bn-IN' : 'en-IN';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 
                      language === 'ta' ? 'ta-IN' : 
                      language === 'bn' ? 'bn-IN' : 'en-IN';
      utterance.rate = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-transparent to-green-50/30">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b981 transparent' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-green-200/50 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <div className="relative">
                    <Bot className="w-5 h-5 mt-1 flex-shrink-0 text-green-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                {message.role === 'user' && (
                  <User className="w-5 h-5 mt-1 flex-shrink-0 text-white/90" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                    {message.content}
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                        className="text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-green-50"
                        title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200/50 shadow-lg p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="w-5 h-5 text-green-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                <span className="text-sm font-medium">AI is thinking...</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gradient-to-r from-white/95 to-green-50/80 backdrop-blur-md border-t border-green-200/30 rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={language === 'hi' ? 'अपना प्रश्न लिखें...' :
                          language === 'ta' ? 'உங்கள் கேள்வியை எழுதுங்கள்...' :
                          language === 'bn' ? 'আপনার প্রশ্ন লিখুন...' :
                          'Ask me anything about farming...'}
              className="w-full p-4 pr-14 border border-green-300/50 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200/50 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm shadow-inner placeholder-gray-500 hover:shadow-md"
              disabled={isLoading}
            />
            <button
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 p-1 rounded-lg ${
                isListening
                  ? 'text-red-600 hover:text-red-700 bg-red-50 animate-pulse'
                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50 hover:scale-110'
              }`}
              title={isListening ? 'Stop voice input' : 'Voice input'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              !inputMessage.trim() || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner'
                : 'bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl shadow-green-500/25'
            }`}
            title="Send message"
          >
            <Send className={`w-5 h-5 transition-transform duration-300 ${
              !inputMessage.trim() || isLoading ? '' : 'group-hover:translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelChatAssistant;
