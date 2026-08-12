import { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_LANGUAGE } from '../constants/languages';
import { CALL_STATUS } from '../constants/callStatus';

export { CALL_STATUS };

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const addMessage = useCallback((sender, text) => {
    if (!text || !text.trim()) return;
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender, // 'user' | 'ai' | 'system'
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const resetCall = useCallback(() => {
    setCallStatus(CALL_STATUS.IDLE);
    setMessages([]);
    setReport(null);
    setError(null);
  }, []);

  const value = {
    callStatus,
    setCallStatus,
    selectedLanguage,
    setSelectedLanguage,
    messages,
    addMessage,
    clearMessages,
    report,
    setReport,
    error,
    setError,
    clearError: () => setError(null),
    resetCall
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export default CallContext;
