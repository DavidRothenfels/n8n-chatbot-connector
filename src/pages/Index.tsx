import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Calendar, Headphones } from "lucide-react";

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
    
    // Remove old script and chat elements
    const oldScript = document.getElementById("n8n-chat-script");
    if (oldScript) {
      oldScript.remove();
    }
    
    const chatElements = document.querySelectorAll(".n8n-chat");
    chatElements.forEach(el => el.remove());
    
    // Add official n8n chat CSS first
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(linkElement);
    
    // Add our Disponic theme CSS link (rather than inline styles)
    // This ensures our theme CSS is loaded after the default styles
    const themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.href = "/src/n8n-chat-theme.css";
    themeLink.id = "n8n-chat-theme-css";
    document.head.appendChild(themeLink);
    
    // Basic auth header
    const authHeader = `Basic ${btoa(username + ":" + password)}`;
    
    // Create chat container if it doesn't exist
    let chatContainer = document.getElementById("n8n-chat");
    if (!chatContainer) {
      chatContainer = document.createElement("div");
      chatContainer.id = "n8n-chat";
      document.body.appendChild(chatContainer);
    }
    
    // Create MutationObserver to ensure CSS is properly applied
    const createStyleObserver = () => {
      // Function to apply Disponic colors to n8n chat elements
      const ensureStyles = () => {
        console.log("Ensuring Disponic styles are applied to chat elements");
        
        // Check if our theme CSS is loaded, if not, reload it
        if (!document.getElementById('n8n-chat-theme-css')) {
          const themeLink = document.createElement("link");
          themeLink.rel = "stylesheet";
          themeLink.href = "/src/n8n-chat-theme.css";
          themeLink.id = "n8n-chat-theme-css";
          document.head.appendChild(themeLink);
        }
        
        // Add inline styles as a final fallback
        const chatElements = document.querySelectorAll(".n8n-chat");
        if (chatElements.length > 0) {
          // Apply CSS variables directly to the chat container
          chatElements.forEach(el => {
            const element = el as HTMLElement;
            element.style.setProperty('--chat--color-primary', '#f9b135', 'important');
            element.style.setProperty('--chat--color-primary-shade-50', '#fac25f', 'important');
            element.style.setProperty('--chat--color-primary-shade-100', '#fbd388', 'important');
            element.style.setProperty('--chat--color-secondary', '#3a3a3a', 'important');
            element.style.setProperty('--chat--color-white', '#ffffff', 'important');
            element.style.setProperty('--chat--color-light', '#feeccd', 'important');
            element.style.setProperty('--chat--header--background', '#f9b135', 'important');
            element.style.setProperty('--chat--header--color', '#3a3a3a', 'important');
            element.style.setProperty('--chat--message--bot--background', '#feeccd', 'important');
            element.style.setProperty('--chat--message--bot--color', '#3a3a3a', 'important');
            element.style.setProperty('--chat--message--user--background', '#3a3a3a', 'important');
            element.style.setProperty('--chat--message--user--color', '#ffffff', 'important');
            element.style.setProperty('--chat--toggle--background', '#f9b135', 'important');
            element.style.setProperty('--chat--toggle--hover--background', '#fac25f', 'important');
            element.style.setProperty('--chat--toggle--active--background', '#fbd388', 'important');
            element.style.setProperty('--chat--toggle--color', '#3a3a3a', 'important');
          });
        }
      };
      
      // Create observer to watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            if (document.querySelector('.n8n-chat')) {
              ensureStyles();
            }
          }
        }
      });
      
      // Start observing DOM changes
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Apply styles initially
      ensureStyles();
      
      // Keep checking for changes every second for 10 seconds
      let attempts = 0;
      const interval = setInterval(() => {
        ensureStyles();
        attempts++;
        if (attempts >= 10) {
          clearInterval(interval);
        }
      }, 1000);
      
      return observer;
    };
    
    const script = document.createElement("script");
    script.id = "n8n-chat-script";
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      
      try {
        // Make sure our theme CSS is loaded
        if (!document.getElementById('n8n-chat-theme-css')) {
          const themeLink = document.createElement("link");
          themeLink.rel = "stylesheet";
          themeLink.href = "/src/n8n-chat-theme.css";
          themeLink.id = "n8n-chat-theme-css";
          document.head.appendChild(themeLink);
        }
        
        const chatInstance = createChat({
          // Use the complete webhook URL
          webhookUrl: 'https://wmf-bite-n8n.rcs.relyon.de/webhook/a889d2ae-2159-402f-b326-5f61e90f602e/chat',
          webhookConfig: {
            method: 'POST',
            headers: {
              'Authorization': '${authHeader}',
              'Content-Type': 'application/json'
            }
          },
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          metadata: {},
          showWelcomeScreen: false,
          defaultLanguage: 'de',
          initialMessages: [
            'Hallo! Wie kann ich Ihnen heute mit DISPONIC helfen?'
          ],
          theme: {
            colors: {
              primary: '#f9b135',
              'primary-hover': '#fac25f',
              'primary-active': '#fbd388',
              secondary: '#3a3a3a',
              white: '#ffffff',
              botMessage: '#feeccd',
              botMessageText: '#3a3a3a',
              userMessage: '#3a3a3a',
              userMessageText: '#ffffff'
            }
          },
          i18n: {
            de: {
              title: 'DISPONIC Handbuch',
              subtitle: "Wie kann ich Ihnen heute helfen?",
              footer: '',
              getStarted: 'Neue Unterhaltung',
              inputPlaceholder: 'Stellen Sie Ihre Frage zu DISPONIC...',
            },
            en: {
              title: 'DISPONIC Manual',
              subtitle: "How can I help you today?",
              footer: '',
              getStarted: 'New Conversation',
              inputPlaceholder: 'Ask your question about DISPONIC...',
            }
          },
          debug: false
        });
        
        window.chatInstance = chatInstance;
        console.log('Chat erfolgreich initialisiert');
      } catch (error) {
        console.error('Fehler bei der Chat-Initialisierung:', error);
      }
    `;
    
    document.body.appendChild(script);
    console.log("Chat-Script zum DOM hinzugefügt");
    
    // Create and start the style observer
    const styleObserver = createStyleObserver();
    console.log("Style Observer für Chat-Widget gestartet");
    
    // Final application of styles - this ensures our theme is applied after any initial styles
    setTimeout(() => {
      // Check if our theme CSS is loaded, if not, reload it
      if (!document.getElementById('n8n-chat-theme-css')) {
        const themeLink = document.createElement("link");
        themeLink.rel = "stylesheet";
        themeLink.href = "/src/n8n-chat-theme.css";
        themeLink.id = "n8n-chat-theme-css";
        document.head.appendChild(themeLink);
      }
      
      // Add a final inline style to force our styles to take precedence
      const finalStyle = document.createElement('style');
      finalStyle.id = 'n8n-chat-final-override';
      finalStyle.innerHTML = `
        html body .n8n-chat__toggle { 
          background-color: #f9b135 !important; 
          color: #3a3a3a !important; 
        }
        html body .n8n-chat__toggle:hover { 
          background-color: #fac25f !important; 
        }
        html body .n8n-chat__toggle:active { 
          background-color: #fbd388 !important; 
        }
        html body .n8n-chat__header { 
          background-color: #f9b135 !important; 
          color: #3a3a3a !important; 
        }
        html body .n8n-chat__message--bot { 
          background-color: #feeccd !important; 
          color: #3a3a3a !important; 
        }
        html body .n8n-chat__message--user { 
          background-color: #3a3a3a !important; 
          color: #ffffff !important; 
        }
      `;
      document.head.appendChild(finalStyle);
      console.log("Finale Disponic-Stile hinzugefügt");
      
      // Final direct style application to ensure immediate effect
      const chatElements = document.querySelectorAll(".n8n-chat");
      if (chatElements.length > 0) {
        chatElements.forEach(el => {
          const element = el as HTMLElement;
          const toggle = element.querySelector('.n8n-chat__toggle') as HTMLElement;
          const header = element.querySelector('.n8n-chat__header') as HTMLElement;
          
          if (toggle) {
            toggle.style.backgroundColor = '#f9b135';
            toggle.style.color = '#3a3a3a';
          }
          
          if (header) {
            header.style.backgroundColor = '#f9b135';
            header.style.color = '#3a3a3a';
          }
        });
      }
    }, 2000);
    
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-gray-50">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <a 
          href="https://www.disponic.de/handbuecher" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-amber-600 border border-amber-100"
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
              className="mb-6 text-center bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-6 px-8 rounded-xl shadow-lg"
            >
              <h1 className="text-3xl font-bold mb-2">DISPONIC Handbuch-Chatbot</h1>
              <p className="text-amber-100">Ihr intelligenter Assistent für Dienstplanung und mehr</p>
            </motion.div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100">
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center"
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
                  className="text-xs uppercase tracking-widest text-amber-600 font-medium"
                >
                  DISPONIC Support
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-2xl font-medium mt-2"
                >
                  Handbuch-Chatbot
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-gray-500 mt-2"
                >
                  Melden Sie sich an, um alle DISPONIC Handbücher und Funktionen per Chat zu erkunden
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ihren Benutzernamen eingeben"
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ihr Passwort eingeben"
                    required
                  />
                </motion.div>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-xl hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 relative overflow-hidden group"
                >
                  <span className={`absolute inset-0 w-0 bg-amber-700 transition-all duration-[400ms] ease-out group-hover:w-full ${isLoading ? 'w-full' : ''}`}></span>
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
                        Jetzt anmelden
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
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600 mb-6"
              >
                DISPONIC Support-Chatbot
              </motion.h1>

              {/* 50/50 Layout with GIF and Character */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden"
              >
                {/* Left half - Content with amber background */}
                <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-6 flex flex-col justify-center">
                  <h3 className="text-amber-900 text-2xl font-bold mb-3">Dienstplanung mit WOW-Effekt</h3>
                  <p className="text-amber-800 mb-6">Alle DISPONIC Funktionen direkt per Chat erkunden und verstehen</p>
                  <div className="bg-amber-500/10 rounded-xl p-4">
                    <ul className="text-left space-y-2">
                      <li className="flex items-center gap-2 text-amber-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Einfache Bedienung
                      </li>
                      <li className="flex items-center gap-2 text-amber-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Schnelle Antworten
                      </li>
                      <li className="flex items-center gap-2 text-amber-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Intelligente Vorschläge
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Right half - GIF with character figure */}
                <div className="relative bg-transparent rounded-2xl overflow-hidden flex items-center justify-center">
                  {/* Main background GIF taking up the right half */}
                  <div className="w-1/2 h-full flex items-center justify-center">
                    <img 
                      src="/assets/d2.gif" 
                      alt="DISPONIC AI Chatbot Demonstration" 
                      className="h-full object-contain"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  
                  {/* Right side reserved for character figure */}
                  <div className="w-1/2 h-full flex items-center justify-center">
                    {/* Empty space for future character image */}
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                  <h2 className="text-xl font-medium text-amber-600 mb-4 flex items-center gap-2">
                    <Calendar size={22} />
                    DISPONIC Module
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">Dienstplan, Einsatzplan, Bruttolohn, Faktur, Apps für das Smartphone wie mobile Zeiterfassung und Wächterkontrollsystem – alles aus einer Hand mit DISPONIC.</p>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 text-sm">Hauptmodule:</h3>
                      <ul className="list-disc pl-5 text-gray-600 text-sm">
                        <li>Dienstplanung & Lohn</li>
                        <li>Mobile Zeiterfassung</li>
                        <li>Wunschplanung & Informationen</li>
                        <li>Ressourcenverfolgung & WKS</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                  <h2 className="text-xl font-medium text-amber-600 mb-4 flex items-center gap-2">
                    <Headphones size={22} />
                    Support & Services
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">Mit unserer Hotline sind wir für Sie da. Online wie auch telefonisch.</p>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 text-sm">Angebote:</h3>
                      <ul className="list-disc pl-5 text-gray-600 text-sm">
                        <li>Consulting & Schulungen</li>
                        <li>Projektmanagement & Hotline</li>
                        <li>Hosting & Selfservices</li>
                        <li>E-Learning & Webinare</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div id="n8n-chat" className="fixed bottom-0 right-0 w-16 h-16 z-[9999]"></div>
    </div>
  );
};

export default Index;
