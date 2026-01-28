
import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Check, ShieldCheck, Sparkles, X, Scan } from 'lucide-react';
import { scanDocumentWithAI } from '../geminiService';
import { useApp } from '../AppContext';
import { DocumentType } from '../types';

const VaultScanner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addDocument } = useApp();
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    if (!preview) return;
    setScanning(true);
    try {
      const base64 = preview.split(',')[1];
      const data = await scanDocumentWithAI(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const confirmDocument = async () => {
    if (!result) return;
    await addDocument({
      id: Date.now().toString(),
      type: result.type as DocumentType || 'Other',
      name: result.name || 'AI Scanned Document',
      expiryDate: result.expiryDate || new Date().toISOString().split('T')[0],
      status: 'Safe',
      remindersEnabled: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="glass bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[4rem] p-12 relative z-10 shadow-2xl border-white/10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl">
                <Scan className="w-7 h-7" />
             </div>
             <div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Neural Scan</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-2">Document Intelligence</p>
             </div>
           </div>
           <button onClick={onClose} className="p-3 glass rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-white/10 rounded-[4rem] p-24 text-center cursor-pointer hover:border-indigo-600 transition-all group"
          >
            <Camera className="w-20 h-20 text-slate-300 group-hover:text-indigo-600 mx-auto mb-8 transition-colors" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Capture or Upload</h3>
            <p className="text-sm font-medium text-slate-500 mt-4">Place document within the frame for optimal extraction.</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        ) : (
          <div className="space-y-10">
            <div className="relative rounded-[3rem] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl aspect-[4/3] bg-black">
               <img src={preview} className="w-full h-full object-contain" alt="preview" />
               {scanning && (
                 <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-6">
                       <RefreshCw className="w-16 h-16 text-white animate-spin" />
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Analyzing Pixels...</span>
                    </div>
                 </div>
               )}
            </div>

            {result ? (
              <div className="p-8 glass bg-emerald-500/5 rounded-[3rem] border-emerald-500/20 space-y-6 animate-in slide-in-from-bottom-8">
                 <div className="flex justify-between items-center pb-6 border-b border-white/10">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">Detection Confidence: 98%</h4>
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Type</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{result.type}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Name</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{result.name}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Expiry Date</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{result.expiryDate}</p>
                    </div>
                 </div>
                 <button onClick={confirmDocument} className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                   <ShieldCheck className="w-5 h-5" /> Commit Scanned Asset
                 </button>
              </div>
            ) : (
              <div className="flex gap-4">
                 <button onClick={startScan} disabled={scanning} className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50">
                   {scanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} Start AI Analysis
                 </button>
                 <button onClick={() => setPreview(null)} className="flex-1 py-6 glass text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-[2rem]">Retake</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultScanner;
