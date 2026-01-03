"use client";

import React, { useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceAssistant } from '@/app/hooks/use-voice-assistant';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Assistant = () => {
  const { isListening, toggleListening, transcript, isProcessing } = useVoiceAssistant();

  // Play a greeting when mounted if possible (usually requires interaction first)
  // We can add a "Click to activate" tooltip or just a prominent button.

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {(isListening || transcript) && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 max-w-xs"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                    </div>
                ) : (
                    <p className="text-sm text-zinc-800 dark:text-zinc-200">
                        {transcript || "Listening..."}
                    </p>
                )}
            </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleListening}
        className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
          isListening 
            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
            : "bg-green-600 hover:bg-green-700"
        )}
      >
        {isListening ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );
};
