import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, RefreshCw, CameraOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from './ui/Button';

interface MouthCaptureProps {
  onCapture: (imageSrc: string, filename?: string) => void;
}

const MouthCapture: React.FC<MouthCaptureProps> = ({ onCapture }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setError(null);
    setPermissionDenied(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API is not supported by your browser environment. Please upload an image directly.');
      setIsStreaming(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
      } catch (firstErr: any) {
        if (firstErr?.name === 'OverconstrainedError' || firstErr?.name === 'ConstraintNotSatisfiedError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw firstErr;
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.warn('Camera access not granted or unavailable:', err?.name || err?.message || err);
      setIsStreaming(false);

      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError' || err?.message?.toLowerCase().includes('permission denied')) {
        setPermissionDenied(true);
        setError('Camera permission denied or blocked by browser preview settings. Please grant camera permission or upload a photo.');
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setError('No camera detected on this device. Please upload a photo instead.');
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
        setError('Camera is currently in use by another application. Close other apps using the camera and retry.');
      } else {
        setError('Unable to access camera feed. You can upload an oral snapshot photo directly.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (!preview) {
      startCamera();
    }
    return () => stopCamera();
  }, [preview]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setPreview(null);
    onCapture('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        onCapture(result, file.name);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-200 flex flex-col items-center justify-center shadow-inner">
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.video
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.img
              key="preview"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={preview}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
        
        {error && !preview && !isStreaming && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-slate-900/95 backdrop-blur-md text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3 shadow-lg">
              <CameraOff className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black tracking-tight text-white mb-1">
              {permissionDenied ? 'Camera Permission Denied' : 'Camera Unavailable'}
            </h4>
            <p className="text-xs text-slate-300 font-medium max-w-sm mb-5 leading-relaxed">
              {error}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button 
                size="sm" 
                variant="primary" 
                onClick={startCamera}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Retry Camera Access
              </Button>
              <Button 
                size="sm" 
                variant="accent" 
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Upload Photo
              </Button>
            </div>
            
            {permissionDenied && (
              <p className="text-[10px] text-slate-400 font-semibold mt-4 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Tip: Click the lock or camera icon in your browser URL bar to grant permission.</span>
              </p>
            )}
          </div>
        )}

        {!preview && isStreaming && (
          <div className="absolute top-4 left-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Live Stream</span>
            </motion.div>
          </div>
        )}
        
        <div className="absolute inset-x-8 inset-y-12 border-2 border-white/50 rounded-xl pointer-events-none flex items-center justify-center">
          <div className="w-full h-px bg-white/20"></div>
          <div className="absolute h-full w-px bg-white/20"></div>
          
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-md"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-md"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-md"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-md"></div>
        </div>

        {/* Professional Background Blur Focal Point Overlay */}
        {!preview && isStreaming && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              maskImage: 'radial-gradient(circle at center, transparent 30%, black 70%)',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 70%)',
            }}
          >
            {/* Focal Point Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 border-2 border-[#0EA5A8] rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-[#0EA5A8] rounded-full" />
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {preview ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={handleRetake}
            leftIcon={<RefreshCw className="w-5 h-5" />}
            className="w-full"
          >
            Retake Photo
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            glow={true}
            onClick={isStreaming ? captureImage : startCamera}
            leftIcon={isStreaming ? <Camera className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            className="w-full"
          >
            {isStreaming ? 'Capture Photo' : 'Request Camera Access'}
          </Button>
        )}

        <Button
          variant="accent"
          size="lg"
          glow={true}
          onClick={() => fileInputRef.current?.click()}
          leftIcon={<Upload className="w-5 h-5" />}
          className="w-full"
        >
          Upload Image
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default MouthCapture;
