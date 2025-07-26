import React, { useState } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import PanelChatAssistant from './PanelChatAssistant';

const GlobalChatPanel: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const togglePanel = () => {
    setIsPanelExpanded(!isPanelExpanded);
    if (!isPanelExpanded) {
      setIsChatOpen(true);
    }
  };

  const handleChatToggle = () => {
    if (isChatOpen && isPanelExpanded) {
      setIsPanelExpanded(false);
      setTimeout(() => setIsChatOpen(false), 150);
    } else {
      setIsChatOpen(true);
      setIsPanelExpanded(true);
    }
  };

  return (
    <>
      {/* Floating Chat Button - Only visible when panel is collapsed */}
      {!isPanelExpanded && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={togglePanel}
            className="flex items-center space-x-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Open AI Assistant"
          >
            {/* Chat bubble icon */}
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            {/* Text */}
            <span className="text-sm font-semibold whitespace-nowrap">AI Assistant</span>

            {/* Arrow indicator */}
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Chat Panel */}
      <div
        className={`fixed bottom-4 right-4 bg-gradient-to-br from-white via-gray-50/90 to-green-50/30 border border-gray-200/50 shadow-2xl backdrop-blur-lg transition-all duration-300 ease-out z-50 rounded-3xl overflow-hidden ${
          isPanelExpanded ? 'w-[400px] h-[600px]' : 'w-0 h-0'
        }`}
        style={{
          transformOrigin: 'bottom right',
          boxShadow: isPanelExpanded
            ? '0 25px 50px rgba(0, 0, 0, 0.15), 0 15px 35px rgba(34, 197, 94, 0.2), 0 5px 15px rgba(34, 197, 94, 0.3)'
            : 'none',
          background: isPanelExpanded
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(236, 253, 245, 0.8) 100%)'
            : 'transparent'
        }}
      >
        {/* Panel Header */}
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 text-white p-5 flex items-center justify-between rounded-t-3xl">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-11 9-20 20-20v40c-11 0-20-9-20-20z'/%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
            <div className="absolute top-2 left-4 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-4 right-8 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-3 left-8 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
            <div>
              <h3 className="font-black text-xl bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">AgroGuardian</h3>
              <p className="text-green-100 text-sm font-medium opacity-95 flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                <span>AI Assistant Online</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPanelExpanded(false);
              setTimeout(() => setIsChatOpen(false), 150);
            }}
            className="relative text-white hover:bg-white/25 p-3 rounded-2xl transition-all duration-300 group backdrop-blur-md border border-white/20 hover:border-white/40"
            aria-label="Close chat panel"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 group-hover:from-white/10 group-hover:to-white/30 rounded-2xl transition-all duration-300"></div>
          </button>
        </div>

        {/* Chat Content */}
        <div className="h-[calc(600px-80px)] overflow-hidden relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-50/20 pointer-events-none z-10"></div>

          {isChatOpen && (
            <div className="h-full relative">
              <PanelChatAssistant />
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile responsiveness */}
      {isPanelExpanded && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-green-900/20 to-transparent z-40 md:hidden backdrop-blur-md transition-all duration-300"
          onClick={() => {
            setIsPanelExpanded(false);
            setTimeout(() => setIsChatOpen(false), 150);
          }}
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        />
      )}
    </>
  );
};

export default GlobalChatPanel;
