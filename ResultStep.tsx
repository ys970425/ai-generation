import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { UserProfile, EthicsSpectrum, EthicsArchetype, BlindSpotInfo, UserAnswer, DilemmaQuestion } from '../types';
import { DEMOGRAPHIC_STATS_MAP, DISCUSSION_QUESTIONS_LIST, DILEMMA_QUESTIONS } from '../data/dilemmas';
import {
  Sparkles,
  Share2,
  Copy,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
} from 'lucide-react';

interface ResultStepProps {
  profile: UserProfile;
  spectrum: EthicsSpectrum;
  archetype: EthicsArchetype;
  blindSpot: BlindSpotInfo;
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
  profile,
  spectrum,
  archetype,
  blindSpot,
  userAnswers,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAnswersAccordion, setShowAnswersAccordion] = useState(false);

  // Trigger confetti celebration on load
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#A855F7', '#EC4899', '#3B82F6', '#10B981'],
      });
    } catch {
      // Ignore fallback if canvas confetti is blocked
    }
  }, []);

  // Demographic stat lookup
  const demographicInfo = DEMOGRAPHIC_STATS_MAP[profile.ageGroup] || DEMOGRAPHIC_STATS_MAP['20s'];

  // Radar chart dataset
  const radarData = [
    { subject: '기술 혁신', score: spectrum.innovation, fullMark: 100 },
    { subject: '공정성/인권', score: spectrum.fairness, fullMark: 100 },
    { subject: '프라이버시', score: spectrum.privacy, fullMark: 100 },
    { subject: '사회적 안전', score: spectrum.safety, fullMark: 100 },
    { subject: '인간 존엄성', score: spectrum.humanity, fullMark: 100 },
  ];

  // Pick 2 real stories associated with user's specific answers or category
  const selectedQuestionIds = userAnswers.map((a) => a.questionId);
  const matchedStories = DILEMMA_QUESTIONS.filter((q) => selectedQuestionIds.includes(q.id)).slice(0, 3);

  // Share text generation
  const handleCopyResult = () => {
    const summaryText = `[AI 윤리 딜레마 진단 결과]\n나의 윤리 MBTI: ${archetype.code} (${archetype.title})\n"${archetype.motto}"\n\n📊 나의 5대 윤리 스펙트럼:\n• 기술혁신: ${spectrum.innovation}점\n• 공정성: ${spectrum.fairness}점\n• 프라이버시: ${spectrum.privacy}점\n• 사회안전: ${spectrum.safety}점\n• 인간존엄: ${spectrum.humanity}점\n\n💡 나만의 사각지대: ${blindSpot.title}\n👉 3분 만에 나만의 AI 윤리 유형을 알아보세요!`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-8"
    >
      {/* 1. ARCHETYPE BENTO HEADER CARD */}
      <div className="bento-card-highlight p-6 sm:p-8 relative overflow-hidden bg-white shadow-bento">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar / Emoji Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-indigo-50/80 border-2 border-indigo-100 rounded-full flex items-center justify-center text-5xl sm:text-6xl shrink-0 shadow-xs">
            {archetype.emoji}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-indigo-100 text-indigo-800">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>윤리 MBTI: #{archetype.code}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight leading-snug mb-1">
              {archetype.title}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mb-3">
              {archetype.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 keep-all bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {archetype.description}
            </p>

            <div className="inline-block italic text-xs sm:text-sm font-extrabold text-indigo-900 bg-indigo-100/70 px-4 py-2 rounded-full border border-indigo-200/80">
              "{archetype.motto}"
            </div>
          </div>
        </div>

        {/* Traits list */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold text-slate-700">
          {archetype.traits.map((trait, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="keep-all">{trait}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RADAR CHART & DEMOGRAPHIC STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Card */}
        <div className="lg:col-span-7 bento-card p-6 shadow-bento flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>5대 AI 윤리 스펙트럼</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">100점 만점</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              질문별 응답의 가중치로 산출된 나의 5대 가치 지표 레이더 그래프입니다.
            </p>
          </div>

          <div className="w-full h-64 sm:h-72 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                <Radar
                  name="나의 윤리 스펙트럼"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-1 text-center pt-3 border-t border-slate-100 text-[11px]">
            <div>
              <span className="block text-slate-400 font-semibold">혁신</span>
              <span className="font-black text-indigo-600 text-xs">{spectrum.innovation}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold">공정</span>
              <span className="font-black text-purple-600 text-xs">{spectrum.fairness}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold">보안</span>
              <span className="font-black text-teal-600 text-xs">{spectrum.privacy}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold">안전</span>
              <span className="font-black text-amber-600 text-xs">{spectrum.safety}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-semibold">존엄</span>
              <span className="font-black text-rose-600 text-xs">{spectrum.humanity}</span>
            </div>
          </div>
        </div>

        {/* Demographic Stat Card */}
        <div className="lg:col-span-5 bento-card-indigo p-6 shadow-bento flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{demographicInfo.label} 비교 통계</span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
              동일 연령대 그룹과의 가치관 매칭
            </h4>

            <div className="bg-white p-4 rounded-2xl border border-indigo-200/80 shadow-xs mb-4">
              <p className="text-xs sm:text-sm font-bold text-indigo-950 leading-relaxed keep-all">
                "{demographicInfo.statText}"
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed keep-all">
              {profile.ageGroup} 응답자들은 특히 <span className="font-extrabold text-indigo-700">{demographicInfo.highlightCategory}</span> 영역에서 높은 관심과 뚜렷한 소신을 보였습니다.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-200/80 text-[11px] font-medium text-slate-500">
            📊 연령대별 윤리 성향 가상 비교 통계
          </div>
        </div>
      </div>

      {/* 3. BLIND SPOT CARD */}
      <div className="bento-card-amber p-6 shadow-bento">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xs shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-black uppercase tracking-wider mb-1">
              Blind Spot Insight
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
              💡 내가 몰랐던 나의 '윤리적 사각지대': {blindSpot.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 keep-all bg-white p-4 rounded-2xl border border-amber-200/80">
              {blindSpot.description}
            </p>
            <div className="bg-amber-100/90 p-3.5 rounded-2xl border border-amber-300/80 text-xs sm:text-sm text-amber-950 font-bold">
              🧭 <span className="font-black">추천 조율 가이드:</span> {blindSpot.solution}
            </div>
          </div>
        </div>
      </div>

      {/* 4. REAL WORLD STORIES CARD */}
      <div className="bento-card p-6 sm:p-7 shadow-bento">
        <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>📰 내 선택과 연관된 '실제 AI 사건 이야기' (1분 스토리)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          오늘 당신이 고민했던 딜레마는 이미 현실 세계에서 치열하게 일어난 사건들입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {matchedStories.map((story) => (
            <div
              key={story.id}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black mb-2">
                  {story.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug keep-all">
                  {story.realCaseTitle}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed keep-all">
                  {story.realCaseStory}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DISCUSSION QUESTIONS CARD */}
      <div className="bento-card p-6 sm:p-7 shadow-bento">
        <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <span>💬 친구나 동료와 공유하기 좋은 '3가지 토론 질문'</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          동료, 스터디원, 친구들과 차 한 잔 마시며 가볍게 이야기해볼 수 있는 대화 주제입니다.
        </p>

        <div className="space-y-3">
          {DISCUSSION_QUESTIONS_LIST.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-xs sm:text-sm font-bold text-purple-950 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                {idx + 1}
              </span>
              <p className="leading-relaxed keep-all mt-0.5">{q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. USER ANSWER REVIEW ACCORDION */}
      <div className="bento-card p-6 shadow-bento">
        <button
          type="button"
          onClick={() => setShowAnswersAccordion(!showAnswersAccordion)}
          className="w-full flex items-center justify-between text-left font-black text-slate-900 text-base cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>내가 선택한 답변 8가지 복기하기</span>
          </div>
          {showAnswersAccordion ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showAnswersAccordion && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            {userAnswers.map((ans) => {
              const q = DILEMMA_QUESTIONS.find((item) => item.id === ans.questionId);
              if (!q) return null;
              const chosenOpt = ans.selectedOption === 'A' ? q.optionA : q.optionB;

              return (
                <div key={ans.questionId} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>Q{q.id}. {q.title}</span>
                    <span className="text-indigo-600 font-extrabold">선택지 {ans.selectedOption} ({chosenOpt.tag})</span>
                  </div>
                  <p className="text-slate-600 text-xs mb-2">{chosenOpt.title}</p>

                  {ans.reason && (
                    <div className="bg-indigo-50/80 p-2.5 rounded-xl border border-indigo-100 text-indigo-950 text-xs italic">
                      💬 <span className="font-bold">작성한 이유:</span> "{ans.reason}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. SHARE & RESTART BOTTOM ACTIONS */}
      <div className="bento-card bg-slate-900 text-white p-6 sm:p-8 text-center shadow-xl space-y-4">
        <h3 className="text-lg sm:text-xl font-black">
          진단 결과를 친구 및 동료와 공유해보세요!
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          서로 다른 윤리 MBTI 유형을 가진 사람들과의 대화에서 더 넓은 통찰이 시작됩니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopyResult}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>결과 요약 복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>결과 텍스트 복사하기</span>
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>처음부터 다시 진단하기</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
