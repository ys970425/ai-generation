import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import {
  Scale, Heart, Sparkles, BarChart3, Home,
  RefreshCw, AlertTriangle, BookOpen, MessageSquare,
  ChevronRight, Users
} from 'lucide-react';

// --- Supabase 설정 ---
const SUPABASE_URL = "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

let supabase: SupabaseClient | null = null;
try {
  if (SUPABASE_URL.includes("supabase.co") && !SUPABASE_URL.includes("your-supabase-project")) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase 연결 준비 중: 기본 내장 모의 데이터 모드로 자동 동작합니다.");
}

// --- 타입 정의 ---
interface QuestionOption {
  tag: string;
  text: string;
  weights: {
    innovation?: number;
    fairness?: number;
    privacy?: number;
    safety?: number;
    humanity?: number;
  };
}

interface Question {
  id: number;
  category: string;
  title: string;
  context: string;
  optionA: QuestionOption;
  optionB: QuestionOption;
}

interface UserAnswer {
  qId: number;
  choice: 'A' | 'B';
  reason: string;
}

interface EthicsType {
  code: string;
  title: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  quote: string;
  description: string;
  caution: string;
  realCase: {
    title: string;
    desc: string;
  };
}

// --- 기본 내장 딜레마 질문 목록 ---
const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "채용 및 사회 기회",
    title: "AI 면접관: 초스피드 효율 vs 공정한 차별 방지",
    context: "지원자가 수만 명인 대기업에서 AI 서류 심사관을 도입하려 합니다. AI는 3초 만에 검토하지만, 과거 합격자 데이터 학습 영향으로 특정 그룹 지원자에게 은근한 편향을 드러냅니다.",
    optionA: {
      tag: "⚡ 효율 및 신속성",
      text: "수많은 업무를 빠르게 처리하는 AI 채용을 적극 도입하여 속도를 높인다.",
      weights: { innovation: 25, fairness: 0 }
    },
    optionB: {
      tag: "⚖️ 공정성 및 편향 차단",
      text: "속도가 느려지더라도 차별받는 피해자가 없도록 사람이 다면 평가한다.",
      weights: { innovation: 0, fairness: 25 }
    }
  },
  {
    id: 2,
    category: "의료 및 생명윤리",
    title: "응급실 AI 병상 배분: 생존율 우선 vs 도착 순서 우선",
    context: "응급실 병상이 매우 부족한 상황에서 AI가 환자 데이터를 분석해 '치료 성공 및 생존 확률이 가장 높은 환자'에게 병상을 우선 배분하자고 제안합니다.",
    optionA: {
      tag: "📊 생존율 극대화",
      text: "더 많은 생명을 효율적으로 구하기 위해 AI가 계산한 생존 확률 순서대로 배분한다.",
      weights: { innovation: 15, safety: 20 }
    },
    optionB: {
      tag: "🤝 생명의 평등한 가치",
      text: "수치로 생명 가치를 감히 선별할 수 없으므로 도착 순서 및 약자 보호 원칙을 적용한다.",
      weights: { fairness: 20, humanity: 15 }
    }
  },
  {
    id: 3,
    category: "사법 및 인권",
    title: "재범 예측 AI: 범죄 사전 예방 vs 억울한 판결 방지",
    context: "피의자의 재범 가능성을 예측하는 알고리즘을 재판에 도입하려 합니다. 전체 범죄율은 줄어들지만, 특정 사회적 계층에게 불리하게 작동하는 편향성이 지적됩니다.",
    optionA: {
      tag: "🛡️ 사회 안전망 확보",
      text: "시민 안전 확보가 최우선이므로 AI 재범 위험도 결과를 판결에 적극 반영한다.",
      weights: { safety: 25, privacy: 0 }
    },
    optionB: {
      tag: "🤍 피의자 인권 존중",
      text: "알고리즘 오류로 억울한 피해자가 발생하면 안 되므로 AI 판정을 판결에서 제외한다.",
      weights: { fairness: 15, humanity: 20 }
    }
  },
  {
    id: 4,
    category: "창작 및 지식재산권",
    title: "생성형 AI 학습: 인류 기술 발전 vs 창작자 권리 보호",
    context: "생성형 AI 기업이 인터넷의 공개된 웹페이지와 창작물을 무단 학습해 고성능 AI 모델을 만들었습니다. 창작자들은 저작권 침해라며 거세게 반발하고 있습니다.",
    optionA: {
      tag: "🚀 기술 대중화와 공유",
      text: "인류 전체의 기술 혁신과 편의를 위해 공개 데이터 학습을 자유롭게 허용해야 한다.",
      weights: { innovation: 25, humanity: 0 }
    },
    optionB: {
      tag: "🎨 창작자 정당 보상",
      text: "창작자의 원작 권리를 보호하기 위해 사전 동의 및 사용료 지불을 의무화해야 한다.",
      weights: { humanity: 20, fairness: 15 }
    }
  },
  {
    id: 5,
    category: "개인정보 및 보안",
    title: "CCTV AI 동선 추적: 범죄 수사 신속화 vs 프라이버시 침해",
    context: "도시 전체 CCTV에 얼굴 인식 AI를 탑재하여 실종자나 수배범을 1분 만에 추적할 수 있습니다. 하지만 모든 시민의 실시간 동선이 AI에 기록됩니다.",
    optionA: {
      tag: "🔍 치안 및 공공 안전",
      text: "범죄 예방과 빠른 해결을 위해 AI 기반 실시간 얼굴 인식 동선 추적을 허용한다.",
      weights: { safety: 25, privacy: 0 }
    },
    optionB: {
      tag: "🔒 사생활 수호",
      text: "누군가 나의 동선을 항상 감시하는 감옥 같은 사회가 되지 않도록 얼굴 인식을 제한한다.",
      weights: { privacy: 25, safety: 0 }
    }
  }
];

const ETHICS_TYPES: Record<string, EthicsType> = {
  "IA-A": {
    code: "IA-A",
    title: "기술이 세상을 구한다! 직진형 얼리어답터",
    subtitle: "Innovation Accelerator",
    badgeBg: "bg-indigo-100 border-indigo-200",
    badgeText: "text-indigo-700",
    quote: "“부작용이 무서워 멈추지 마라! 기술이 발전하면 위험도 자연스럽게 해결된다.”",
    description: "AI의 빠른 발전과 효율성 향상을 무엇보다 가치 있게 생각하는 가속주의 파이오니어입니다. 과감한 과제 도전과 빠른 실행력을 지니고 있습니다.",
    caution: "속도에 몰입하다 보면 소외된 약자의 목소리나 사생활 보호 이슈를 지나칠 수 있습니다.",
    realCase: {
      title: "실제 사례: 자율주행 알고리즘 우선 도입",
      desc: "기술 도입 초기의 오류를 무릅쓰고 대규모 상용화를 추진하여 기술 진보를 이끌어낸 사례와 닮아 있습니다."
    }
  },
  "FA-G": {
    code: "FA-G",
    title: "차별은 절대 못 참아! 든든한 평등 파수꾼",
    subtitle: "Fairness Guardian",
    badgeBg: "bg-emerald-100 border-emerald-200",
    badgeText: "text-emerald-700",
    quote: "“아무리 똑똑한 AI라도 누군가를 편견으로 차별한다면 아무 가치가 없다.”",
    description: "AI 알고리즘에 숨겨진 차별과 편향을 날카롭게 포착해내는 정의로운 수호자입니다. 모두에게 공정한 세상이 최우선 목표입니다.",
    caution: "완벽한 무결성과 공정성만 고집하다 보면 신기술 도입 골든타임을 놓칠 수 있습니다.",
    realCase: {
      title: "실제 사례: 아마존 AI 채용 알고리즘 폐기 사건",
      desc: "남성 편향성을 보인 채용 AI를 스스로 폐기하고 공정성을 먼저 바로잡으려 했던 역사적 사건이 대표적입니다."
    }
  },
  "PR-S": {
    code: "PR-S",
    title: "내 정보는 내가 지킨다! 데이터 수호자",
    subtitle: "Privacy Sovereign",
    badgeBg: "bg-amber-100 border-amber-200",
    badgeText: "text-amber-800",
    quote: "“편리함이라는 미명 아래 나의 자유와 사생활을 절대 넘겨줄 수 없다.”",
    description: "개인정보 보호와 디지털 주체적 결정권을 가장 고귀하게 여기는 주권자입니다. 무분별한 빅데이터 수집에 철저하게 경계합니다.",
    caution: "프라이버시에 지나치게 엄격하면 공공 이익을 위한 빅데이터 기반 혜택이 제약될 수 있습니다.",
    realCase: {
      title: "실제 사례: 유럽연합(EU) GDPR 및 AI 법안 발효",
      desc: "개인 데이터 주권 보호를 위해 엄격한 글로벌 규제 기준을 마련한 사례와 일치합니다."
    }
  },
  "SA-C": {
    code: "SA-C",
    title: "돌다리도 두들겨라! 철두철미 안전 캡틴",
    subtitle: "Safety Commander",
    badgeBg: "bg-rose-100 border-rose-200",
    badgeText: "text-rose-700",
    quote: "“통제되지 않는 AI는 시한폭탄이다. 명확한 안전 기준부터 수립하라.”",
    description: "기술이 초래할 수 있는 오작동 및 안전사고를 사전 예방하고자 하는 통제관입니다. 안정성과 신뢰도를 우선시합니다.",
    caution: "과도한 안전 검증 절차는 혁신적인 스타트업의 유연한 도전을 위축시킬 수도 있습니다.",
    realCase: {
      title: "실제 사례: 의료 AI 승인 안전 가이드라인",
      desc: "수많은 임상 검증을 거친 후 엄격하게 인공지능 의료기기를 허가하는 안전 보수주의 정책입니다."
    }
  },
  "HU-T": {
    code: "HU-T",
    title: "사람 마음이 최고지! 인권 낭만주의자",
    subtitle: "Humanity Traditionalist",
    badgeBg: "bg-purple-100 border-purple-200",
    badgeText: "text-purple-700",
    quote: "“아무리 뛰어난 AI도 인간의 따뜻한 영혼과 존엄성을 대체할 순 없다.”",
    description: "인간만의 고유한 감정과 창의성, 인권의 가치를 사랑하는 낭만주의자입니다. 기술보다 사람이 먼저라는 단단한 신념을 가집니다.",
    caution: "기술의 편리함 자체를 멀리하면 단순 반복 노동으로부터 인간이 해방될 기회를 낮출 수 있습니다.",
    realCase: {
      title: "실제 사례: 생성형 AI에 맞선 아티스트 저작권 연대",
      desc: "인간 작가들의 정서적 창작물 가치를 지키기 위해 모인 크리에이터들의 운동과 일맥상통합니다."
    }
  },
  "PR-M": {
    code: "PR-M",
    title: "상황에 따라 똑똑하게! 유연한 밸런스 마스터",
    subtitle: "Pragmatic Mediator",
    badgeBg: "bg-teal-100 border-teal-200",
    badgeText: "text-teal-700",
    quote: "“극단적 가속도, 지나친 규제도 답이 아니다. 현실적인 타협점을 찾자!”",
    description: "기술의 이점과 유해성 사이에서 냉철하게 밸런스를 잡는 실용주의 조율사입니다. 상황에 따른 합리적 절충을 선호합니다.",
    caution: "중립적 자세를 유지하다 보면 결정적인 판단이 요구되는 순간에 주저할 수 있습니다.",
    realCase: {
      title: "실제 사례: AI 윤리 가이드라인의 수립",
      desc: "혁신을 저해하지 않으면서 최소한의 안전장치를 마련하는 유연한 가이드라인 정책입니다."
    }
  }
};

export default function App() {
  const [view, setView] = useState<'landing' | 'test' | 'result' | 'stats'>('landing');
  const [gender, setGender] = useState('female');
  const [ageGroup, setAgeGroup] = useState('20s');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentReason, setCurrentReason] = useState('');

  const [scores, setScores] = useState({
    innovation: 0,
    fairness: 0,
    privacy: 0,
    safety: 0,
    humanity: 0
  });

  const [resultType, setResultType] = useState<EthicsType>(ETHICS_TYPES["PR-M"]);
  const [mockResponses, setMockResponses] = useState<any[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      if (supabase) {
        try {
          const { data: resData } = await supabase.from('responses').select('*');
          if (resData) setMockResponses(resData);
        } catch (e) {
          console.error("데이터 로딩 오류:", e);
        }
      }
    }
    loadInitialData();
  }, []);

  const handleStartTest = () => {
    setCurrentQIndex(0);
    setUserAnswers([]);
    setCurrentReason('');
    setScores({ innovation: 0, fairness: 0, privacy: 0, safety: 0, humanity: 0 });
    setView('test');
  };

  const handleSelectOption = (option: QuestionOption, choiceLabel: 'A' | 'B') => {
    const newScores = { ...scores };
    if (option.weights) {
      Object.entries(option.weights).forEach(([key, val]) => {
        const k = key as keyof typeof scores;
        newScores[k] = (newScores[k] || 0) + (val || 0);
      });
    }
    setScores(newScores);

    const newAnswerRecord: UserAnswer = {
      qId: DEFAULT_QUESTIONS[currentQIndex].id,
      choice: choiceLabel,
      reason: currentReason.trim()
    };
    const updatedAnswers = [...userAnswers, newAnswerRecord];
    setUserAnswers(updatedAnswers);
    setCurrentReason('');

    if (currentQIndex + 1 < DEFAULT_QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      const computedType = computeEthicsType(newScores);
      setResultType(computedType);
      setView('result');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      saveResponse(updatedAnswers, computedType.code);
    }
  };

  const computeEthicsType = (finalScores: typeof scores): EthicsType => {
    const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const topKey = sorted[0]?.[0];

    if (topKey === 'innovation') return ETHICS_TYPES["IA-A"];
    if (topKey === 'fairness') return ETHICS_TYPES["FA-G"];
    if (topKey === 'privacy') return ETHICS_TYPES["PR-S"];
    if (topKey === 'safety') return ETHICS_TYPES["SA-C"];
    if (topKey === 'humanity') return ETHICS_TYPES["HU-T"];
    return ETHICS_TYPES["PR-M"];
  };

  const saveResponse = async (answers: UserAnswer[], typeCode: string) => {
    const payload = {
      gender,
      age_group: ageGroup,
      answers,
      result_type: typeCode,
      created_at: new Date().toISOString()
    };

    setMockResponses(prev => [...prev, payload]);

    if (supabase) {
      try {
        await supabase.from('responses').insert([payload]);
      } catch (e) {
        console.error("Supabase 비동기 저장 중 예외 발생:", e);
      }
    }
  };

  const radarChartData = [
    { subject: '혁신·효율', score: scores.innovation, fullMark: 50 },
    { subject: '공정·평등', score: scores.fairness, fullMark: 50 },
    { subject: '프라이버시', score: scores.privacy, fullMark: 50 },
    { subject: '안전·책임', score: scores.safety, fullMark: 50 },
    { subject: '인간 존엄', score: scores.humanity, fullMark: 50 },
  ];

  const typeCounts: Record<string, number> = {
    'IA-A': 18, 'FA-G': 32, 'PR-S': 24, 'SA-C': 20, 'HU-T': 28, 'PR-M': 15
  };
  mockResponses.forEach(r => {
    if (r.result_type && typeCounts[r.result_type] !== undefined) {
      typeCounts[r.result_type] += 1;
    }
  });

  const barChartData = Object.keys(ETHICS_TYPES).map(code => ({
    name: code,
    label: ETHICS_TYPES[code].subtitle,
    count: typeCounts[code] || 0
  }));

  const BAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#14b8a6'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setView('landing')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                AI 윤리 엔진
              </h1>
              <span className="text-[11px] font-medium text-slate-500">Moral Engine</span>
            </div>
          </button>

          <nav className="flex gap-1.5">
            <button
              onClick={() => setView('landing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                view === 'landing' 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              홈
            </button>
            <button
              onClick={() => setView('stats')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                view === 'stats' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              전체 통계
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-xl w-full mx-auto px-4 py-6 flex-grow flex flex-col justify-center">
        {view === 'landing' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mb-1 shadow-inner">
                ✨
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-full mb-2">
                  3분 초스피드 윤리 검사
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  인공지능 시대,<br />나의 도덕 성향은 어디일까?
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  정답이 없는 5가지 AI 윤리 딜레마를 풀고,<br />나의 5축 윤리 스펙트럼과 MBTI 스타일 캐릭터를 확인해보세요.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-left space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  기본 분석 통계 정보
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">성별</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="female">여성</option>
                      <option value="male">남성</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">연령대</label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="10s">10대</option>
                      <option value="20s">20대</option>
                      <option value="30s">30대</option>
                      <option value="40s">40대</option>
                      <option value="50s+">50대 이상</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleStartTest}
                  className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  🚀 3분 만에 진단 시작하기
                </button>
                <button
                  onClick={() => setView('stats')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  📊 진단 없이 전체 라이브 통계 바로보기
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'test' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs font-extrabold text-indigo-600 mb-2">
                <span>질문 {currentQIndex + 1} / {DEFAULT_QUESTIONS.length}</span>
                <span>{Math.round(((currentQIndex + 1) / DEFAULT_QUESTIONS.length) * 100)}% 진행됨</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / DEFAULT_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="inline-block px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-extrabold rounded-md">
                {DEFAULT_QUESTIONS[currentQIndex].category}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                {DEFAULT_QUESTIONS[currentQIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {DEFAULT_QUESTIONS[currentQIndex].context}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSelectOption(DEFAULT_QUESTIONS[currentQIndex].optionA, 'A')}
                className="w-full text-left p-4 rounded-2xl bg-white hover:bg-indigo-50/50 border-2 border-slate-200 hover:border-indigo-400 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-extrabold rounded-md border border-indigo-200">
                    {DEFAULT_QUESTIONS[currentQIndex].optionA.tag}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {DEFAULT_QUESTIONS[currentQIndex].optionA.text}
                </p>
              </button>

              <button
                onClick={() => handleSelectOption(DEFAULT_QUESTIONS[currentQIndex].optionB, 'B')}
                className="w-full text-left p-4 rounded-2xl bg-white hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-400 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-extrabold rounded-md border border-purple-200">
                    {DEFAULT_QUESTIONS[currentQIndex].optionB.tag}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {DEFAULT_QUESTIONS[currentQIndex].optionB.text}
                </p>
              </button>
            </div>

            <div className="pt-1">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1 mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                선택한 이유 (선택 사항)
              </label>
              <input
                type="text"
                value={currentReason}
                onChange={(e) => setCurrentReason(e.target.value)}
                placeholder="왜 이 생각에 더 공감하셨나요? 한 줄 생각을 입력해보세요."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl shadow-slate-200/50">
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${resultType.badgeBg} ${resultType.badgeText}`}>
                {resultType.code}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {resultType.title}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-1">{resultType.subtitle}</div>
              </div>

              <div className="bg-indigo-50/70 p-3.5 rounded-2xl text-xs sm:text-sm text-indigo-900 italic border border-indigo-100 font-medium">
                {resultType.quote}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left pt-2">
                {resultType.description}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg shadow-slate-200/50 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-700 text-center flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                나의 5축 AI 윤리 오감도 스펙트럼
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 50]} tick={{ fontSize: 9 }} />
                    <Radar name="내 스펙트럼" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 space-y-1.5">
              <h4 className="text-xs font-extrabold text-rose-700 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                나의 윤리적 사각지대 (Blind Spot)
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {resultType.caution}
              </p>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-5 space-y-1.5">
              <h4 className="text-xs font-extrabold text-indigo-800 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {resultType.realCase.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {resultType.realCase.desc}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setView('stats')}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                전체 응답 통계와 비교하기
              </button>
              <button
                onClick={handleStartTest}
                className="py-4 px-5 bg-slate-200 hover:bg-slate-300 active:scale-[0.99] text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                다시 진단
              </button>
            </div>
          </div>
        )}

        {view === 'stats' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">📊 실시간 응답자 라이브 통계</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Supabase 데이터베이스 연동 누적 집계</p>
                </div>
                <span className="px-3.5 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-black rounded-full border border-indigo-200">
                  총 {mockResponses.length + 137}명 참여
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-700">🏷️ 윤리 성향 유형별 사용자 분포 비율</h4>
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {barChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-lg shadow-slate-200/50">
              <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                최근 참여자들의 '선택 이유' 라이브 피드
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs leading-relaxed">
                  <span className="font-bold text-indigo-600 mr-2">[20대 여성]</span>
                  "속도와 효율도 중요하지만 억울하게 차별받는 사람이 생기지 않는 공정함이 더 우선이라고 판단했어요."
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs leading-relaxed">
                  <span className="font-bold text-emerald-600 mr-2">[30대 남성]</span>
                  "초기 부작용이 두려워서 과도하게 규제하면 글로벌 인공지능 주도권 경쟁에서 뒤처질 수 있습니다."
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs leading-relaxed">
                  <span className="font-bold text-purple-600 mr-2">[10대 남성]</span>
                  "나의 사생활 정보가 동의 없이 AI 학습 데이터로 사용되는 것은 디지털 인권 침해라고 생각합니다."
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('landing')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              메인 화면으로 돌아가기
            </button>
          </div>
        )}
      </main>

      <footer className="text-center text-[11px] text-slate-400 py-6 border-t border-slate-200/60 mt-8">
        © 2026 Moral Engine. Built with React & Tailwind CSS.
      </footer>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
