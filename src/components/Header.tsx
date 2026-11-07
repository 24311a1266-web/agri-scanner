import React from 'react';
import { ScanLine, Volume2, ShieldCheck, Database, Award, Info, Globe2 } from 'lucide-react';
import { LanguageCode, LanguageOption } from '../types';

interface HeaderProps {
  currentTab: 'scanner' | 'database' | 'evaluation' | 'about';
  setCurrentTab: (tab: 'scanner' | 'database' | 'evaluation' | 'about') => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'english', name: 'English', nativeName: 'English', flag: '🌐', exampleGreeting: 'Hello farmer' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', flag: '🌾', exampleGreeting: 'నమస్కారం రైతు సోదరుడా' },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', exampleGreeting: 'नमस्ते किसान मित्र' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', flag: '🌱', exampleGreeting: 'வணக்கம் விவசாயி' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🌿', exampleGreeting: 'ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರ' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', flag: '🌻', exampleGreeting: 'नमस्कार शेतकरी मित्र' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Brand & Project Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('scanner')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-inner text-emerald-950 font-black">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  AgriScanner <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-700 font-semibold uppercase tracking-wider">AI Assistant</span>
                </h1>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Scan, Understand &amp; Hear Your Farm Product Label • SNIST Internship Project
              </p>
            </div>
          </div>

          {/* Navigation & Language Select */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-950/70 border border-emerald-700/80 rounded-lg px-2.5 py-1">
              <Globe2 className="w-4 h-4 text-emerald-300 mr-2 shrink-0" />
              <label htmlFor="language-select" className="sr-only">Select farmer language</label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-sm font-semibold text-emerald-100 focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-emerald-900 text-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center bg-emerald-950/60 p-1 rounded-lg border border-emerald-800 text-xs font-semibold">
              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentTab === 'scanner'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan Label</span>
              </button>

              <button
                onClick={() => setCurrentTab('database')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentTab === 'database'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Authorized</span> Catalog
              </button>

              <button
                onClick={() => setCurrentTab('evaluation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentTab === 'evaluation'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Testing</span> Metrics
              </button>

              <button
                onClick={() => setCurrentTab('about')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  currentTab === 'about'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>About</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
