import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, Gender, AgeGroup } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

interface ProfileStepProps {
  profile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onStart: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  profile,
  onChangeProfile,
  onStart,
}) => {
  const genderOptions: { value: Gender; label: string; emoji: string }[] = [
    { value: 'male', label: '남성', emoji: '🙋‍♂️' },
    { value: 'female', label: '여성', emoji: '🙋‍♀️' },
    { value: 'other', label: '기타 / 밝히지 않음', emoji: '✨' },
  ];

  const ageOptions: { value: AgeGroup; label: string; badge: string }[] = [
    { value: '10s', label: '10대', badge: '학생 & Z세대의 솔직함' },
    { value: '20s', label: '20대', badge: '청년 개척자의 가치관' },
    { value: '30s', label: '30대', badge: '전문가의 실용적 시선' },
    { value: '40s', label: '40대', badge: '리더층의 책임과 균형' },
    { value: '50s_plus', label: '50대 이상', badge: '지혜로운 사회적 통찰' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-xl mx-auto px-4 py-6 sm:py-10 space-y-6"
    >
      {/* Bento Top Hero Card */}
      <div className="bento-card-highlight p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-bento">
        <div className="absolute top-0 right-0 p-4">
          <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 rounded-full text-xs font-black border border-indigo-400/30">
            Ethics Lab
          </span>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-200 mb-3 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>3분 완성 초간단 윤리 검사</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-3">
            쇼츠처럼 빠르고,<br />
            여운은 길게 남는 AI 윤리 딜레마
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed opacity-90">
            정답이 없는 8가지 팽팽한 기술 윤리 딜레마 속에서<br className="hidden sm:inline" />
            나만의 AI 윤리 MBTI 유형과 숨겨진 사각지대를 찾아보세요!
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs pt-4 border-t border-white/10 text-indigo-200 font-medium">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>로그인 없음</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>8개 핵심 문항</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <HeartHandshake className="w-4 h-4 text-pink-300" />
              <span>가상 비교 통계</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Form Card */}
      <div className="bento-card p-6 sm:p-8 shadow-bento">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>기본 프로필 설정</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
            3초 소요
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          성별과 연령대는 또래 집단과의 윤리 성향 비교 통계 산출에만 활용됩니다.
        </p>

        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
            성별
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {genderOptions.map((opt) => {
              const isSelected = profile.gender === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeProfile({ ...profile, gender: opt.value })}
                  className={`py-3.5 px-3 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Group Selection */}
        <div className="mb-8">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
            연령대
          </label>
          <div className="space-y-2">
            {ageOptions.map((opt) => {
              const isSelected = profile.ageGroup === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeProfile({ ...profile, ageGroup: opt.value })}
                  className={`w-full py-3 px-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-400/30'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>3초 만에 딜레마 진단 시작하기</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

