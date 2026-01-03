import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { executeAction } from '@/lib/voice-actions';

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const recognitionRef = useRef<any>(null);
  const hasGreeted = useRef<string | null>(null); // Store last greeted path

  // Helper to detect Hindi characters
  const isHindi = (text: string) => {
    const devanagariPattern = /[\u0900-\u097F]/;
    return devanagariPattern.test(text);
  };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Strategy: 
        // 1. If text is Hindi, prefer Hindi voice.
        // 2. Else prefer Indian English voice.
        // 3. Fallback to any English.
        
        let targetVoice;
        
        if (isHindi(text)) {
            targetVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
        }
        
        if (!targetVoice) {
            targetVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
        }
        
        if (!targetVoice) {
             // Try Google voices which are usually good
             targetVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
        }

        if (targetVoice) utterance.voice = targetVoice;
        
        // Adjust properties for "Guide" persona
        utterance.rate = 0.9; // Slightly slower
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      } else {
        setVoice();
      }
    }
  }, []);

  const handleCommand = async (text: string) => {
    setIsProcessing(true);
    
    // Collect current form data if on report page
    let formData: Record<string, string> = {};
    if (pathname === '/reports') {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
            const el = input as HTMLInputElement | HTMLSelectElement;
            if (el.name || el.id) {
                formData[el.name || el.id] = el.value;
            }
        });
    }

    try {
      const res = await fetch('http://localhost:5000/voice/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            text, 
            page: pathname,
            formData // Send captured form data
        }),
      });
      
      const data = await res.json();
      console.log("Voice Action:", data);
      executeAction(data, router, speak);
    } catch (e) {
      console.error(e);
      speak("I'm sorry, I couldn't reach the server.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Setup Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && !recognitionRef.current) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        // Default to Indian English, but it handles Hindi reasonably well if mixed
        recognition.lang = 'en-IN'; 
        
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleCommand(text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, [speak]);

  // Greeting Logic on Path Change
  useEffect(() => {
    if (hasGreeted.current === pathname) return;

    const greet = () => {
        if (pathname === '/') {
            speak("Welcome to Krisy! I am your farming guide. Click the green button or say 'Get Recommendation' to start.");
        } else if (pathname === '/reports') {
            speak("This is the Crop Health form. I can help you fill it. What is the name of your crop?");
        } else if (pathname === '/dashboard') {
            speak("This is your Dashboard. Here you can see your latest advices.");
        }
        hasGreeted.current = pathname;
    };

    // Small timeout to allow page load
    const timer = setTimeout(greet, 1000);
    return () => clearTimeout(timer);
    
  }, [pathname, speak]);

  const toggleListening = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        try {
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript('');
        } catch(e) {
            console.error("Speech recognition error", e);
        }
      }
    } else {
        alert("Voice assistant is not supported in this browser.");
    }
  }, [isListening]);

  return { isListening, toggleListening, transcript, isProcessing };
};
