
import React, { useState } from 'react';
import { Question, AnalysisResult, SurveyInput, ScaleType } from './types';
import { Button } from './components/Button';
import { CorrelationResult } from './components/CorrelationResult';
import { ScaleGuide } from './components/ScaleGuide';
import { analyzeSurveyCorrelation } from './services/geminiService';

type View = 'tool' | 'guide';

const App: React.FC = () => {
  const [view, setView] = useState<View>('tool');
  const [topic, setTopic] = useState('');
  const [scaleType, setScaleType] = useState<ScaleType>('likert');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    if (questions.length >= 15) return;
    setQuestions([...questions, { 
      id: Math.random().toString(36).substr(2, 9), 
      text: '' 
    }]);
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 2) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      setError('Зерттеу тақырыбын енгізіңіз');
      return;
    }
    
    const validQuestions = questions.filter(q => q.text.trim() !== '');
    if (validQuestions.length < 2) {
      setError('Кем дегенде 2 сұрақ енгізіңіз');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const input: SurveyInput = {
        topic,
        scaleType,
        questions: validQuestions.map(q => q.text)
      };
      const analysis = await analyzeSurveyCorrelation(input);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Талдау кезінде қате кетті');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (view === 'guide') {
    return <ScaleGuide onBack={() => setView('tool')} />;
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b py-10 mb-12 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Ғылыми әдістемелік құрал
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Статистикалық Талдау <br/>
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Болжаушы & Кеңесші</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-6">
            Сауалнамаңызды SPSS-те талдау алдында оның әлеуетін тексеріңіз. 
            AI сізге ең сәйкес тесттерді ұсынады.
          </p>
          <button 
            onClick={() => setView('guide')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95"
          >
            <span className="text-lg">📘</span> Шкалалар туралы анықтама (Мысалдармен)
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-12 border border-slate-100">
          
          {/* Topic Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                Зерттеу тақырыбы немесе гипотезасы
              </label>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Мысалы: Студенттердің эмоционалды интеллектісі мен конфликтілерді шешу стратегиялары арасындағы байланыс"
              className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none h-32 text-lg font-semibold text-black shadow-inner placeholder:text-slate-400"
            />
          </div>

          {/* Single Scale Selection Section */}
          <div className="mb-12 p-6 md:p-8 bg-indigo-50/30 rounded-[2rem] border-2 border-indigo-50/50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <label className="text-sm font-black text-indigo-400 uppercase tracking-widest">
                  Өлшем шкаласын таңдаңыз
                </label>
              </div>
              <button onClick={() => setView('guide')} className="text-xs font-bold text-indigo-600 hover:underline">Қайсысын таңдау керек? 🤔</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'likert', label: 'Ликерт шкаласы', desc: 'Корреляцияға ең қолайлы' },
                { id: 'dichotomous', label: 'Дихотомиялық', desc: 'Иә/Жоқ (0/1)' },
                { id: 'ordinal', label: 'Реттік (Ordinal)', desc: 'Төменнен жоғарыға' },
                { id: 'nominal', label: 'Атаулы (Nominal)', desc: 'Топтар мен санаттар' },
                { id: 'ratio', label: 'Сандық (Scale)', desc: 'Нақты өлшемдер' }
              ].map((scale) => (
                <button
                  key={scale.id}
                  onClick={() => setScaleType(scale.id as ScaleType)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                    scaleType === scale.id 
                    ? 'border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-lg' 
                    : 'border-white bg-white/50 hover:bg-white hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className={`font-black text-sm ${scaleType === scale.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {scale.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">{scale.desc}</div>
                  {scaleType === scale.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                  Негізгі сұрақтар немесе айнымалылар
                </label>
              </div>
              <div className="px-3 py-1 bg-white border border-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase">
                {questions.length} / 15
              </div>
            </div>
            
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div key={q.id} className="flex gap-3 items-center group animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestionText(q.id, e.target.value)}
                      placeholder={`${index + 1}-сұрақты жазыңыз...`}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-all font-semibold text-black shadow-sm placeholder:text-slate-400"
                    />
                  </div>
                  <button 
                    onClick={() => removeQuestion(q.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={addQuestion}
              className="mt-6 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-lg">+</span> Жаңа айнымалы қосу
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-4 animate-bounce">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">!</span>
              <span className="font-bold text-sm">{error}</span>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            className="w-full py-7 text-xl rounded-[1.5rem] shadow-2xl shadow-indigo-200 bg-slate-900 text-white hover:bg-black transition-all active:scale-[0.97]"
          >
            {isAnalyzing ? 'Талдау стратегиясы жасалуда...' : 'Статистикалық әлеуетті есептеу'}
          </Button>
        </div>
      </main>

      {/* Result Modal */}
      <CorrelationResult 
        result={result} 
        onClose={() => setResult(null)} 
      />
    </div>
  );
};

export default App;
