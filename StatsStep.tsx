import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Award,
  Flame,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { DILEMMA_QUESTIONS } from '../data/dilemmas';
import { ETHICS_ARCHETYPES } from '../data/archetypes';
import { getCombinedStats } from '../data/seedStats';
import { SubmittedResponse } from '../types';

interface StatsStepProps {
  localResponses: SubmittedResponse[];
  onStartTest: () => void;
  hasCompletedTest: boolean;
}

export const StatsStep: React.FC<StatsStepProps> = ({
  localResponses,
  onStartTest,
  hasCompletedTest,
}) => {
  const [selectedQuestionTab, setSelectedQuestionTab] = useState<number | 'all'>('all');

  const stats = getCombinedStats(localResponses);
  const total = stats.totalParticipants;

  // Gender chart data
  const genderChartData = [
    { name: '여성', value: stats.genderCounts.female, color: '#818cf8' },
    { name: '남성', value: stats.genderCounts.male, color: '#38bdf8' },
    { name: '기타/미지정', value: stats.genderCounts.other, color: '#c084fc' },
  ];

  // Age group chart data
  const ageChartData = [
    { name: '10대', count: stats.ageGroupCounts['10s'] },
    { name: '20대', count: stats.ageGroupCounts['20s'] },
    { name: '30대', count: stats.ageGroupCounts['30s'] },
    { name: '40대', count: stats.ageGroupCounts['40s'] },
    { name: '50대+', count: stats.ageGroupCounts['50s_plus'] },
  ];

  // Archetype distribution data
  const archetypeDistribution = Object.entries(stats.archetypeCounts).map(([code, count]) => {
    const arch = ETHICS_ARCHETYPES.find((a) => a.code === code);
    return {
      code,
      title: arch ? arch.title : code,
      emoji: arch ? arch.emoji : '⚖️',
      count,
      percent: Math.round((count / total) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  const topArchetype = archetypeDistribution[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8"
    >
      {/* 1. TOP HERO BANNER */}
      <div className="bento-card-highlight p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-bento">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE Real-time Stats
              </span>
              <span className="px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-xs font-bold border border-white/10">
                AI 윤리 데이터랩
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-2">
              대한민국 AI 윤리 선택 지형도
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              3,800명 이상의 시민들이 직접 참여한 8가지 딜레마 선택과 인구통계 분포 데이터를 실시간으로 시각화하여 보여드립니다.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center shrink-0 w-full sm:w-auto">
            <span className="text-xs text-indigo-200 font-bold block mb-1">총 누적 진단 참여자</span>
            <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-1">
              <span>{total.toLocaleString()}</span>
              <span className="text-sm font-bold text-indigo-300">명</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold block mt-1">
              🟢 실시간 자동 집계 중
            </span>
          </div>
        </div>
      </div>

      {/* 2. BENTO METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bento-card p-5 shadow-bento flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">총 참여자</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{total.toLocaleString()}명</div>
            <p className="text-[11px] text-slate-400 mt-1">전국 남녀노소 집계</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bento-card p-5 shadow-bento flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">최다 윤리 유형</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base font-black text-slate-900 flex items-center gap-1.5 truncate">
              <span>{topArchetype?.emoji}</span>
              <span className="truncate">{topArchetype?.title}</span>
            </div>
            <p className="text-[11px] text-purple-700 font-bold mt-1">
              전체의 {topArchetype?.percent}% 차지
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bento-card p-5 shadow-bento flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">가장 팽팽한 질문</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base font-black text-slate-900 truncate">
              Q5. 치안 예측 예방
            </div>
            <p className="text-[11px] text-rose-600 font-bold mt-1">
              A 49% vs B 51% (격차 2%)
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bento-card p-5 shadow-bento flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">최다 참여 연령</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">20대 청년층</div>
            <p className="text-[11px] text-amber-700 font-bold mt-1">
              전체 참여자의 44%
            </p>
          </div>
        </div>
      </div>

      {/* 3. QUESTION-BY-QUESTION RATIO VISUALIZATION */}
      <div className="bento-card p-6 sm:p-8 shadow-bento space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <span>8대 딜레마 문항별 A vs B 선택 비율</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              실시간 데이터 누적 분석
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            각 딜레마 주제별로 대중이 어떤 명분과 가치를 더 우위에 두고 선택했는지 비교해보세요.
          </p>
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {DILEMMA_QUESTIONS.map((q) => {
            const qStat = stats.questionStats[q.id] || { countA: 0, countB: 0 };
            const qTotal = qStat.countA + qStat.countB || 1;
            const percentA = Math.round((qStat.countA / qTotal) * 100);
            const percentB = 100 - percentA;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black">
                      Q{q.id}
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {q.category}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {q.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    총 {qTotal.toLocaleString()}명 응답
                  </span>
                </div>

                {/* Progress Bar Dual Visual */}
                <div className="space-y-1.5">
                  <div className="h-7 w-full bg-slate-200 rounded-xl overflow-hidden flex text-xs font-black text-white">
                    <div
                      style={{ width: `${percentA}%` }}
                      className="bg-indigo-600 flex items-center justify-start px-3 transition-all duration-500 truncate"
                    >
                      A {percentA}%
                    </div>
                    <div
                      style={{ width: `${percentB}%` }}
                      className="bg-purple-600 flex items-center justify-end px-3 transition-all duration-500 truncate"
                    >
                      B {percentB}%
                    </div>
                  </div>

                  {/* Option breakdown labels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {/* Option A card */}
                    <div className="bg-white p-3 rounded-xl border border-indigo-200/80 shadow-xs">
                      <div className="flex items-center justify-between font-bold text-indigo-950 mb-1">
                        <span className="text-indigo-600">선택지 A • {q.optionA.tag}</span>
                        <span>{percentA}% ({qStat.countA.toLocaleString()}명)</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {q.optionA.title}: {q.optionA.merit}
                      </p>
                    </div>

                    {/* Option B card */}
                    <div className="bg-white p-3 rounded-xl border border-purple-200/80 shadow-xs">
                      <div className="flex items-center justify-between font-bold text-purple-950 mb-1">
                        <span className="text-purple-600">선택지 B • {q.optionB.tag}</span>
                        <span>{percentB}% ({qStat.countB.toLocaleString()}명)</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {q.optionB.title}: {q.optionB.merit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DEMOGRAPHICS VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution Chart */}
        <div className="bento-card p-6 shadow-bento flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <span>참여자 성별 분포</span>
            </h3>
            <p className="text-xs text-slate-500">
              전체 응답자의 성별 참여 구성 비율입니다.
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()}명`, '참여자']}
                  contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-100">
            {genderChartData.map((g) => (
              <div key={g.name} className="bg-slate-50 p-2 rounded-xl">
                <span className="block text-slate-400 text-[10px] font-bold">{g.name}</span>
                <span className="font-extrabold text-slate-800">{g.value.toLocaleString()}명</span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group Bar Chart */}
        <div className="bento-card p-6 shadow-bento flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>연령대별 진단 참여 분포</span>
            </h3>
            <p className="text-xs text-slate-500">
              10대부터 50대 이상까지 연령대별 참여인원입니다.
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()}명`, '참여자']}
                  contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
            💡 디지털 네이티브인 20대(44%)와 30대(30%)가 높은 관심도를 보였습니다.
          </div>
        </div>
      </div>

      {/* 5. ARCHETYPE DISTRIBUTION BREAKDOWN */}
      <div className="bento-card p-6 sm:p-8 shadow-bento space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>6대 윤리 MBTI 유형별 분포</span>
          </h3>
          <p className="text-xs text-slate-500">
            시민들이 진단받은 6가지 대표 AI 윤리 성향 코드별 비중입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {archetypeDistribution.map((arch) => (
            <div
              key={arch.code}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{arch.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-black">
                      #{arch.code}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">{arch.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    총 {arch.count.toLocaleString()}명 진단
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-indigo-600">{arch.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BOTTOM CALL TO ACTION */}
      <div className="bento-card bg-slate-900 text-white p-6 sm:p-8 text-center shadow-xl space-y-4">
        <h3 className="text-lg sm:text-xl font-black">
          {hasCompletedTest
            ? '나의 AI 윤리 MBTI 유형과 다시 비교해보시겠어요?'
            : '나만의 AI 윤리 MBTI 스펙트럼이 궁금하신가요?'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          단 3분 만에 8가지 딜레마를 풀고 나의 윤리 사각지대와 5대 스펙트럼 분석 리포트를 확인해보세요.
        </p>
        <button
          onClick={onStartTest}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{hasCompletedTest ? '진단 다시 시작하기' : '3초 만에 AI 윤리 진단 시작하기'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
