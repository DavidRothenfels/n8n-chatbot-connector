import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileQuestion, LogOut, Upload, Image, BarChart3, PaintBucket, FileText, Mail, FileCheck } from "lucide-react";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem("n8nChatAuth");
    if (authData) {
      try {
        const [storedUsername, storedPassword] = atob(authData).split(":");
        setUsername(storedUsername);
        setPassword(storedPassword);
        setIsAuthenticated(true);
        
        setTimeout(() => {
          initializeChat(storedUsername, storedPassword);
        }, 1000);
      } catch (error) {
        console.error("Fehler bei der Wiederherstellung der Authentifizierung:", error);
        localStorage.removeItem("n8nChatAuth");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!username.trim() || !password.trim()) {
        toast.error("Bitte geben Sie Benutzernamen und Passwort ein");
        setIsLoading(false);
        return;
      }
      
      if (username && password) {
        localStorage.setItem("n8nChatAuth", btoa(`${username}:${password}`));
        setIsAuthenticated(true);
        toast.success("Anmeldung erfolgreich");
        
        setTimeout(() => {
          initializeChat(username, password);
        }, 1000);
      } else {
        toast.error("Ungültige Anmeldedaten");
      }
    } catch (error) {
      console.error("Anmeldefehler:", error);
      toast.error("Bei der Anmeldung ist ein Fehler aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = (username: string, password: string) => {
    if (chatInitialized) {
      console.log("Chat bereits initialisiert, überspringe...");
      return;
    }
    
    console.log("Initialisiere Chat mit Anmeldedaten...");
    
    const oldScript = document.getElementById("n8n-chat-script");
    if (oldScript) {
      oldScript.remove();
    }
    
    const chatElements = document.querySelectorAll(".n8n-chat");
    chatElements.forEach(el => el.remove());
    
    const authHeader = `Basic ${btoa(username + ":" + password)}`;
    
    const script = document.createElement("script");
    script.id = "n8n-chat-script";
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      
      try {
        const chatInstance = createChat({
          webhookUrl: '',
          webhookConfig: {
            method: 'POST',
            headers: {
              'Authorization': '${authHeader}',
              'Content-Type': 'application/json'
            }
          },
          target: '#n8n-chat-container',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          metadata: {},
          showWelcomeScreen: false,
          defaultLanguage: 'de',
          initialMessages: [
            'Hallo! Wie kann ich Ihnen heute helfen?'
          ],
          i18n: {
            de: {
              title: 'Hallo!',
              subtitle: "Wie kann ich Ihnen heute helfen?",
              footer: '',
              getStarted: 'Neue Unterhaltung',
              inputPlaceholder: 'Stellen Sie Ihre Frage..',
            },
          },
          debug: true
        });
        
        setTimeout(() => {
          const chatToggle = document.querySelector('.n8n-chat__toggle');
          const chatWindow = document.querySelector('.n8n-chat__window');
          
          if (chatToggle) {
            chatToggle.setAttribute('style', 'visibility: visible !important; opacity: 1 !important; display: block !important;');
          }
          
          if (chatWindow) {
            chatWindow.setAttribute('style', 'z-index: 10000 !important;');
          }
          
          console.log('Chat-UI-Elemente für bessere Sichtbarkeit angepasst');
        }, 2000);
        
        console.log('Chat erfolgreich initialisiert');
      } catch (error) {
        console.error('Fehler bei der Chat-Initialisierung:', error);
      }
    `;
    
    document.body.appendChild(script);
    console.log("Chat-Script zum DOM hinzugefügt");
    setChatInitialized(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("n8nChatAuth");
    setIsAuthenticated(false);
    setChatInitialized(false);
    
    const chatElements = document.querySelectorAll(".n8n-chat");
    chatElements.forEach(el => el.remove());
    
    toast.info("Sie wurden abgemeldet");
    
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <a 
          href="#" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-blue-700 border border-blue-100"
        >
          <BookOpen size={20} />
          Handbücher
        </a>
      </div>
      
      {isAuthenticated && (
        <div className="absolute top-4 left-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-red-600 border border-red-100"
          >
            <LogOut size={18} />
            Abmelden
          </button>
        </div>
      )}

      <AnimatePresence>
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-8 rounded-xl shadow-lg"
            >
              <h1 className="text-3xl font-bold mb-2">Willkommen</h1>
              <p className="text-blue-100">Ihr Fachspezifischer Wissens-Chatbot</p>
            </motion.div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-white"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-xs uppercase tracking-widest text-blue-500 font-medium"
                >
                  Anmeldung erforderlich
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-2xl font-medium mt-2"
                >
                  Wissens-Chatbot Login
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-gray-500 mt-2"
                >
                  Bitte melden Sie sich an, um mit dem Assistenten zu chatten
                </motion.p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Benutzername
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Geben Sie Ihren Benutzernamen ein"
                    required
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Passwort
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Geben Sie Ihr Passwort ein"
                    required
                  />
                </motion.div>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 relative overflow-hidden group"
                >
                  <span className={`absolute inset-0 w-0 bg-blue-800 transition-all duration-[400ms] ease-out group-hover:w-full ${isLoading ? 'w-full' : ''}`}></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Anmelden...
                      </>
                    ) : (
                      <>
                        Anmelden
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform group-hover:translate-x-1"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl text-center"
          >
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 mb-6"
              >
                Willkommen bei Ihrem Fachspezifischen Wissens-Chatbot
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-left grid md:grid-cols-2 gap-6 mt-8"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-medium text-blue-700 mb-4 flex items-center gap-2">
                    <FileQuestion size={22} />
                    Produktbeschreibung
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Chatbot für Fachwissen</h3>
                      <p className="text-gray-600">Ein spezialisierter Chatbot, der fachspezifisches Wissen vermittelt. Verfügbar als Webseite mit Login oder zur Integration in Ihre eigene Webseite.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Vielseitige Anwendungen</h3>
                      <p className="text-gray-600">Ideal für Handbücher, FAQs, Anleitungen und ähnliche Dokumentationen. Verarbeitet Texte, Bilder und Prozessabläufe für eine umfassende Wissensvermittlung.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Bildschirmfoto-Analyse</h3>
                      <p className="text-gray-600">Nutzer können eigene Bildschirmfotos übermitteln und dazu Fragen stellen. Die KI kann Fotos von Anwendungen verarbeiten und spezifische Handlungsanweisungen geben.</p>
                      <div className="mt-2 flex items-center gap-2 text-blue-600">
                        <Upload size={16} />
                        <Image size={16} />
                        <span className="text-sm">Bildanalyse und Schritt-für-Schritt-Anleitung</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-medium text-blue-700 mb-4 flex items-center gap-2">
                    <BookOpen size={22} />
                    Funktionen & Vorteile
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <BarChart3 size={18} />
                        Datenanalyse und Statistiken
                      </h3>
                      <p className="text-gray-600">Detaillierte Auswertungen zu häufigsten Problemursachen und am meisten gesuchten Themen ermöglichen kontinuierliche Verbesserung der Wissensbasis.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <PaintBucket size={18} />
                        Anpassbare Gestaltung
                      </h3>
                      <p className="text-gray-600">Farben und Texte können an Ihre Corporate Identity angepasst werden, um eine nahtlose Integration in Ihre bestehende digitale Präsenz zu gewährleisten.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <FileText size={18} />
                        Integration weiterer Funktionen
                      </h3>
                      <p className="text-gray-600">Die Funktionalitäten des Chatbot können erweitert werden. Es können z.B. Emails mit Hinweisen ausgelöst oder Dokumente erstellt werden.</p>
                      <div className="mt-2 flex items-center gap-2 text-blue-600">
                        <Mail size={16} />
                        <FileCheck size={16} />
                        <span className="text-sm">Automatisierte Prozesse und Dokumentenerstellung</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div id="n8n-chat-container" className="fixed bottom-0 right-0 w-16 h-16 z-[9999]"></div>
    </div>
  );
};

export default Index;
