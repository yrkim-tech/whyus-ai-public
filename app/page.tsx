"use client";
import { useState, useRef } from "react";

const STEPS = [
  { id: "profile", label: "개인 프로필", icon: "👤" },
  { id: "experience", label: "활동·자격·어학", icon: "🏆" },
  { id: "industry", label: "희망산업", icon: "🏭" },
  { id: "job", label: "희망직무", icon: "💼" },
  { id: "analysis", label: "기업분석 업로드", icon: "📊" },
  { id: "result", label: "지원동기 생성", icon: "✨" },
];

const STEP_COLORS = [
  { bg: "#F0FDF8", border: "#10B981", text: "#065F46" },
  { bg: "#F5F3FF", border: "#7C3AED", text: "#4C1D95" },
  { bg: "#FFFBEB", border: "#F59E0B", text: "#78350F" },
  { bg: "#EFF6FF", border: "#3B82F6", text: "#1E3A8A" },
  { bg: "#F0FDF4", border: "#22C55E", text: "#14532D" },
  { bg: "#FFF1F2", border: "#F43F5E", text: "#881337" },
];

const DISC = [
  "D (주도형)", "DI (주도+사교)", "DC (주도+신중)", "DS (주도+안정)",
  "I (사교형)", "ID (사교+주도)", "IS (사교+안정)", "IC (사교+신중)",
  "S (안정형)", "SI (안정+사교)", "SC (안정+신중)", "SD (안정+주도)",
  "C (신중형)", "CS (신중+안정)", "CD (신중+주도)", "CI (신중+사교)",
];
const GRADES = ["1학년", "2학년", "3학년", "4학년", "대학원생", "졸업예정"];
const INDUSTRIES = [
  "반도체/전자", "자동차/모빌리티", "IT/소프트웨어", "금융/핀테크", "바이오/제약",
  "화학/소재", "식품/음료", "유통/이커머스", "건설/부동산", "에너지/환경",
  "미디어/엔터테인먼트", "교육", "물류/운송", "의료/헬스케어", "패션/뷰티",
  "항공/여행", "게임", "컨설팅", "공기업/공공기관", "스타트업",
];
const JOBS = [
  "마케팅", "영업/세일즈", "기획/전략", "인사/HR", "재무/회계", "IT/개발",
  "연구개발(R&D)", "생산/품질관리", "물류/SCM", "고객서비스", "디자인", "법무/컴플라이언스",
  "데이터분석", "ESG/지속가능경영", "해외영업", "구매/조달",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F8FAFC; font-family: 'Noto Sans KR', sans-serif; color: #1E293B; min-height: 100vh; }
  .app-wrap { min-height: 100vh; background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%); padding: 2rem 1rem 4rem; }
  .container { max-width: 680px; margin: 0 auto; }

  .header { text-align: center; margin-bottom: 2.5rem; padding: 2.5rem 2rem; background: white; border-radius: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #10B981, #3B82F6, #7C3AED, #F59E0B, #F43F5E); }
  .header-badge { display: inline-flex; align-items: center; gap: 6px; background: #F0FDF8; border: 1px solid #D1FAE5; color: #065F46; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; padding: 4px 12px; border-radius: 99px; margin-bottom: 1rem; }
  .header h1 { font-size: 28px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px; margin-bottom: 0.75rem; }
  .header p { font-size: 14px; color: #64748B; line-height: 1.8; max-width: 500px; margin: 0 auto; }

  .steps-wrap { display: flex; gap: 6px; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
  .steps-wrap::-webkit-scrollbar { display: none; }
  .step-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 99px; border: 1.5px solid #E2E8F0; background: white; color: #94A3B8; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s ease; font-family: inherit; }
  .step-btn:hover { background: #F8FAFC; }
  .step-check { width: 16px; height: 16px; border-radius: 50%; background: #10B981; color: white; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; }

  .card { background: white; border-radius: 20px; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid #F1F5F9; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03); }
  .card-title { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
  .card-title-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

  .label { font-size: 11px; font-weight: 600; color: #94A3B8; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; display: block; }
  .input, .select, .textarea { width: 100%; padding: 10px 14px; font-size: 14px; font-family: inherit; border: 1.5px solid #E2E8F0; border-radius: 12px; background: #FAFAFA; color: #1E293B; outline: none; transition: all 0.2s ease; box-sizing: border-box; }
  .input:focus, .select:focus, .textarea:focus { border-color: #3B82F6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .input::placeholder { color: #CBD5E1; }
  .textarea { resize: vertical; min-height: 80px; }

  .tabs { display: flex; gap: 6px; margin-bottom: 1.25rem; background: #F1F5F9; padding: 4px; border-radius: 14px; }
  .tab-btn { flex: 1; padding: 8px 12px; border-radius: 10px; border: none; background: transparent; color: #94A3B8; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .tab-btn.active { background: white; color: #1E293B; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  .rank-card { background: white; border-radius: 20px; padding: 1.25rem 1.5rem; margin-bottom: 0.75rem; border: 1.5px solid #F1F5F9; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 14px; }
  .rank-badge { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }

  .upload-card { background: white; border-radius: 20px; padding: 1.25rem 1.5rem; margin-bottom: 0.75rem; border: 1.5px solid #F1F5F9; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .upload-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .upload-icon { width: 40px; height: 40px; border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .upload-title { font-size: 14px; font-weight: 600; color: #1E293B; margin-bottom: 3px; }
  .upload-desc { font-size: 12px; color: #94A3B8; }

  .upload-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: white; color: #475569; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .upload-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .file-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: #F0FDF8; border: 1px solid #D1FAE5; border-radius: 8px; font-size: 12px; color: #065F46; font-weight: 500; }
  .delete-btn { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border: 1.5px solid #FEE2E2; border-radius: 8px; background: white; color: #EF4444; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .delete-btn:hover { background: #FFF1F2; }

  .add-btn { width: 100%; padding: 12px; border: 2px dashed #E2E8F0; border-radius: 14px; background: transparent; color: #94A3B8; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .add-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .remove-btn { position: absolute; top: 12px; right: 12px; width: 24px; height: 24px; border-radius: 8px; border: 1px solid #E2E8F0; background: white; color: #94A3B8; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.2s; }
  .remove-btn:hover { background: #FFF1F2; color: #EF4444; border-color: #FEE2E2; }

  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 1.25rem; }
  .summary-item { background: white; border-radius: 14px; padding: 12px; text-align: center; border: 1px solid #F1F5F9; }
  .summary-label { font-size: 10px; color: #94A3B8; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px; }
  .summary-value { font-size: 14px; font-weight: 700; color: #1E293B; }

  .generate-btn { width: 100%; padding: 14px; border: none; border-radius: 14px; background: linear-gradient(135deg, #1E293B 0%, #334155 100%); color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(30,41,59,0.3); }
  .generate-btn:hover { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); box-shadow: 0 6px 20px rgba(30,41,59,0.4); transform: translateY(-1px); }
  .generate-btn:disabled { background: #E2E8F0; color: #94A3B8; cursor: not-allowed; box-shadow: none; transform: none; }

  .result-box { background: #FAFAFA; border-radius: 14px; padding: 1.25rem 1.5rem; font-size: 14px; line-height: 1.9; color: #334155; white-space: pre-wrap; border: 1px solid #F1F5F9; }
  .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .result-title { font-size: 14px; font-weight: 700; color: #1E293B; display: flex; align-items: center; gap: 8px; }
  .copy-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: white; color: #64748B; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .copy-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .result-note { margin-top: 12px; font-size: 11px; color: #94A3B8; line-height: 1.6; }

  .nav { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #F1F5F9; }
  .nav-prev { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border: 1.5px solid #E2E8F0; border-radius: 12px; background: white; color: #64748B; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .nav-prev:hover:not(:disabled) { border-color: #CBD5E1; color: #1E293B; }
  .nav-prev:disabled { opacity: 0.4; cursor: not-allowed; }
  .nav-next { display: flex; align-items: center; gap: 6px; padding: 10px 24px; border: none; border-radius: 12px; background: #1E293B; color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; box-shadow: 0 2px 8px rgba(30,41,59,0.25); }
  .nav-next:hover { background: #0F172A; transform: translateY(-1px); }

  .page-title { font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 4px; letter-spacing: -0.3px; }
  .page-desc { font-size: 13px; color: #94A3B8; margin-bottom: 1.5rem; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.3s ease forwards; }
`;

export default function Home() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", major: "", minor: "", grade: "", gender: "", gpa: "", disc: "", company: "", industry: "" });
  const [experience, setExperience] = useState({
    activities: [{ type: "", name: "", period: "", description: "" }],
    certs: [{ name: "", grade: "", year: "" }],
    languages: [{ lang: "", test: "", score: "" }],
  });
  const [jobPrefs, setJobPrefs] = useState({ first: "", second: "", third: "" });
  const [industryPrefs, setIndustryPrefs] = useState({ first: "", second: "", third: "" });
  const [uploads, setUploads] = useState({
    porter:  { files: [], text: "" },
    pest:    { files: [], text: "" },
    finance: { files: [], text: "" },
    news:    { files: [], text: "" },
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("activities");
  const [copied, setCopied] = useState(false);

  const fileRefs = {
    porter:  [useRef(), useRef(), useRef()],
    pest:    [useRef(), useRef(), useRef()],
    finance: [useRef(), useRef(), useRef()],
    news:    [useRef(), useRef(), useRef()],
  };

  const handleFileAdd = (key, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploads(prev => ({
        ...prev,
        [key]: { ...prev[key], files: [...prev[key].files, { name: file.name, text: e.target.result.slice(0, 2000) }] }
      }));
    };
    reader.readAsText(file, "utf-8");
  };

  const removeFile = (key, idx) => setUploads(u => ({ ...u, [key]: { ...u[key], files: u[key].files.filter((_, i) => i !== idx) } }));
  const addItem = (section, template) => setExperience(ex => ({ ...ex, [section]: [...ex[section], { ...template }] }));
  const removeItem = (section, idx) => setExperience(ex => ({ ...ex, [section]: ex[section].filter((_, i) => i !== idx) }));
  const updateItem = (section, idx, field, val) => setExperience(ex => ({ ...ex, [section]: ex[section].map((item, i) => i === idx ? { ...item, [field]: val } : item) }));

  const generateMotivation = async () => {
    setLoading(true);
    setResult("");
    const prompt = `당신은 취업 전문가입니다. 다음 지원자의 정보와 분석 자료를 바탕으로 희망직무에 대한 지원동기를 작성해 주세요.

## 지원자 기본정보
- 이름: ${profile.name} / 전공: ${profile.major} / 부전공: ${profile.minor || "없음"}
- 학년: ${profile.grade} | 성별: ${profile.gender} | 학점: ${profile.gpa}
- DISC 유형: ${profile.disc || "미입력"} / 지원기업: ${profile.company || "미입력"} / 산업: ${profile.industry || "미입력"}

## 대내외 활동 경험
${experience.activities.map(a => `- [${a.type}] ${a.name} (${a.period}): ${a.description}`).join("\n")}

## 자격증
${experience.certs.map(c => `- ${c.name} ${c.grade} (${c.year})`).join("\n") || "없음"}

## 외국어
${experience.languages.map(l => `- ${l.lang} ${l.test} ${l.score}`).join("\n") || "없음"}

## 희망산업
1순위: ${industryPrefs.first || "미입력"} / 2순위: ${industryPrefs.second || "-"} / 3순위: ${industryPrefs.third || "-"}

## 희망직무
1순위: ${jobPrefs.first || "미입력"} / 2순위: ${jobPrefs.second || "-"} / 3순위: ${jobPrefs.third || "-"}

## 기업분석 자료
### 마이클 포터 5 Forces: ${[...uploads.porter.files.map(f => f.text), uploads.porter.text].filter(Boolean).join("\n") || "(자료 없음)"}
### PEST 분석: ${[...uploads.pest.files.map(f => f.text), uploads.pest.text].filter(Boolean).join("\n") || "(자료 없음)"}
### 재무분석: ${[...uploads.finance.files.map(f => f.text), uploads.finance.text].filter(Boolean).join("\n") || "(자료 없음)"}
### 이슈분석: ${[...uploads.news.files.map(f => f.text), uploads.news.text].filter(Boolean).join("\n") || "(자료 없음)"}

위 정보를 종합하여 다음 지침에 따라 지원동기를 작성해 주세요:
1. 산업 분석 기반: 제공된 분석 자료를 구체적으로 언급
2. 지원자 강점 연결: 전공, 경험, 자격증, DISC 유형이 직무와 연결되는지 설명
3. 희망직무(1순위: ${jobPrefs.first || "해당 직무"}) 중심으로 기여할 수 있는 역량 강조
4. 분량: 500~700자 내외의 자연스럽고 설득력 있는 문체
5. 구성: ① 산업/기업 관심 → ② 지원자 역량과 경험 → ③ 입사 후 포부

지원동기 전문만 작성해 주세요.`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      setResult(data.content?.map(b => b.text || "").join("") || "생성에 실패했습니다.");
    } catch (e) {
      setResult("오류가 발생했습니다. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <style>{css}</style>
      <div className="app-wrap">
        <div className="container">

          <div className="header">
            <div className="header-badge">✦ AI 취업 도우미</div>
            <h1>AI 지원동기 생성기</h1>
            <p>개인정보와 희망 산업, 직무, 기업정보를 입력하면 지원동기를 작성해드립니다. 개인정보를 구체적으로 입력할수록 지원동기가 더 풍성해질 수 있습니다. 다만 AI 지원동기 초안 작성 후 반드시 본인의 언어로 수정하시기를 권유드립니다. 당신의 미래를 응원합니다.</p>
          </div>

          <div className="steps-wrap">
            {STEPS.map((s, i) => {
              const c = STEP_COLORS[i];
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button key={s.id} className="step-btn" onClick={() => setStep(i)}
                  style={isActive ? { background: c.bg, borderColor: c.border, color: c.text, fontWeight: 600 } : isDone ? { background: "#F8FAFC", borderColor: "#CBD5E1", color: "#64748B" } : {}}>
                  <span>{s.icon}</span>
                  {s.label}
                  {isDone && <span className="step-check">✓</span>}
                </button>
              );
            })}
          </div>

          {step === 0 && (
            <div className="fade-up">
              <p className="page-title">기본 정보 입력</p>
              <p className="page-desc">입력할수록 더 정확한 지원동기가 만들어져요.</p>
              <div className="card">
                <div className="grid-2">
                  {[["이름", "name", "홍길동"], ["전공", "major", "경영학과"], ["부전공", "minor", "데이터사이언스"], ["학점 (4.5기준)", "gpa", "3.8"]].map(([lbl, key, ph]) => (
                    <div key={key}><label className="label">{lbl}</label><input className="input" placeholder={ph} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} /></div>
                  ))}
                  <div>
                    <label className="label">학년</label>
                    <select className="select" value={profile.grade} onChange={e => setProfile(p => ({ ...p, grade: e.target.value }))}>
                      <option value="">선택하세요</option>
                      {GRADES.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">성별</label>
                    <select className="select" value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">선택하세요</option>
                      <option>남성</option><option>여성</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="label">eDISC 유형 (선택사항)</label>
                    <select className="select" value={profile.disc} onChange={e => setProfile(p => ({ ...p, disc: e.target.value }))}>
                      <option value="">선택하세요</option>
                      {DISC.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-title"><span className="card-title-icon" style={{ background: "#EFF6FF" }}>🏢</span>지원 기업 정보</div>
                <div className="grid-2">
                  <div><label className="label">지원 기업명</label><input className="input" placeholder="예: 삼성전자" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} /></div>
                  <div><label className="label">산업 분야</label><input className="input" placeholder="예: 반도체/전자" value={profile.industry} onChange={e => setProfile(p => ({ ...p, industry: e.target.value }))} /></div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="fade-up">
              <p className="page-title">활동·자격·어학</p>
              <p className="page-desc">경험이 많을수록 더 풍부한 지원동기가 만들어져요.</p>
              <div className="tabs">
                {[{ key: "activities", label: "🎯 대내외활동" }, { key: "certs", label: "📜 자격증" }, { key: "languages", label: "🌏 외국어" }].map(({ key, label }) => (
                  <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
                ))}
              </div>
              {activeTab === "activities" && (
                <div>
                  {experience.activities.map((act, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("activities", idx)}>✕</button>}
                      <div className="grid-2">
                        <div><label className="label">활동 유형</label>
                          <select className="select" value={act.type} onChange={e => updateItem("activities", idx, "type", e.target.value)}>
                            <option value="">선택</option>
                            {["인턴십","동아리","학회","봉사활동","공모전/대회","프로젝트","아르바이트","교환학생","기타"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div><label className="label">활동명</label><input className="input" placeholder="마케팅 서포터즈" value={act.name} onChange={e => updateItem("activities", idx, "name", e.target.value)} /></div>
                        <div><label className="label">기간</label><input className="input" placeholder="2024.03 ~ 2024.08" value={act.period} onChange={e => updateItem("activities", idx, "period", e.target.value)} /></div>
                        <div><label className="label">주요 활동 내용</label><input className="input" placeholder="SNS 콘텐츠 기획 및 운영" value={act.description} onChange={e => updateItem("activities", idx, "description", e.target.value)} /></div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("activities", { type: "", name: "", period: "", description: "" })}>+ 활동 추가</button>
                </div>
              )}
              {activeTab === "certs" && (
                <div>
                  {experience.certs.map((c, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("certs", idx)}>✕</button>}
                      <div className="grid-3">
                        <div><label className="label">자격증명</label><input className="input" placeholder="정보처리기사" value={c.name} onChange={e => updateItem("certs", idx, "name", e.target.value)} /></div>
                        <div><label className="label">등급/결과</label><input className="input" placeholder="1급" value={c.grade} onChange={e => updateItem("certs", idx, "grade", e.target.value)} /></div>
                        <div><label className="label">취득 연도</label><input className="input" placeholder="2024" value={c.year} onChange={e => updateItem("certs", idx, "year", e.target.value)} /></div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("certs", { name: "", grade: "", year: "" })}>+ 자격증 추가</button>
                </div>
              )}
              {activeTab === "languages" && (
                <div>
                  {experience.languages.map((l, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("languages", idx)}>✕</button>}
                      <div className="grid-3">
                        <div><label className="label">언어</label>
                          <select className="select" value={l.lang} onChange={e => updateItem("languages", idx, "lang", e.target.value)}>
                            <option value="">선택</option>
                            {["영어","일본어","중국어","독일어","프랑스어","스페인어","기타"].map(x => <option key={x}>{x}</option>)}
                          </select>
                        </div>
                        <div><label className="label">시험</label><input className="input" placeholder="TOEIC" value={l.test} onChange={e => updateItem("languages", idx, "test", e.target.value)} /></div>
                        <div><label className="label">점수/등급</label><input className="input" placeholder="870" value={l.score} onChange={e => updateItem("languages", idx, "score", e.target.value)} /></div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("languages", { lang: "", test: "", score: "" })}>+ 외국어 추가</button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="fade-up">
              <p className="page-title">희망 산업 선택</p>
              <p className="page-desc">관심 있는 산업을 우선순위 순서로 선택해 주세요.</p>
              {[{ key: "first", label: "1순위", bg: "#FFFBEB", border: "#F59E0B", text: "#78350F", num: "1" },
                { key: "second", label: "2순위", bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", num: "2" },
                { key: "third", label: "3순위", bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", num: "3" }].map(({ key, label, bg, border, text, num }) => (
                <div key={key} className="rank-card" style={{ borderColor: border }}>
                  <div className="rank-badge" style={{ background: bg, color: text }}>{num}</div>
                  <div style={{ flex: 1 }}>
                    <label className="label">{label}</label>
                    <select className="select" value={industryPrefs[key]} onChange={e => setIndustryPrefs(p => ({ ...p, [key]: e.target.value }))}>
                      <option value="">산업 선택</option>
                      {INDUSTRIES.map(ind => <option key={ind}>{ind}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="fade-up">
              <p className="page-title">희망 직무 선택</p>
              <p className="page-desc">1순위 직무를 중심으로 지원동기가 작성됩니다.</p>
              {[{ key: "first", label: "1순위", bg: "#EFF6FF", border: "#3B82F6", text: "#1E3A8A", num: "1" },
                { key: "second", label: "2순위", bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", num: "2" },
                { key: "third", label: "3순위", bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", num: "3" }].map(({ key, label, bg, border, text, num }) => (
                <div key={key} className="rank-card" style={{ borderColor: border }}>
                  <div className="rank-badge" style={{ background: bg, color: text }}>{num}</div>
                  <div style={{ flex: 1 }}>
                    <label className="label">{label}</label>
                    <select className="select" value={jobPrefs[key]} onChange={e => setJobPrefs(j => ({ ...j, [key]: e.target.value }))}>
                      <option value="">직무 선택</option>
                      {JOBS.map(j => <option key={j}>{j}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="fade-up">
              <p className="page-title">기업분석 자료 업로드</p>
              <p className="page-desc">각 항목마다 파일을 최대 3개까지 올릴 수 있어요. 모두 선택사항이에요.</p>
              {[
                { key: "porter", icon: "♟️", title: "마이클 포터 5 Forces 분석", desc: "경쟁강도, 공급자/구매자 교섭력, 신규진입, 대체재 위협" },
                { key: "pest",   icon: "🌍", title: "PEST 분석",                 desc: "정치·경제·사회·기술 환경 분석 자료" },
                { key: "finance",icon: "💰", title: "재무분석 자료",              desc: "DART 사업보고서, 네이버증권 재무제표" },
                { key: "news",   icon: "📰", title: "이슈분석 자료",              desc: "빅카인즈 뉴스 분석, 주요 이슈 텍스트" },
              ].map(({ key, icon, title, desc }) => (
                <div key={key} className="upload-card">
                  <div className="upload-header">
                    <div className="upload-icon">{icon}</div>
                    <div><div className="upload-title">{title}</div><div className="upload-desc">{desc}</div></div>
                  </div>
                  {uploads[key].files.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
                      {uploads[key].files.map((f, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className="file-badge">✓ {f.name}</span>
                          <button className="delete-btn" onClick={() => removeFile(key, idx)}>🗑 삭제</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploads[key].files.length < 3 && (
                    <div style={{ marginBottom: "10px" }}>
                      {fileRefs[key].map((ref, idx) => (
                        <input key={idx} type="file" ref={ref} accept=".txt,.csv,.xlsx,.xls,.pdf"
                          onChange={e => { handleFileAdd(key, e.target.files[0]); e.target.value = ""; }} style={{ display: "none" }} />
                      ))}
                      <button className="upload-btn" onClick={() => fileRefs[key][uploads[key].files.length].current.click()}>
                        📎 파일 추가 {uploads[key].files.length > 0 ? `(${uploads[key].files.length}/3)` : ""}
                      </button>
                    </div>
                  )}
                  {uploads[key].files.length >= 3 && <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "10px" }}>✓ 파일 3개 업로드 완료</div>}
                  <div>
                    <label className="label">또는 직접 붙여넣기</label>
                    <textarea className="textarea" placeholder="분석 내용을 직접 입력하거나 붙여넣어 주세요..."
                      value={uploads[key].text} onChange={e => setUploads(u => ({ ...u, [key]: { ...u[key], text: e.target.value } }))} />
                    {uploads[key].text && (
                      <button className="delete-btn" style={{ marginTop: "6px" }} onClick={() => setUploads(u => ({ ...u, [key]: { ...u[key], text: "" } }))}>🗑 내용 삭제</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="fade-up">
              <p className="page-title">지원동기 생성</p>
              <p className="page-desc">입력한 정보를 AI가 분석해 맞춤형 지원동기를 작성해드려요.</p>
              <div className="card">
                <div className="summary-grid">
                  {[
                    ["지원 기업", profile.company || "-"],
                    ["희망 산업", industryPrefs.first || "-"],
                    ["희망 직무", jobPrefs.first || "-"],
                    ["분석 자료", Object.values(uploads).reduce((acc, u) => acc + u.files.length + (u.text ? 1 : 0), 0) + "개"],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="summary-item">
                      <div className="summary-label">{lbl}</div>
                      <div className="summary-value">{val}</div>
                    </div>
                  ))}
                </div>
                <button className="generate-btn" onClick={generateMotivation} disabled={loading}>
                  {loading ? <><div className="spinner" /> AI가 작성 중입니다...</> : <>✨ 지원동기 생성하기</>}
                </button>
              </div>
              {result && (
                <div className="card">
                  <div className="result-header">
                    <div className="result-title">📝 생성된 지원동기</div>
                    <button className="copy-btn" onClick={handleCopy}>{copied ? "✓ 복사됨!" : "📋 복사"}</button>
                  </div>
                  <div className="result-box">{result}</div>
                  <div className="result-note">⚠️ AI가 생성한 초안입니다. 실제 제출 전 반드시 본인의 경험과 언어로 수정하세요.</div>
                </div>
              )}
            </div>
          )}

          <div className="nav">
            <button className="nav-prev" onClick={() => setStep(s => s - 1)} disabled={step === 0}>← 이전</button>
            {step < STEPS.length - 1 && <button className="nav-next" onClick={() => setStep(s => s + 1)}>다음 →</button>}
          </div>

        </div>
      </div>
    </>
  );
}