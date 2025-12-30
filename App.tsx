import React, { useState, useEffect, useRef } from 'react';
import { UserData, CalculationResult } from './types';
import { calculateResults } from './utils/calculations';
import { toPng } from 'https://esm.sh/html-to-image@1.11.11';

const ConfettiEffect = () => {
  const [pieces, setPieces] = useState<any[]>([]);
  useEffect(() => {
    const newPieces = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 1 + 's',
      color: ['#fbb6ce', '#ff8a65', '#d53f8c', '#000000'][Math.floor(Math.random() * 4)],
      duration: (Math.random() * 0.8 + 0.8) + 's'
    }));
    setPieces(newPieces);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((p) => (
        <div 
          key={p.id}
          className="confetti"
          style={{ 
            left: p.left, 
            backgroundColor: p.color, 
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  );
};

const IlluminatiWatermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.006] z-0 select-none">
    <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5 L95 85 L5 85 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="50" cy="55" rx="20" ry="12" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="55" r="5" fill="currentColor" />
    </svg>
  </div>
);

const ErrorMessage = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">
      This field is required
    </p>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'FORM' | 'CELEBRATING' | 'RESULT'>('FORM');
  const [showSharePopup, setShowSharePopup] = useState(false);
  const fullResultRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  const [data, setData] = useState<Partial<UserData>>({
    age: undefined,
    startingAgeRange: undefined,
    peakStartAge: undefined,
    peakEndAge: undefined,
    peakFreqLevel: undefined,
    currentFreq: undefined,
    noFapBreaksRange: undefined,
    multiDayActive: false,
    multiDayCount: 0,
    relationshipImpactMonths: undefined,
    stressPhaseBoosterLevel: undefined,
    gender: undefined,
    fantasyStar: 'Innocent 👀',
    longestStreak: undefined
  });
  
  const [results, setResults] = useState<CalculationResult | null>(null);

  const isFormValid = !!(
    data.age !== undefined &&
    data.gender !== undefined &&
    data.startingAgeRange !== undefined &&
    data.peakStartAge !== undefined &&
    data.peakEndAge !== undefined &&
    data.peakFreqLevel !== undefined &&
    data.currentFreq !== undefined &&
    data.noFapBreaksRange !== undefined &&
    data.relationshipImpactMonths !== undefined &&
    data.stressPhaseBoosterLevel !== undefined &&
    data.longestStreak !== undefined
  );

  const handleSubmit = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    const res = calculateResults(data as UserData);
    setResults(res);
    setView('CELEBRATING');
    setTimeout(() => {
      setView('RESULT');
      window.scrollTo(0, 0);
    }, 2000);
  };

  const handleDownloadImage = async () => {
    const element = fullResultRef.current;
    if (!element) return;
    
    setIsCapturing(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const pixelRatio = Math.max(window.devicePixelRatio || 1, 2);

      const dataUrl = await toPng(element, { 
        cacheBust: true, 
        width: width,
        height: height,
        pixelRatio: pixelRatio,
        style: {
          margin: '0',
          padding: '0',
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#fff6f1', 
          transform: 'none',
          boxSizing: 'border-box',
        },
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return !node.classList.contains('no-export');
          }
          return true;
        }
      });

      const link = document.createElement('a');
      link.download = `papcounter-grind-report-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate high-res report. Please try again! 💀');
    } finally {
      setIsCapturing(false);
    }
  };

  const getBadgeReaction = (count: number) => {
    if (count >= 1000) return "You're not human. This is a legendary level addiction 🤯";
    if (count >= 800) return "Certified Danger to Humanity 😈";
    if (count >= 400) return "Elite Soldier of Degeneracy 🫡";
    return "You still have hope, warrior 🛡️";
  };

  const getFieldHighlight = (isMissing: boolean) => {
    return isMissing && showErrors ? 'border-red-500 ring-4 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-black';
  };

  if (view === 'CELEBRATING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white fade-in relative px-6 text-center">
        <ConfettiEffect />
        <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Analyzing your grind... 💥</h1>
        <p className="text-gray-500 font-bold text-lg">Running biological math on those deleted history logs... 🧐</p>
      </div>
    );
  }

  if (view === 'RESULT' && results) {
    return (
      <div className="min-h-screen bg-peach-soft relative overflow-x-hidden">
        <ConfettiEffect />
        
        {showSharePopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 no-export">
            <div className="bg-white w-full max-w-lg rounded-[40px] p-6 md:p-10 flex flex-col items-center relative shadow-2xl overflow-hidden max-h-[90vh]">
              <button 
                onClick={() => setShowSharePopup(false)}
                className="absolute top-6 right-8 text-gray-400 hover:text-black font-black text-2xl"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2 leading-tight">
                  Confess your sins to the world 😈
                </h2>
                <p className="text-gray-500 text-sm font-bold px-4 leading-relaxed">
                  Share your results on Instagram and let your friends judge you.
                </p>
              </div>

              <div className="w-full bg-gray-50 rounded-3xl p-4 overflow-y-auto mb-8 border-2 border-dashed border-gray-200" style={{ maxHeight: '400px' }}>
                <div className="origin-top scale-[0.6] w-[166.66%]" style={{ pointerEvents: 'none' }}>
                  <div className="text-center mb-6">
                    <h1 className={`text-4xl font-black uppercase tracking-tighter leading-none mb-1 ${results.rankColor}`}>
                      {results.rank}
                    </h1>
                    <div className="text-3xl">{results.rankBadge}</div>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center mb-6">
                    <p className="text-gray-400 uppercase text-[10px] font-black tracking-[0.4em] mb-2">LIFETIME SCORE</p>
                    <div className="text-7xl font-black text-gray-900">{results.lifetimeCount}</div>
                    <div className="bg-peach-soft p-4 mt-6 rounded-2xl border-2 border-black italic font-bold text-gray-900 text-sm">
                      "{results.quote}"
                    </div>
                  </div>
                  <div className="bg-red-600 p-8 rounded-[40px] border-4 border-black text-center">
                    <h3 className="text-white uppercase font-black tracking-widest text-[10px] mb-2">SOLDIERS LOST 👶</h3>
                    <div className="text-4xl font-black text-white">{results.potentialBabiesWasted}</div>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={handleDownloadImage}
                  disabled={isCapturing}
                  className="w-full bg-black text-white font-black py-5 rounded-[25px] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-tighter text-lg shadow-xl disabled:opacity-50"
                >
                  {isCapturing ? 'GENERATING...' : '📥 DOWNLOAD PNG'}
                </button>
                <button 
                  onClick={() => setShowSharePopup(false)}
                  className="w-full bg-gray-100 text-gray-500 font-black py-4 rounded-[25px] hover:text-black transition-all uppercase tracking-tighter text-sm"
                >
                  BACK TO STATS
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={fullResultRef} className="max-w-xl mx-auto p-4 md:p-12 bg-peach-soft flex flex-col items-center w-full min-h-full">
          <div className="text-center w-full flex flex-col items-center">
             <div className="inline-block px-6 py-1.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
               YOUR PRIVATE GRIND RESUME
             </div>
             
             <h1 className={`text-5xl font-black uppercase tracking-tighter leading-none mb-2 ${results.rankColor} text-center`}>
               {results.rank}
             </h1>
             
             <div className="text-4xl mb-6 text-center">{results.rankBadge}</div>
             
             <div className="bg-black text-white p-6 rounded-[35px] border-4 border-pink-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center mb-8 w-full flex flex-col items-center">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2">OFFICIAL COMMUNITY BADGE</p>
               <p className="text-lg md:text-xl font-black italic px-4 text-white">
                 "{getBadgeReaction(results.lifetimeCount)}"
               </p>
             </div>
          </div>

          <div className="space-y-6 w-full max-w-md flex flex-col items-center">
            <section className="bg-white p-8 rounded-[50px] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center relative w-full flex flex-col items-center">
               <p className="text-gray-400 uppercase text-[10px] font-black tracking-[0.4em] mb-4">LIFETIME HONOR SCORE</p>
               <div className="text-8xl font-black text-gray-900 leading-none mb-6">
                 {results.lifetimeCount}
               </div>
               
               <div className="inline-block px-5 py-2 bg-gray-100 rounded-2xl text-sm font-black text-gray-800 mb-8 border-2 border-black">
                 You out-grinded {results.comparisonPercent}% of the world 📈
               </div>

               <div className="bg-peach-soft p-6 rounded-3xl border-2 border-black italic font-bold text-gray-900 leading-relaxed text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
                 "{results.quote}"
               </div>
            </section>

            <section className="bg-red-600 p-8 rounded-[50px] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center w-full flex flex-col items-center">
               <h3 className="text-white uppercase font-black tracking-widest text-[10px] mb-3">POTENTIAL BABIES WASTED 👶</h3>
               <div className="text-6xl font-black text-white mb-2 leading-none">{results.potentialBabiesWasted}</div>
               <p className="text-white font-bold opacity-90 text-[11px] px-2 leading-tight">Enough to conquer galaxies. Rest in power, soldiers. 😳</p>
            </section>

            <div className="flex gap-4 pb-2 w-full justify-center">
              <div className="bg-white p-6 rounded-3xl border-2 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 min-w-0">
                 <p className="text-gray-400 text-[9px] font-black uppercase mb-1">ACTIVE YRS</p>
                 <div className="text-3xl font-black text-gray-900">{results.activeYears}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border-2 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 min-w-0">
                 <p className="text-gray-400 text-[9px] font-black uppercase mb-1">AVG GAP</p>
                 <div className="text-3xl font-black text-gray-900">{results.gapDays} Days</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3 no-export w-full">
              <button 
                onClick={() => setShowSharePopup(true)}
                className="w-full bg-black text-white font-black py-6 rounded-[35px] shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-tighter text-xl"
              >
                🔥 SHARE THE SHAME
              </button>

              <div className="mt-4 space-y-4">
                <p className="text-center font-black text-sm text-gray-800 uppercase tracking-widest">
                  WHY YOU NEED TO CLICK THESE 👇
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://prosons.gumroad.com/l/rbeui" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="neon-btn-purple py-5 rounded-[25px] font-black text-center text-sm uppercase tracking-tighter"
                  >
                    Beast Mode
                  </a>
                  <a 
                    href="https://prosons.gumroad.com/l/boytoman" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="neon-btn-cyan py-5 rounded-[25px] font-black text-center text-sm uppercase tracking-tighter"
                  >
                    Fix Your Brain
                  </a>
                </div>
              </div>

              <button onClick={() => setView('FORM')} className="text-gray-400 text-xs font-black uppercase tracking-widest hover:text-black py-2 mt-4 pb-12">
                RESTART FROM SCRATCH 🫧
              </button>
            </div>
            
            <div className="mt-8 text-center pb-6 border-t-2 border-black/5 pt-12 w-full flex flex-col items-center">
              <p className="text-gray-500 text-[12px] font-black uppercase tracking-[0.25em] italic text-center leading-tight">
                “TURNING IDEAS INTO IMPACT, AND IMPACT INTO RESULTS”
              </p>
              
              <div className="mt-8 flex justify-center no-export">
                <a 
                  href="https://discord.gg/BzADpApU" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="neon-btn-gold px-10 py-4 rounded-full font-black text-xs uppercase tracking-tighter inline-flex items-center gap-2"
                >
                  ⚡ JOIN THE TRIBE — DISCORD
                </a>
              </div>

              <p className="text-[10px] text-gray-200 font-black uppercase tracking-widest mt-8 opacity-30 no-export">PAPCOUNTER.XYZ</p>

              <div className={`mt-10 flex-col items-center w-full ${isCapturing ? 'flex' : 'hidden'}`}>
                <div className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">
                  <span className="text-pink-500">PAP</span> <span className="text-black">COUNTER</span>
                </div>
                <div className="text-4xl">💀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {view === 'FORM' && <div className="h-[2px] bg-black w-full" />}
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-12 items-start">
          <div className="hidden md:flex flex-col gap-6 order-1"></div>
          <div className="col-span-1 md:col-span-2 text-center space-y-8 order-2">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                PAP <br/>
                <span className="text-pink-500">COUNTER</span> <br/>
                💀
              </h1>
              <p className="text-lg md:text-xl font-bold text-gray-800 leading-tight max-w-md mx-auto">
                "The internet's most brutally honest habit tracker… turning your guilty pleasure into a global scoreboard."
              </p>
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                Discover how ‘disciplined’ you really are… or how dangerous you are to humanity.
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[60px] border-4 border-black shadow-[15px_15px_0px_0px_rgba(255,138,101,0.2)] text-left relative overflow-hidden">
              <IlluminatiWatermark />
              <div className="relative z-10">
                <p className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-8 font-bold">
                  Salary has a record, grades have a record... <br/>
                  But what about that <span className="text-black underline decoration-pink-500 underline-offset-4">Private Resume</span> only you know about? 😎
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.3em]">INSIDE THE REPORT:</h3>
                  <ul className="space-y-3 text-lg font-bold text-gray-800">
                    <li className="flex items-center gap-4">
                      <span className="bg-pink-100 p-2 rounded-xl border-2 border-black">🏆</span> <span>Lifetime session math</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="bg-pink-100 p-2 rounded-xl border-2 border-black">📈</span> <span>Stress era impacts</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="bg-pink-100 p-2 rounded-xl border-2 border-black">💀</span> <span>Potential Babies Lost</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-6 order-3"></div>
        </div>

        <div className="max-w-xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-[60px] border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <IlluminatiWatermark />
          <div className="relative z-10">
            <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest -mt-4 mb-2">
              This calculator is built for fun, curiosity and chaos — enjoy responsibly 😈
            </p>
            <section className="space-y-8">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setData({...data, gender: 'Boys'}); setShowErrors(false); }}
                    className={`py-4 rounded-[25px] font-black transition-all text-md shadow-sm border-2 ${data.gender === 'Boys' ? 'bg-black text-white border-black' : (data.gender === undefined && showErrors ? 'border-red-500 ring-2 ring-red-500/10' : 'bg-gray-50 text-gray-400 border-gray-100')}`}
                  >
                    BOYS 👦
                  </button>
                  <button 
                    onClick={() => { setData({...data, gender: 'Girls'}); setShowErrors(false); }}
                    className={`py-4 rounded-[25px] font-black transition-all text-md shadow-sm border-2 ${data.gender === 'Girls' ? 'bg-black text-white border-black' : (data.gender === undefined && showErrors ? 'border-red-500 ring-2 ring-red-500/10' : 'bg-gray-50 text-gray-400 border-gray-100')}`}
                  >
                    GIRLS 👧
                  </button>
                </div>
                <ErrorMessage show={data.gender === undefined && showErrors} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">How old are you right now?</label>
                  <span className="text-xl font-black">{data.age ?? '--'}</span>
                </div>
                <div className={`p-2 rounded-2xl transition-all ${data.age === undefined && showErrors ? 'ring-2 ring-red-500/20' : ''}`}>
                  <input 
                    type="range" min="16" max="50" step="1" 
                    value={data.age ?? 16}
                    onChange={(e) => { setData({...data, age: parseInt(e.target.value)}); setShowErrors(false); }}
                    className="w-full accent-black h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <ErrorMessage show={data.age === undefined && showErrors} />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest text-left block leading-tight mb-1">When did you first start masturbating?</label>
                <select 
                  value={data.startingAgeRange ?? ""}
                  onChange={(e) => { setData({...data, startingAgeRange: e.target.value}); setShowErrors(false); }}
                  className={`w-full bg-gray-50 border-2 p-3 rounded-2xl font-black text-md appearance-none transition-all ${getFieldHighlight(data.startingAgeRange === undefined)}`}
                >
                  <option value="" disabled>Select...</option>
                  {['10–11', '12–13', '14–15', '16+'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <ErrorMessage show={data.startingAgeRange === undefined && showErrors} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-tight block mb-1">At what age did your habit become MOST frequent?</label>
                  <select 
                    value={data.peakStartAge ?? ""}
                    onChange={(e) => { setData({...data, peakStartAge: parseInt(e.target.value)}); setShowErrors(false); }}
                    className={`w-full bg-gray-50 border-2 p-3 rounded-2xl font-black text-md appearance-none transition-all ${getFieldHighlight(data.peakStartAge === undefined)}`}
                  >
                    <option value="" disabled>Select...</option>
                    {[12, 13, 14, 15, 16, 17, 18, 19, 20].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <ErrorMessage show={data.peakStartAge === undefined && showErrors} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-tight block mb-1">At what age did your peak habit phase end?</label>
                  <select 
                    value={data.peakEndAge ?? ""}
                    onChange={(e) => { setData({...data, peakEndAge: parseInt(e.target.value)}); setShowErrors(false); }}
                    className={`w-full bg-gray-50 border-2 p-3 rounded-2xl font-black text-md appearance-none transition-all ${getFieldHighlight(data.peakEndAge === undefined)}`}
                  >
                    <option value="" disabled>Select...</option>
                    {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <ErrorMessage show={data.peakEndAge === undefined && showErrors} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-tight block mb-1 text-left">During your worst phase, how many times per week did you masturbate on average?</label>
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl transition-all ${data.peakFreqLevel === undefined && showErrors ? 'ring-2 ring-red-500/20' : ''}`}>
                  {['2–3 times', '4–6 times', '7–10 times', '10+ (beast mode 😭)'].map(v => (
                    <button
                      key={v}
                      onClick={() => { setData({...data, peakFreqLevel: v}); setShowErrors(false); }}
                      className={`p-3 rounded-xl font-bold border-2 text-xs transition-all ${data.peakFreqLevel === v ? 'bg-black text-white border-black' : (data.peakFreqLevel === undefined && showErrors ? 'border-red-500' : 'bg-white text-gray-400 border-gray-100')}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <ErrorMessage show={data.peakFreqLevel === undefined && showErrors} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-left">
                  <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">How many times per week do you currently masturbate?</label>
                  <span className="text-xl font-black">{data.currentFreq ?? '--'}</span>
                </div>
                <div className={`p-2 rounded-2xl transition-all ${data.currentFreq === undefined && showErrors ? 'ring-2 ring-red-500/20' : ''}`}>
                  <input 
                    type="range" min="0" max="10" step="1" 
                    value={data.currentFreq ?? 0}
                    onChange={(e) => { setData({...data, currentFreq: parseInt(e.target.value)}); setShowErrors(false); }}
                    className="w-full accent-pink-500 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <ErrorMessage show={data.currentFreq === undefined && showErrors} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-left">
                  <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">What is your longest NoFap streak?</label>
                  <span className="text-xl font-black">{data.longestStreak ?? '--'}</span>
                </div>
                <div className={`p-2 rounded-2xl transition-all ${data.longestStreak === undefined && showErrors ? 'ring-2 ring-red-500/20' : ''}`}>
                  <input 
                    type="range" min="0" max="365" step="1" 
                    value={data.longestStreak ?? 0}
                    onChange={(e) => { setData({...data, longestStreak: parseInt(e.target.value)}); setShowErrors(false); }}
                    className="w-full accent-black h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <ErrorMessage show={data.longestStreak === undefined && showErrors} />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Total time spent on NoFap breaks throughout your life</label>
                <select 
                  value={data.noFapBreaksRange ?? ""}
                  onChange={(e) => { setData({...data, noFapBreaksRange: e.target.value}); setShowErrors(false); }}
                  className={`w-full bg-gray-50 border-2 p-3 rounded-2xl font-black text-md appearance-none transition-all ${getFieldHighlight(data.noFapBreaksRange === undefined)}`}
                >
                  <option value="" disabled>Select...</option>
                  {['Hardly any breaks (0–50 days)', 'Few breaks (50–150 days)', 'Quite a lot (150–300 days)', 'Legendary Monk (300+ days)'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <ErrorMessage show={data.noFapBreaksRange === undefined && showErrors} />
              </div>

              <div className="space-y-4 bg-gray-50 p-6 rounded-[35px] border-2 border-black">
                <div className="flex items-center justify-between text-left">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-widest leading-tight">Total days you went full demon mode 😈</label>
                  <button 
                    onClick={() => setData({...data, multiDayActive: !data.multiDayActive})}
                    className={`w-14 h-7 rounded-full relative transition-colors ${data.multiDayActive ? 'bg-black' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${data.multiDayActive ? 'translate-x-7' : ''}`}></div>
                  </button>
                </div>
                {data.multiDayActive && (
                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-left">
                      <label className="text-[10px] font-black text-gray-400">0 to 500 days</label>
                      <span className="text-md font-black">{data.multiDayCount} Days</span>
                    </div>
                    <input 
                      type="range" min="0" max="500" step="1" 
                      value={data.multiDayCount}
                      onChange={(e) => setData({...data, multiDayCount: parseInt(e.target.value)})}
                      className="w-full accent-black h-1.5"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Total time in a relationship</label>
                <select 
                  value={data.relationshipImpactMonths ?? ""}
                  onChange={(e) => { setData({...data, relationshipImpactMonths: parseInt(e.target.value)}); setShowErrors(false); }}
                  className={`w-full bg-gray-50 border-2 p-3 rounded-2xl font-black text-md appearance-none transition-all ${getFieldHighlight(data.relationshipImpactMonths === undefined)}`}
                >
                  <option value="" disabled>Select...</option>
                  <option value="0">Never been in relationship 😭</option>
                  <option value="6">A few months total</option>
                  <option value="18">1–2 years total</option>
                  <option value="36">3+ years total</option>
                </select>
                <ErrorMessage show={data.relationshipImpactMonths === undefined && showErrors} />
              </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Stress Phase Spikes</label>
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl transition-all ${data.stressPhaseBoosterLevel === undefined && showErrors ? 'ring-2 ring-red-500/20' : ''}`}>
                  {['Nope, normal life', 'Few stress phases', 'Many stress phases', 'Bro I lived in chaos 💀'].map(v => (
                    <button
                      key={v}
                      onClick={() => { setData({...data, stressPhaseBoosterLevel: v}); setShowErrors(false); }}
                      className={`p-3 rounded-xl font-bold border-2 text-[10px] leading-tight transition-all ${data.stressPhaseBoosterLevel === v ? 'bg-black text-white border-black' : (data.stressPhaseBoosterLevel === undefined && showErrors ? 'border-red-500' : 'bg-white text-gray-400 border-gray-100')}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <ErrorMessage show={data.stressPhaseBoosterLevel === undefined && showErrors} />
              </div>
            </section>

            <div className="pt-4 text-center relative">
              {showErrors && !isFormValid && (
                <div className="absolute -top-12 left-0 right-0 z-20">
                  <div className="bg-red-500 text-white text-[10px] font-black py-2 px-4 rounded-full shadow-lg inline-block animate-bounce uppercase tracking-widest">
                    Please complete all required fields ⚠️
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleSubmit}
                className={`w-full bg-black text-white font-black py-7 rounded-[35px] shadow-2xl transition-all tracking-tight text-2xl uppercase ${!isFormValid ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
              >
                GENERATE MY GRIND REPORT 🤝
              </button>
              
              <p className="text-[11px] font-bold text-gray-400 mt-2 italic uppercase tracking-wider">
                Fill the form for more accurate answer
              </p>
              
              <p className="text-center text-gray-500 text-xs font-bold mt-4">
                Get up to 90%+ accurate estimate based on your real-life habit data 📊
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-20 text-center px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
            The Unfiltered Legend 😂
          </h2>
          <div className="bg-white p-10 rounded-[60px] border-4 border-black text-left space-y-6 shadow-[10px_10px_0px_0px_rgba(255,138,101,0.2)]">
            <p className="text-gray-800 font-bold leading-relaxed italic text-xl">
              "Every legend has a secret history. The grind, the sweat, the deleted history logs... it's time to face the math. 😭. <br/>
              Whether it was boredom, curiosity, or just another Tuesday... the numbers don't lie. 🤣"
            </p>
            <p className="text-gray-600 text-md leading-relaxed font-medium">
              We built this tool so you can track your <span className="text-black font-black">"active service"</span> records. 
              No judgment here, just raw analytics. In the digital age, data is everything—even if that data is just your solo-trip frequency! 😎
            </p>
          </div>
        </div>
        
        <footer className="mt-20 text-center text-gray-400 text-[10px] leading-relaxed max-w-sm mx-auto pb-12 uppercase tracking-widest font-black">
          Don't sweat it. Everyone does it. We just put a number on it. <br/>
          Share the link → Roast Your Friends → Go Viral 😎
        </footer>
      </div>
    </div>
  );
};

export default App;
