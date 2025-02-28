
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const navigate = useNavigate();

  // Check if already authenticated on component mount
  useEffect(() => {
    const authData = localStorage.getItem("n8nChatAuth");
    if (authData) {
      try {
        const [storedUsername, storedPassword] = atob(authData).split(":");
        setUsername(storedUsername);
        setPassword(storedPassword);
        setIsAuthenticated(true);
        
        // Initialize chat with a delay to ensure the DOM is ready
        setTimeout(() => {
          initializeChat(storedUsername, storedPassword);
        }, 1000);
      } catch (error) {
        console.error("Error restoring authentication:", error);
        localStorage.removeItem("n8nChatAuth");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Basic validation
      if (!username.trim() || !password.trim()) {
        toast.error("Please enter both username and password");
        setIsLoading(false);
        return;
      }
      
      // In a real app, you would verify credentials with a backend
      // For this example, we're just checking if fields are filled
      if (username && password) {
        // Store authentication in localStorage for persistence
        localStorage.setItem("n8nChatAuth", btoa(`${username}:${password}`));
        setIsAuthenticated(true);
        toast.success("Login successful");
        
        // Initialize n8n chat after authentication with a delay
        setTimeout(() => {
          initializeChat(username, password);
        }, 1000);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = (username: string, password: string) => {
    if (chatInitialized) {
      console.log("Chat already initialized, skipping...");
      return;
    }
    
    console.log("Initializing chat with credentials...");
    
    // Clean up any previous instances
    const oldScript = document.getElementById("n8n-chat-script");
    if (oldScript) {
      oldScript.remove();
    }
    
    // Clean up any existing chat instances
    const chatElements = document.querySelectorAll(".n8n-chat");
    chatElements.forEach(el => el.remove());
    
    // Create the authorization header
    const authHeader = `Basic ${btoa(username + ":" + password)}`;
    
    // Create and append script
    const script = document.createElement("script");
    script.id = "n8n-chat-script";
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      
      try {
        const chatInstance = createChat({
          webhookUrl: 'https://dwr.app.n8n.cloud/webhook/53c136fe-3e77-4709-a143-fe82746dd8b6/chat',
          webhookConfig: {
            method: 'POST',
            headers: {
              'Authorization': '${authHeader}',
              'Content-Type': 'application/json'
            }
          },
          mode: 'window',
          initialMessages: [
            'Welcome ${username}! 👋',
            'How can I assist you today?'
          ],
          i18n: {
            en: {
              title: 'N8N Assistant',
              subtitle: "Your AI-powered workflow assistant",
              inputPlaceholder: "Ask me anything...",
            },
          },
          debug: true // Enable debug mode
        });
        
        // Force visibility
        setTimeout(() => {
          const chatToggle = document.querySelector('.n8n-chat__toggle');
          const chatWindow = document.querySelector('.n8n-chat__window');
          
          if (chatToggle) {
            chatToggle.setAttribute('style', 'visibility: visible !important; opacity: 1 !important; display: block !important;');
          }
          
          if (chatWindow) {
            chatWindow.setAttribute('style', 'z-index: 10000 !important;');
          }
          
          console.log('Chat UI elements enhanced for visibility');
        }, 2000);
        
        console.log('Chat initialized successfully');
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    `;
    
    document.body.appendChild(script);
    console.log("Chat script added to DOM");
    setChatInitialized(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Disponic Logo and Handbook Link */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <a 
          href="https://handbuch.disponic.de/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-blue-700 border border-blue-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          Disponic Handbuch
        </a>
      </div>

      <AnimatePresence>
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-8 rounded-xl shadow-lg"
            >
              <h1 className="text-3xl font-bold mb-2">Willkommen bei Disponic</h1>
              <p className="text-blue-100">Ihr intelligenter Assistent für Workflow-Automatisierung</p>
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
                  N8N Chat Zugang
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-gray-500 mt-2"
                >
                  Bitte melden Sie sich an, um den Assistenten zu nutzen
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
                    placeholder="Benutzernamen eingeben"
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
                    placeholder="Passwort eingeben"
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
                        Anmeldung...
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
            className="w-full max-w-xl text-center"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
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
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700"
              >
                Willkommen bei Disponic, {username}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 mt-3 text-lg"
              >
                Ihr persönlicher n8n-Assistent steht Ihnen zur Verfügung. Klicken Sie auf das Chat-Symbol in der unteren rechten Ecke, um eine Konversation zu starten.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 p-6 bg-white shadow-md rounded-xl border border-blue-100"
              >
                <h2 className="text-xl font-medium text-blue-700 mb-2">Hilfreiche Ressourcen</h2>
                <p className="text-gray-600 mb-4">
                  Nutzen Sie unser umfangreiches Handbuch für detaillierte Anleitungen und Tipps
                </p>
                <a 
                  href="https://handbuch.disponic.de/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                  Disponic Handbuch öffnen
                </a>
              </motion.div>
            </div>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={() => {
                localStorage.removeItem("n8nChatAuth");
                setIsAuthenticated(false);
                setChatInitialized(false);
                
                // Clean up any chat instances
                const chatElements = document.querySelectorAll(".n8n-chat");
                chatElements.forEach(el => el.remove());
                
                toast.info("Sie wurden abgemeldet");
                
                // Reload the page to reset everything
                setTimeout(() => window.location.reload(), 1000);
              }}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Abmelden
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Container for chat initialization */}
      <div id="n8n-chat-container" className="fixed bottom-0 right-0 w-16 h-16 z-[9999]"></div>
      
      {/* Disponic Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm"
      >
        &copy; {new Date().getFullYear()} Disponic - Alle Rechte vorbehalten
      </motion.div>
    </div>
  );
};

export default Index;
