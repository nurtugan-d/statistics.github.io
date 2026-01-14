
import React from 'react';

interface ScaleGuideProps {
  onBack: () => void;
}

export const ScaleGuide: React.FC<ScaleGuideProps> = ({ onBack }) => {
  const scales = [
    {
      id: 'likert',
      title: 'Ликерт шкаласы (Likert Scale)',
      desc: 'Зерттеулердегі ең қуатты шкала. Ол реттік болғанымен, практикада көбіне сандық дерек ретінде қарастырылады. Сондықтан бұл шкалалар арасында корреляцияны (Пирсон немесе Спирмен) есептеу өте тиімді және ғылыми жағынан маңызды.',
      example: '«Мен өз жұмысыма қанағаттанамын» (1-Мүлдем келіспеймін ... 5-Толық келісемін)',
      visual: (
        <div className="mt-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Корреляция:</span>
             <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm">r = 0.82</span>
                <span className="text-[10px] text-slate-400">Күшті байланыс</span>
             </div>
          </div>
          <div className="flex gap-2 items-end h-20 relative z-10">
            {[20, 35, 55, 75, 95].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-1000"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent"></div>
        </div>
      ),
      stats: 'Корреляция (Pearson/Spearman), ANOVA, Alpha Cronbach'
    },
    {
      id: 'ratio',
      title: 'Сандық шкала (Ratio/Scale)',
      desc: 'Нақты сандармен өрнектелетін шкала. Барлық математикалық амалдар мен ең күрделі корреляциялық және регрессиялық модельдерді қолдануға болады.',
      example: 'Сіздің жасыңыз немесе тесттен жинаған нақты балыңыз (0-100)',
      visual: (
        <div className="w-full h-10 bg-slate-100 rounded-xl mt-4 relative overflow-hidden flex items-center px-2">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div className="h-full bg-indigo-500 w-[78%]"></div>
          </div>
          <span className="absolute right-4 top-1 text-[10px] font-black text-slate-700">78.0</span>
        </div>
      ),
      stats: 'Барлық корреляция түрлері, Регрессия'
    },
    {
      id: 'nominal',
      title: 'Атаулы шкала (Nominal)',
      desc: 'Деректерді тек санаттарға бөледі. Мұнда сандардың математикалық мағынасы жоқ. Корреляция орнына "Ассоциация" талдауы қолданылады.',
      example: 'Сіздің мамандығыңыз? (Медицина, Заң, IT, Педагогика)',
      visual: (
        <div className="flex gap-3 mt-4">
          <div className="px-4 py-2 bg-blue-100 rounded-xl text-[10px] font-bold text-blue-700 shadow-sm border border-blue-200">Топ А</div>
          <div className="px-4 py-2 bg-purple-100 rounded-xl text-[10px] font-bold text-purple-700 shadow-sm border border-purple-200">Топ Б</div>
        </div>
      ),
      stats: 'Хи-квадрат (χ²), Жиілік, Мода'
    },
    {
      id: 'ordinal',
      title: 'Реттік шкала (Ordinal)',
      desc: 'Деректердің нақты реті немесе иерархиясы бар. Мұнда Спирменнің рангілік корреляциясы ең тиімді нәтиже береді.',
      example: 'Лауазымыңыз: Маман, Бөлім басшысы, Департамент директоры',
      visual: (
        <div className="flex items-end gap-2 mt-4 h-14">
          <div className="h-[30%] w-8 bg-indigo-200 rounded-t-lg"></div>
          <div className="h-[60%] w-8 bg-indigo-400 rounded-t-lg"></div>
          <div className="h-[90%] w-8 bg-indigo-600 rounded-t-lg"></div>
        </div>
      ),
      stats: 'Спирмен корреляциясы, Медиана'
    },
    {
      id: 'dichotomous',
      title: 'Дихотомиялық шкала',
      desc: 'Тек екі жауап нұсқасы (Иә/Жоқ). Мұнда арнайы бисериалды корреляциялық әдістер қолданылуы мүмкін.',
      example: 'Сіз бұрын-соңды SPSS қолдандыңыз ба? (Иә / Жоқ)',
      visual: (
        <div className="flex gap-4 mt-4">
          <div className="flex-1 py-2 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-center text-[10px] font-black text-emerald-700">ИӘ</div>
          <div className="flex-1 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-center text-[10px] font-black text-slate-400">ЖОҚ</div>
        </div>
      ),
      stats: 'Биноминалды тест, Фи-коэффициент'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-indigo-600 font-bold hover:gap-4 transition-all group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Артқа қайту
        </button>

        <header className="mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Өлшем Шкалаларының Анықтамалығы</h1>
          <p className="text-slate-500 text-lg max-w-3xl">Зерттеуіңіз үшін дұрыс шкаланы таңдау — деректерді талдау сапасын 80%-ға анықтайды.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scales.map((scale) => (
            <div key={scale.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col hover:shadow-2xl hover:border-indigo-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-black text-indigo-600 leading-tight">{scale.title}</h2>
                {scale.id === 'likert' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full border border-amber-200">
                    Талдауға үздік
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{scale.desc}</p>
              
              <div className="bg-slate-50/80 p-6 rounded-[2rem] mb-6 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Зерттеудегі қолданылуы:</span>
                <p className="text-slate-800 font-bold italic text-sm mb-2">"{scale.example}"</p>
                {scale.visual}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Статистика:</span>
                <span className="text-xs font-bold text-slate-700 bg-indigo-50 px-4 py-1.5 rounded-full">{scale.stats}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 p-12 bg-indigo-900 rounded-[4rem] text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-6 tracking-tight">Қай шкаланы таңдаған дұрыс?</h3>
            <p className="text-indigo-200 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Егер сіз құбылыстар арасындағы <b>байланысты (корреляцияны)</b> тапқыңыз келсе, міндетті түрде <b>Ликерт шкаласын</b> қолданыңыз. Ол математикалық жағынан ең икемді шкала болып саналады.
            </p>
            <button 
              onClick={onBack}
              className="px-12 py-5 bg-white text-indigo-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              Түсінікті, талдауға көшейік
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>
        </footer>
      </div>
    </div>
  );
};
