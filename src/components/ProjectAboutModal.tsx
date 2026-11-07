import React from 'react';
import {
  GraduationCap,
  Users,
  FileText,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

export const ProjectAboutModal: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Requirement Analysis',
      desc: 'Selected target region (Telangana / South India), primary farmer languages (Telugu, Hindi, English), and candidate agro-chemical categories (Insecticides, Fungicides, Seeds).',
    },
    {
      num: 2,
      title: 'Authorized Data Preparation',
      desc: 'Compiled reference records and benchmark chemical identifiers from CIB&RC registers and National Seeds Corporation guidelines.',
    },
    {
      num: 3,
      title: 'Interface and Capture Flow',
      desc: 'Developed web/mobile camera scanner, image uploader, and barcode reader with retake guidance for blur, low light, and curvature.',
    },
    {
      num: 4,
      title: 'Image Validation & OCR',
      desc: 'Quality check before processing: assesses blur, glare, and crop before OCR extraction, preserving uncertain text signals.',
    },
    {
      num: 5,
      title: 'Product Identification & Retrieval',
      desc: 'Matches extracted fields against authorized database records, keeping label-read data strictly separate from benchmark records.',
    },
    {
      num: 6,
      title: 'AI Explanation & Safety Checks',
      desc: 'Generates simplified farmer explanations, preserving statutory warnings, PPE requirements, and antidotes without hallucinating unverified doses.',
    },
    {
      num: 7,
      title: 'Language & Audio Output',
      desc: 'Renders natural translations and text-to-speech audio narration in farmer’s preferred language for accessibility.',
    },
    {
      num: 8,
      title: 'Testing & Evaluation Framework',
      desc: 'Tested against manual transcription, measuring OCR accuracy, translation faithfulness, unreadable information detection, and speech intelligibility.',
    },
    {
      num: 9,
      title: 'Demonstration & Documentation',
      desc: 'Complete end-to-end prototype demo with verified test datasets and documented safety boundaries.',
    },
    {
      num: 10,
      title: 'Future Enhancements',
      desc: 'Offline caching, additional Indian regional dialects, QR/GS1-128 batch traceability, and direct Krishi Vigyan Kendra extension officer integration.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-800">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider rounded-full">
            SNIST Industry Internship Report
          </span>
          <span className="px-3 py-1 bg-emerald-800/80 text-emerald-200 text-xs font-semibold rounded-full border border-emerald-700">
            JNTUH Affiliated • 2026-2027
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
          AgriScanner: Scan, Understand, and Hear Your Farm Product Label
        </h2>
        <p className="text-sm sm:text-base text-emerald-200 mt-2 max-w-3xl leading-relaxed">
          A farmer-focused AI tool that scans seed and pesticide packaging, checks image quality, extracts visible label fields, verifies against authorized CIB&amp;RC data, and speaks plain-language guidance in the farmer&apos;s preferred language.
        </p>

        {/* View Original PDF Link */}
        <div className="mt-5 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center gap-3">
          <a
            href="/assets/aistudio/FINAL_DOCUMENT_76757f48.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Open Original Internship Report PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-xs text-emerald-300">
            *Submitted to Department of Information Technology, SNIST Hyderabad
          </span>
        </div>
      </div>

      {/* Authors & Institutional Credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Student Authors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-emerald-800">
            <Users className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-slate-900">Project Researchers &amp; Authors</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'N. Prakeerthan Reddy', roll: '24311A1266', role: 'Student, III Year I Sem, B.Tech IT' },
              { name: 'K. Hemanth Kumar Reddy', roll: '24311A1272', role: 'Student, III Year I Sem, B.Tech IT' },
              { name: 'J. Akshith Patel', roll: '24311A1275', role: 'Student, III Year I Sem, B.Tech IT' },
            ].map((author, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{author.name}</div>
                  <div className="text-xs text-slate-500">{author.role}</div>
                </div>
                <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 text-emerald-900">
                  {author.roll}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Mentorship & Organization */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-800">
              <GraduationCap className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Academic &amp; Industry Guidance</h3>
            </div>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Internal Guide:</span> Mr. G. Nuthan Kumar, Assistant Professor, Dept of IT
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Internship Coordinator:</span> Mr. Punna Mahesh Kumar, Assistant Professor, Dept of IT
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Head of Department:</span> Dr. Sunil Bhutada, Professor &amp; HOD, Dept of IT
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Institution:</span> Sreenidhi Institute of Science and Technology (SNIST), Hyderabad
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <Award className="w-4 h-4 text-emerald-700" />
              Google for Developers / EduSkills AI-ML Internship
            </span>
            <span>2026-2027</span>
          </div>
        </div>

      </div>

      {/* 10-Step Implementation Architecture */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            10-Step Prototype Implementation Roadmap (from Report)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Step-by-step phased architecture implemented and demonstrated in this application:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {steps.map((st) => (
            <div key={st.num} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {st.num}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
