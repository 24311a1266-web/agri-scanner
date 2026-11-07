/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScanLine,
  Volume2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Languages,
  CheckCircle2,
  Database,
  Award,
  Info,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { Header, LANGUAGES } from './components/Header';
import { ScannerModal } from './components/ScannerModal';
import { LabelAnalysisResult } from './components/LabelAnalysisResult';
import { TrustedDatabaseView } from './components/TrustedDatabaseView';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { ProjectAboutModal } from './components/ProjectAboutModal';
import { scanLabel } from './services/api';
import { SAMPLE_LABELS } from './data/sampleLabels';
import { LabelAnalysisResponse, LanguageCode } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'scanner' | 'database' | 'evaluation' | 'about'>('scanner');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('telugu');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<LabelAnalysisResponse | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeLabelName, setActiveLabelName] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleImageSelected = async (base64Image: string, barcode?: string, sampleName?: string) => {
    setIsProcessing(true);
    setScanError(null);
    setActiveImage(base64Image);
    setActiveLabelName(sampleName || 'Custom Farm Product Label');

    // Multi-stage loading progress simulation for clear user feedback
    setProcessingStage('1/4 Analyzing image quality (blur, glare, & legibility)...');

    const t1 = setTimeout(() => {
      setProcessingStage('2/4 Extracting visible label fields & toxicity color diamond...');
    }, 800);

    const t2 = setTimeout(() => {
      setProcessingStage('3/4 Cross-verifying against CIB&RC authorized benchmark registry...');
    }, 1800);

    const t3 = setTimeout(() => {
      setProcessingStage('4/4 Synthesizing farmer explanation & regional audio script...');
    }, 2800);

    try {
      const mime = base64Image.startsWith('data:image/png')
        ? 'image/png'
        : base64Image.startsWith('data:image/webp')
        ? 'image/webp'
        : 'image/jpeg';

      const result = await scanLabel(base64Image, mime, selectedLanguage, barcode);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setCurrentResult(result);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      console.error('Scan error:', err);
      setScanError(err.message || 'Failed to scan and analyze label. Please retry with a clearer photo.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleResetScan = () => {
    setCurrentResult(null);
    setActiveImage(null);
    setActiveLabelName(null);
    setScanError(null);
  };

  const handleSelectProductFromCatalog = (productName: string) => {
    setCurrentTab('scanner');
    handleResetScan();
    // Find matching sample if available
    const matchedSample = SAMPLE_LABELS.find((s) => s.name.toLowerCase().includes(productName.toLowerCase()));
    if (matchedSample) {
      handleImageSelected(matchedSample.imageUrl, matchedSample.barcode, matchedSample.name);
    }
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation & Language Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(newLang) => {
          setSelectedLanguage(newLang);
          // If a result is active, prompt re-analyzing or re-rendering speech
          if (activeImage && currentResult) {
            handleImageSelected(activeImage, undefined, activeLabelName || undefined);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Scanner View */}
        {currentTab === 'scanner' && (
          <div className="space-y-6">
            
            {/* Greeting & Language Indicator Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-5 shadow-sm border border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl shrink-0">
                  {currentLangObj.flag}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Selected Language: {currentLangObj.nativeName} ({currentLangObj.name})
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {currentLangObj.exampleGreeting}! Scan or Upload Farm Product
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                    Clear plain-language instructions, toxicity color bands, and voice audio for farmers.
                  </p>
                </div>
              </div>

              {/* Language Pills for Fast Switching */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-emerald-950/40 p-1.5 rounded-xl border border-emerald-700/60">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      if (activeImage && currentResult) {
                        handleImageSelected(activeImage, undefined, activeLabelName || undefined);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedLanguage === lang.code
                        ? 'bg-amber-400 text-emerald-950 shadow-sm'
                        : 'text-emerald-100 hover:bg-emerald-800/60'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message if any */}
            {scanError && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-900 flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <div className="font-extrabold">Scan &amp; Validation Error</div>
                  <p className="mt-0.5">{scanError}</p>
                  <button
                    onClick={handleResetScan}
                    className="mt-2 text-xs font-bold text-rose-700 underline cursor-pointer"
                  >
                    Try another label or test sample
                  </button>
                </div>
              </div>
            )}

            {/* Processing State with Step Indicators */}
            {isProcessing && (
              <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-sm text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                  <ScanLine className="w-7 h-7 text-emerald-700 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    AgriScanner is Analyzing Label...
                  </h3>
                  <p className="text-sm font-semibold text-emerald-800 mt-1 font-mono">
                    {processingStage}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Validating image clarity, extracting active chemicals, checking safety rules &amp; preparing regional voice playback.
                  </p>
                </div>
              </div>
            )}

            {/* Results View or Scanner Input Modal */}
            {!isProcessing && currentResult && activeImage ? (
              <LabelAnalysisResult
                result={currentResult}
                language={selectedLanguage}
                originalImage={activeImage}
                onResetScan={handleResetScan}
              />
            ) : (
              !isProcessing && (
                <ScannerModal
                  onImageSelected={handleImageSelected}
                  isProcessing={isProcessing}
                />
              )
            )}

          </div>
        )}

        {/* Tab 2: Authorized Catalog */}
        {currentTab === 'database' && (
          <TrustedDatabaseView onSelectProductForScan={handleSelectProductFromCatalog} />
        )}

        {/* Tab 3: Evaluation Metrics */}
        {currentTab === 'evaluation' && <EvaluationDashboard />}

        {/* Tab 4: About the Project */}
        {currentTab === 'about' && <ProjectAboutModal />}

      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300 py-6 border-t border-emerald-900 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <Sprout className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">
                AgriScanner: Scan, Understand, and Hear Your Farm Product Label
              </div>
              <div className="text-emerald-400 text-[11px]">
                Summer Industry Internship – I Report • Sreenidhi Institute of Science and Technology (SNIST)
              </div>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-emerald-400">
            <div>Authors: N. Prakeerthan Reddy • K. Hemanth Kumar Reddy • J. Akshith Patel</div>
            <div>Under guidance of Mr. G. Nuthan Kumar, Assistant Professor, Dept of IT</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
