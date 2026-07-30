import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DilemmaQuestion, UserAnswer } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';

interface DilemmaStepProps {
  question: DilemmaQuestion;
  currentIndex: number;
  totalQuestions: number;
  currentAnswer?: UserAnswer;
  onSelectOption: (option: 'A' | 'B') => void;
  onChangeReason: (reason: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DilemmaStep: React.FC<DilemmaStepProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  onSelectOption,
  onChangeReason,
  onNext,
  onPrev,
}) => {
  const selectedOption = currentAnswer?.selectedOption;
  const typedReason = currentAnswer?.reason || '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="space-y-6"
        >
          {/* Bento Question Header Card */}
          <div className="bento-card p-6 sm:p-8 shadow-bento">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-indigo-100 text-indigo-700">
                <span>Q{question.id}</span>
                <span className="text-indigo-300">•</span>
                <span>{question.category}</span>
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentIndex + 1} / {totalQuestions}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-indigo-950 mb-3 tracking-tight leading-snug">
              {question.title}
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-slate-700 text-sm leading-relaxed">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="keep-all">{question.scenario}</p>
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A */}
            {(() => {
              const isSelected = selectedOption === 'A';
              const opt = question.optionA;
              return (
                <button
                  type="button"
                  onClick={() => onSelectOption('A')}
                  className={`text-left p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative shadow-bento-hover ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-600 ring-4 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        선택지 A • {opt.tag}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600 animate-in zoom-in-50 duration-200" />
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug keep-all">
                      {opt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 keep-all">
                      {opt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 text-xs text-indigo-950 font-medium bg-indigo-100/50 p-3 rounded-2xl">
                    💡 <span className="font-bold">핵심 이점:</span> {opt.merit}
                  </div>
                </button>
              );
            })()}

            {/* Option B */}
            {(() => {
              const isSelected = selectedOption === 'B';
              const opt = question.optionB;
              return (
                <button
                  type="button"
                  onClick={() => onSelectOption('B')}
                  className={`text-left p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative shadow-bento-hover ${
                    isSelected
                      ? 'bg-purple-50/90 border-purple-600 ring-4 ring-purple-500/10'
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        선택지 B • {opt.tag}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-purple-600 animate-in zoom-in-50 duration-200" />
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug keep-all">
                      {opt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 keep-all">
                      {opt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 text-xs text-purple-950 font-medium bg-purple-100/50 p-3 rounded-2xl">
                    💡 <span className="font-bold">핵심 이점:</span> {opt.merit}
                  </div>
                </button>
              );
            })()}
          </div>

          {/* Optional Reason Input Box */}
          <div className="bento-card p-5 shadow-xs">
            <label className="block text-xs font-extrabold text-slate-700 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>선택의 이유 또는 느낀 점 (선택 작성)</span>
            </label>
            <input
              type="text"
              value={typedReason}
              onChange={(e) => onChangeReason(e.target.value)}
              placeholder="예: 단 1명의 억울함도 발생하지 않는 공정함이 더 가치있다고 생각해서"
              maxLength={100}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200/50 transition-all text-slate-800 placeholder:text-slate-400"
            />
            <div className="mt-1 text-[11px] text-slate-400 text-right">
              {typedReason.length} / 100자
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전 질문</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={!selectedOption}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedOption
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{currentIndex === totalQuestions - 1 ? '결과 리포트 보기 🎉' : '다음 질문'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!selectedOption && (
            <p className="text-center text-xs text-amber-700 font-semibold flex items-center justify-center gap-1">
              <HelpCircle className="w-4 h-4" />
              <span>두 선택지 중 하나를 클릭하시면 다음 질문으로 진행할 수 있습니다.</span>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

