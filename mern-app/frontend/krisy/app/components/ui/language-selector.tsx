"use client";

import React, { useState } from 'react';
import { Globe, X } from 'lucide-react';
import { useLanguage } from '@/app/context/language-context';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
] as const;

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    return (
        <div className="fixed bottom-8 right-8 z-[6000]">
            {/* Pop-up Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-64 bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0),8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-100 pb-2">
                            <span className="font-black uppercase text-xs tracking-wider text-black flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Select Language
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:rotate-90 transition-transform duration-200"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`
                    w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm transition-all
                    ${language === lang.code
                                            ? 'bg-green-700 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0)]'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-black hover:translate-x-1'
                                        }
                  `}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-14 h-14 rounded-full flex items-center justify-center border-2 border-black transition-all
          bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
          ${isOpen ? 'bg-green-100' : 'bg-white'}
        `}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-black" />
                ) : (
                    <Globe className="w-6 h-6 text-black" />
                )}
            </button>
        </div>
    );
}
