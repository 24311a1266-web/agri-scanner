import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplets,
  Sprout,
  HelpCircle,
  FileText,
  BadgeAlert,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { LabelAnalysisResponse, LanguageCode } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { askQuestionAboutLabel } from '../services/api';

interface LabelAnalysisResultProps {
  result: LabelAnalysisResponse;
  language: LanguageCode;
  originalImage: string;
  onResetScan: () => void;
}

export const LabelAnalysisResult: React.FC<LabelAnalysisResultProps> = ({
  result,
  language,
  originalImage,
  onResetScan,
}) => {
  const { imageQuality, extractedFields, verifiedCatalogMatch, farmerExplanation, audioScript, safetyGateVerdict } =
    result;

  const [qaQuestion, setQaQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string; time: string }>>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [showRawOcr, setShowRawOcr] = useState(false);

  // Toxicity band styling helper
  const getToxicityBandStyle = (band?: string) => {
    const b = (band || '').toLowerCase();
    if (b.includes('red')) {
      return {
        bg: 'bg-red-600',
        lightBg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-900',
        badge: 'bg-red-100 text-red-800 border-red-300',
        label: 'RED BAND: EXTREMELY TOXIC (POISON / విషం / जहर)',
        symbol: '☠',
      };
    }
    if (b.includes('yellow')) {
      return {
        bg: 'bg-amber-500',
        lightBg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-950',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        label: 'YELLOW BAND: HIGHLY TOXIC (POISON / విషం / जहर)',
        symbol: '☠',
      };
    }
    if (b.includes('blue')) {
      return {
        bg: 'bg-blue-600',
        lightBg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-950',
        badge: 'bg-blue-100 text-blue-900 border-blue-300',
        label: 'BLUE BAND: MODERATELY TOXIC (DANGER / ప్రమాదం / खतरा)',
        symbol: '▲',
      };
    }
    return {
      bg: 'bg-emerald-600',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-950',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      label: 'GREEN BAND: SLIGHTLY TOXIC / CAUTION (హెచ్చరిక / सावधानी)',
      symbol: '🌿',
    };
  };

  const toxStyle = getToxicityBandStyle(extractedFields.toxicityColorBand);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuestion.trim() || isAsking) return;

    const currentQ = qaQuestion.trim();
    setQaQuestion('');
    setIsAsking(true);

    try {
      const response = await askQuestionAboutLabel(currentQ, result, language);
      setQaHistory((prev) => [
        ...prev,
        {
          q: currentQ,
          a: response.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setQaHistory((prev) => [
        ...prev,
        {
          q: currentQ,
          a: `Error: ${err.message || 'Unable to connect to assistant.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handlePredefinedQuestion = (q: string) => {
    setQaQuestion(q);
  };

  return (
    <div className="space-y-6">

      {/* Action header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <h2 className="text-lg font-extrabold text-slate-900">
            Scan &amp; Verification Results
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            Analysis Completed
          </span>
        </div>

        <button
          onClick={onResetScan}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
        >
          + Scan Another Label
        </button>
      </div>

      {/* Step 4: Image Validation & Quality Gate */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          imageQuality.isUsable
            ? 'bg-slate-50 border-slate-200'
            : 'bg-amber-50 border-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                imageQuality.isUsable ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            >
              {imageQuality.isUsable ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 4 • Image Quality Check
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    imageQuality.isUsable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Score: {imageQuality.qualityScore}/100
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {imageQuality.isUsable ? 'Label is Readable & Clear' : 'Potential Input Issues Detected'}
              </h4>
            </div>
          </div>

          {/* Quality Factors Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span
              className={`px-2 py-1 rounded-md font-semibold ${
                imageQuality.blurDetected ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {imageQuality.blurDetected ? '⚠️ Blur Detected' : '✓ Sharp Focus'}
            </span>
            <span
              className={`px-2 py-1 rounded-md font-semibold ${
                imageQuality.glareDetected ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {imageQuality.glareDetected ? '⚠️ Glare / Reflection' : '✓ Good Lighting'}
            </span>
            <span
              className={`px-2 py-1 rounded-md font-semibold ${
                imageQuality.cropDetected ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {imageQuality.cropDetected ? '⚠️ Cropped Margins' : '✓ Full Label'}
            </span>
          </div>
        </div>

        {/* Retake Guidance if needed */}
        {imageQuality.retakeGuidance && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
            <span className="font-bold text-slate-900 shrink-0">Field Guidance:</span>
            <span>{imageQuality.retakeGuidance}</span>
          </div>
        )}
      </div>

      {/* Safety Gate Warning (If uncertain fields or expired) */}
      {(!safetyGateVerdict.passed || (extractedFields.uncertainOrMissingFields && extractedFields.uncertainOrMissingFields.length > 0)) && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-amber-950">
                Safety Gate Activated: Unclear or Incomplete Label Fields
              </h3>
              <p className="text-xs text-amber-900">
                As per AgriScanner safety protocols, unverified or blurred details must not be guessed. Please note the following precautions:
              </p>
              <ul className="list-disc list-inside text-xs text-amber-900 mt-2 space-y-1">
                {extractedFields.uncertainOrMissingFields?.map((f, i) => (
                  <li key={i}>
                    <span className="font-semibold text-amber-950">Uncertain field:</span> {f}
                  </li>
                ))}
                {safetyGateVerdict.reasons.map((r, i) => (
                  <li key={`reason-${i}`}>{r}</li>
                ))}
              </ul>
              <div className="mt-2 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg inline-block">
                ⚠️ Never guess chemical doses. Consult your local Agricultural Extension Officer or registered dealer.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Toxicity Band Banner (Indian Statutory Diamond Scheme) */}
      <div className={`rounded-2xl p-5 border-2 ${toxStyle.border} ${toxStyle.lightBg} shadow-sm overflow-hidden relative`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl ${toxStyle.bg} text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0`}>
              {toxStyle.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${toxStyle.badge}`}>
                  {extractedFields.toxicityColorBand} Toxicity Diamond
                </span>
                <span className="text-xs text-slate-500 font-semibold">CIB&amp;RC Standard</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {extractedFields.productName || 'Agricultural Formulation'}
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                {extractedFields.brandOrManufacturer || 'Authorized Manufacturer'} • Category: {extractedFields.category}
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {extractedFields.expiryDate && (
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                extractedFields.expiryDate.toLowerCase().includes('expired')
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-white text-slate-800 border-slate-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Expiry: {extractedFields.expiryDate}</span>
              </div>
            )}

            {farmerExplanation.waitingPeriodBeforeHarvest && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Waiting: {farmerExplanation.waitingPeriodBeforeHarvest}</span>
              </div>
            )}
          </div>
        </div>

        {/* Plain explanation of what toxicity means */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700 leading-relaxed">
          <span className="font-extrabold text-slate-900">Farmer Health Impact: </span>
          {farmerExplanation.toxicityLevelExplanation}
        </div>
      </div>

      {/* Audio Player Section: "Hear Your Farm Product Label" */}
      <AudioPlayer
        audioScript={audioScript}
        language={language}
        productName={extractedFields.productName}
      />

      {/* Core Explanation Cards Grid for Farmers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: What is it for & Crop Suitability */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1. What is this Product Used For?
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {farmerExplanation.whatIsItFor}
            </p>
          </div>

          {verifiedCatalogMatch.cibrcApprovedCrops && verifiedCatalogMatch.cibrcApprovedCrops.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-1.5">Approved Crops:</span>
              <div className="flex flex-wrap gap-1">
                {verifiedCatalogMatch.cibrcApprovedCrops.map((c, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Recommended Usage & Dosage */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                2. Dosage &amp; Application Directions
              </h3>
            </div>
            <p className="text-sm text-slate-800 font-semibold leading-relaxed bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              {farmerExplanation.recommendedUsageAndDosage}
            </p>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            *Strictly follows visible label proportions. Never apply concentrated pesticide without exact water dilution.
          </div>
        </div>

        {/* Card 3: Safety Precautions & Mandatory PPE */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Protective Gear &amp; Safe Spraying
            </h3>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {farmerExplanation.safetyPrecautionsAndPPE.map((prec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{prec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 4: First Aid & Emergency Antidote */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/30 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <BadgeAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-rose-950">
              4. Emergency First Aid &amp; Antidote
            </h3>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {farmerExplanation.firstAidAndAntidote}
          </div>

          <div className="mt-3 bg-rose-100/70 p-2.5 rounded-lg border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
            <span className="font-bold">National Poison Control Toll-Free:</span>
            <span className="font-mono font-black text-rose-700 text-sm">1800-116-117</span>
          </div>
        </div>

      </div>

      {/* Step 5: Separation of Visible Label Data vs Authorized Registry Record */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Step 5 • Trusted Reference Comparison
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Label Extracted Data vs. Authorized CIB&amp;RC Database
            </h3>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold ${
              verifiedCatalogMatch.matched
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Match: {verifiedCatalogMatch.matchConfidence}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Left Column: What Was Read Directly From Label */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Visible on Label (Direct OCR)</span>
            </h4>
            <dl className="space-y-1.5 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-slate-500">Product Name:</dt>
                <dd className="font-semibold text-slate-900 text-right">{extractedFields.productName || 'Unclear'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-slate-500">Active Ingredients:</dt>
                <dd className="font-semibold text-slate-900 text-right max-w-[200px] truncate">{extractedFields.activeIngredients || 'Not visible'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-slate-500">Batch Number:</dt>
                <dd className="font-mono font-semibold text-slate-900">{extractedFields.batchNumber || 'Uncertain / Obscured'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-slate-500">Registration No:</dt>
                <dd className="font-mono font-semibold text-slate-900">{extractedFields.registrationNumber || 'Pending verification'}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-slate-500">Toxicity Color:</dt>
                <dd className="font-bold text-slate-900">{extractedFields.toxicityColorBand}</dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Authorized Benchmark Record */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <h4 className="font-bold text-emerald-950 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Authorized Benchmark Record (CIB&amp;RC / NSC)</span>
            </h4>
            {verifiedCatalogMatch.matched ? (
              <dl className="space-y-1.5 text-emerald-950">
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <dt className="text-emerald-700">Generic Standard:</dt>
                  <dd className="font-semibold text-right">{verifiedCatalogMatch.standardGenericName}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <dt className="text-emerald-700">Official Reg No:</dt>
                  <dd className="font-mono font-semibold">{verifiedCatalogMatch.authorizedRegistrationNumber}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <dt className="text-emerald-700">Statutory Class:</dt>
                  <dd className="font-semibold">{verifiedCatalogMatch.officialToxicityClassification}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <dt className="text-emerald-700">Waiting Period (PHI):</dt>
                  <dd className="font-bold">{verifiedCatalogMatch.benchmarkWaitingPeriodDays ? `${verifiedCatalogMatch.benchmarkWaitingPeriodDays} Days` : 'N/A'}</dd>
                </div>
                <div className="pt-1 text-[11px] text-emerald-800">
                  {verifiedCatalogMatch.externalVerificationNotes}
                </div>
              </dl>
            ) : (
              <p className="text-xs text-slate-600 italic py-4">
                No matching authorized reference record found in offline registry. Product was analyzed strictly from visible label text.
              </p>
            )}
          </div>
        </div>

        {/* Toggle Raw OCR Button */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setShowRawOcr(!showRawOcr)}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>{showRawOcr ? 'Hide Raw OCR Text' : 'View Extracted Raw OCR Text'}</span>
            {showRawOcr ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showRawOcr && extractedFields.rawOcrSnippet && (
          <div className="mt-3 p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap">
            {extractedFields.rawOcrSnippet}
          </div>
        )}
      </div>

      {/* Follow-up Q&A Section ("Ask AgriScanner") */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ask AgriScanner About This Scanned Label
            </h3>
            <p className="text-xs text-slate-500">
              Answers are strictly safety-bounded by this product&apos;s verified label instructions.
            </p>
          </div>
        </div>

        {/* Suggested Quick Questions */}
        <div className="my-3 flex flex-wrap gap-1.5">
          {[
            'Can I spray this when it is raining or windy?',
            'What exact protective gloves and mask should I wear?',
            'What happens if the spray accidentally touches eyes or skin?',
            'How many days before harvest must I stop spraying?',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePredefinedQuestion(q)}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Q&A History */}
        {qaHistory.length > 0 && (
          <div className="my-4 space-y-3">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs sm:text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-900">Q: {item.q}</span>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <div className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-1.5 leading-relaxed">
                  <span className="font-bold text-emerald-700 mr-1">AgriScanner:</span>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ask Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Ask anything about dilution, safe storage, or protective gear..."
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            disabled={isAsking}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isAsking || !qaQuestion.trim()}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {isAsking ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Ask</span>
          </button>
        </form>
      </div>

      {/* Mandatory Statutory Regulatory Disclaimer */}
      <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
        <span className="font-bold text-slate-800">Statutory Notice: </span>
        {safetyGateVerdict.mandatoryDisclaimers?.[0] ||
          'AgriScanner is an agricultural information assistant designed to improve readability of packaging. It does not prescribe chemical use, diagnose unverified plant conditions, or replace the physical label approved by the Central Insecticides Board & Registration Committee (CIB&RC) or official agricultural extension officers.'}
      </div>

    </div>
  );
};
