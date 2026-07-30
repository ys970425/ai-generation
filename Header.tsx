import React from 'react';
import { Sparkles, RotateCcw, BrainCircuit, BarChart3, Home } from 'lucide-react';
import { AppStep } from '../types';

interface HeaderProps {
  currentStep: AppStep;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  onReset: () => void;
  onOpenStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  currentQuestionIndex = 0,
  totalQuestions = 8,
  onReset,
  onOpenStats,
}) => {
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-indigo-950 group-hover:text-indigo-600 transition-colors">
                AI 윤리 딜레마 진단
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Lab
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              3분 만에 알아보는 나만의 AI 윤리 MBTI 스펙트럼
            </p>
          </div>
        </button>

        {/* Actions or Step indicator */}
        <div className="flex items-center gap-2">
          {currentStep === 'dilemma' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="text-indigo-600 font-black">Q{currentQuestionIndex + 1}</span>
              <span className="text-slate-400">/</span>
              <span>{totalQuestions}</span>
            </div>
          )}

          {/* Live Stats Navigation Button */}
          <button
            onClick={onOpenStats}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
              currentStep === 'stats'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
            }`}
            title="실시간 전체 사용자 통계 보기"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden xs:inline">전체 통계</span>
            <span className="xs:hidden">통계</span>
          </button>

          {currentStep !== 'profile' && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 transition-colors border border-slate-200 shadow-xs cursor-pointer"
              title="처음부터 다시 진단하기"
            >
              <Home className="w-3.5 h-3.5 sm:hidden" />
              <RotateCcw className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="hidden sm:inline">처음으로</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar during Dilemma */}
      {currentStep === 'dilemma' && (
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};


