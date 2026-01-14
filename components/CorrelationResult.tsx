
import React from 'react';
import { AnalysisResult } from '../types';

interface CorrelationResultProps {
  result: AnalysisResult | null;
  onClose: () => void;
}

export const CorrelationResult: React.FC<CorrelationResultProps> = ({ result, onClose }) => {
  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-emerald-600';
    if (score > 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBgColor = (score: number) => {
    if (score > 70) return 'bg-emerald-50 border-emerald-200';
    if (score > 40) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b bg-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Статистикалық талдау картасы</h2>
            <p className="text-slate-500 text-sm mt-1">SPSS бағдарламасы үшін әдістемелік нұсқаулық</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-2xl font-light">&times;</button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-8 space-y-10 overflow-y-auto overflow-x-hidden">
          
          {/* Main Feasibility Score */}
          <div className={`p-8 rounded-3xl border-2 text-center relative overflow-hidden ${getBgColor(result.probability)}`}>
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Зерттеу әлеуеті</p>
              <div className={`text-7xl font-black ${getScoreColor(result.probability)}`}>
                {result.probability}%
              </div>
              <p className="mt-4 font-bold text-slate-700">
                Маңыздылық деңгейі: <span className="bg-white/50 px-3 py-1 rounded-full border border-current/20 ml-2">{result.significanceLevel}</span>
              </p>
            </div>
          </div>

          {/* Suggested Methods Section (New) */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">Σ</span>
              Ұсынылатын талдау түрлері (SPSS)
            </h3>
            <div className="grid gap-4">
              {result.suggestedMethods.map((method, i) => (
                <div key={i} className="p-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h4 className="font-black text-indigo-700 text-lg">{method.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-indigo-100 text-indigo-600 rounded-md">SPSS нұсқаулығы</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{method.description}</p>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs font-mono text-slate-500 flex items-start gap-2">
                    <span className="text-indigo-400">➔</span> {method.spssInstruction}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reasoning */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm">💡</span> 
              Негіздеме
            </h3>
            <div className="text-slate-600 leading-relaxed bg-blue-50/30 p-6 rounded-2xl border border-blue-50 italic">
              "{result.reasoning}"
            </div>
          </section>

          {/* Potential Correlations */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center text-sm">🔗</span> 
              Гипотезалық байланыстар
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.potentialCorrelations.map((item, i) => (
                <span key={i} className="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100">
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm">🚀</span> 
              Жақсарту жолдары
            </h3>
            <div className="grid gap-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs">!</span>
                  <p className="text-slate-700 text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Action */}
        <div className="p-8 border-t bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">© Зерттеу көмекшісі • {new Date().getFullYear()}</p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};
