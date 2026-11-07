import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, RefreshCw, X, CheckCircle2, ShieldAlert, Barcode } from 'lucide-react';
import { SAMPLE_LABELS } from '../data/sampleLabels';
import { SampleLabel } from '../types';

interface ScannerModalProps {
  onImageSelected: (base64Image: string, barcode?: string, sampleName?: string) => void;
  isProcessing: boolean;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  onImageSelected,
  isProcessing,
}) => {
  const [activeMode, setActiveMode] = useState<'samples' | 'camera' | 'upload' | 'barcode'>('samples');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting or switching mode
  useEffect(() => {
    if (activeMode !== 'camera' && streamRef.current) {
      stopCamera();
    }
  }, [activeMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check permissions or upload a label photo.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    onImageSelected(dataUrl, undefined, 'Camera Live Capture');
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, undefined, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleLabel) => {
    // Convert SVG data URL to a canvas JPEG for consistent processing
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 800;
      canvas.height = img.height || 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpegBase64 = canvas.toDataURL('image/jpeg', 0.92);
        onImageSelected(jpegBase64, sample.barcode, sample.name);
      } else {
        onImageSelected(sample.imageUrl, sample.barcode, sample.name);
      }
    };
    img.src = sample.imageUrl;
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    // Find sample matching this barcode or generate standard lookup canvas
    const matched = SAMPLE_LABELS.find((s) => s.barcode === barcodeInput.trim());
    if (matched) {
      handleSampleSelect(matched);
    } else {
      // Create minimal barcode lookup canvas image
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 600, 300);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`Barcode Input: ${barcodeInput.trim()}`, 40, 100);
        ctx.font = '16px Arial';
        ctx.fillText('Authorized Agricultural Registry Query', 40, 140);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onImageSelected(dataUrl, barcodeInput.trim(), `Barcode: ${barcodeInput}`);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
      
      {/* Mode Selector Tabs */}
      <div className="flex border-b border-emerald-100 bg-emerald-50/50 p-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveMode('samples')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            activeMode === 'samples'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-800 hover:bg-emerald-100/70'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>One-Click Test Labels</span>
          <span className="text-xs bg-emerald-700/60 text-white px-2 py-0.5 rounded-full font-bold">5 Included</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('camera');
            startCamera();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            activeMode === 'camera'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-800 hover:bg-emerald-100/70'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera Scan</span>
        </button>

        <button
          onClick={() => setActiveMode('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            activeMode === 'upload'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-800 hover:bg-emerald-100/70'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
        </button>

        <button
          onClick={() => setActiveMode('barcode')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            activeMode === 'barcode'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-800 hover:bg-emerald-100/70'
          }`}
        >
          <Barcode className="w-4 h-4" />
          <span>Barcode / CIB&amp;RC Code</span>
        </button>
      </div>

      {/* Tab 1: One-Click Test Labels */}
      {activeMode === 'samples' && (
        <div className="p-5 sm:p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <span>Select an Authorized Farm Product Label to Scan</span>
            </h3>
            <p className="text-sm text-slate-600">
              Click any sample label below to test extraction, toxicity warnings, multilingual explanation, and voice readout immediately:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_LABELS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => !isProcessing && handleSampleSelect(sample)}
                className={`group relative bg-slate-50 hover:bg-emerald-50/50 rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                  sample.isChallenging
                    ? 'border-amber-300 hover:border-amber-500 bg-amber-50/30'
                    : 'border-slate-200 hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                {sample.isChallenging && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Safety Gate Test</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                        sample.toxicityBand === 'Red'
                          ? 'bg-red-500 ring-2 ring-red-200'
                          : sample.toxicityBand === 'Yellow'
                          ? 'bg-yellow-400 ring-2 ring-yellow-200'
                          : sample.toxicityBand === 'Blue'
                          ? 'bg-blue-500 ring-2 ring-blue-200'
                          : 'bg-green-500 ring-2 ring-green-200'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {sample.toxicityBand} Band • {sample.type}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {sample.name}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 text-[11px]">Barcode: {sample.barcode}</span>
                  <span className="font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                    Scan Now →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Live Camera Scan */}
      {activeMode === 'camera' && (
        <div className="p-5 sm:p-6 flex flex-col items-center">
          <div className="w-full max-w-xl relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border-2 border-dashed border-emerald-500">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Target Guide Reticle */}
                <div className="absolute inset-8 pointer-events-none border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400" />
                    <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400" />
                  </div>
                  
                  {/* Scan line animation */}
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-scan-line" />

                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400" />
                    <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="bg-emerald-950/80 text-emerald-200 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                    Center the pesticide bottle or seed packet label inside the frame
                  </span>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-300">
                <Camera className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="font-semibold text-white">Camera is not running</p>
                {cameraError ? (
                  <p className="text-xs text-rose-300 mt-2 max-w-sm">{cameraError}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Click Start Camera to begin scanning</p>
                )}
                <button
                  onClick={startCamera}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Start Camera
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {isCameraActive && (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={captureCameraFrame}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>Capture &amp; Analyze</span>
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Practical Retake Guidance Note */}
          <div className="mt-5 w-full max-w-xl bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Field Scanning Tips:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-emerald-800">
                <li>Avoid direct sun reflection / glare on plastic bottle curvature</li>
                <li>Make sure the Toxicity Band (red/yellow/blue/green diamond) and expiry date are visible</li>
                <li>Hold phone 15–20 cm away and keep hand steady</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Upload Photo */}
      {activeMode === 'upload' && (
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              Drag &amp; drop your farm product label image here
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse from your device gallery (supports JPG, PNG, WEBP)
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Barcode / CIB&RC Code Search */}
      {activeMode === 'barcode' && (
        <div className="p-6 max-w-xl mx-auto">
          <form onSubmit={handleBarcodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="barcode-field" className="block text-sm font-bold text-slate-800 mb-1">
                Enter Product Barcode, CIR Reg No., or Batch Code
              </label>
              <div className="relative">
                <input
                  id="barcode-field"
                  type="text"
                  placeholder="e.g. 8901234567890 or CIR-4521/2018"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium font-mono"
                />
                <Barcode className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !barcodeInput.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-sm text-sm transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Search Authorized Registry</span>
            </button>
          </form>

          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Supported Test Barcodes:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {SAMPLE_LABELS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setBarcodeInput(s.barcode);
                    handleSampleSelect(s);
                  }}
                  className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] hover:border-emerald-500 text-slate-700"
                >
                  {s.barcode} ({s.name.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
