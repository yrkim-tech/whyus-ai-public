"use client";
import { useState, useRef, useEffect } from "react";

const STEPS = [
  { id: "profile", label: "개인프로필", icon: "👤" },
  { id: "experience", label: "활동·자격·어학", icon: "🏆" },
  { id: "story", label: "경험스토리", icon: "⭐" },
  { id: "target", label: "희망산업/기업/직무", icon: "🎯" },
  { id: "analysis", label: "기업분석", icon: "📊" },
  { id: "result", label: "지원동기작성", icon: "✨" },
];

const STEP_COLORS = [
  { bg: "#F0FDF8", border: "#10B981", text: "#065F46" },
  { bg: "#F5F3FF", border: "#7C3AED", text: "#4C1D95" },
  { bg: "#FFF7ED", border: "#F97316", text: "#7C2D12" },
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

const DEFAULT_STAR = { title: "", situation: "", task: "", action: "", result: "" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F8FAFC; font-family: 'Noto Sans KR', sans-serif; color: #1E293B; min-height: 100vh; }
  .app-wrap { min-height: 100vh; background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%); padding: 2rem 1rem 4rem; }
  .container { max-width: 680px; margin: 0 auto; }

  .header { text-align: center; margin-bottom: 2.5rem; padding: 2.5rem 2rem; background: white; border-radius: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #10B981, #3B82F6, #7C3AED, #F59E0B, #F43F5E); }
  .header-badge { display: inline-flex; align-items: center; gap: 6px; background: #F0FDF8; border: 1px solid #D1FAE5; color: #065F46; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; padding: 4px 12px; border-radius: 99px; margin-bottom: 1rem; }
  .header h1 { font-size: 28px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px; margin-bottom: 0.5rem; }
  .header-sub { font-size: 14px; font-weight: 500; color: #475569; margin-bottom: 0.75rem; }
  .header p { font-size: 13px; color: #64748B; line-height: 1.8; max-width: 500px; margin: 0 auto; }

  .steps-wrap { display: flex; gap: 4px; margin-bottom: 1.5rem; padding-bottom: 4px; flex-wrap: wrap; justify-content: center; }
  .step-btn { display: flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 99px; border: 1.5px solid #E2E8F0; background: white; color: #94A3B8; font-size: 11px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s ease; font-family: inherit; }
  .step-btn:hover { background: #F8FAFC; }
  .step-check { width: 14px; height: 14px; border-radius: 50%; background: #10B981; color: white; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; }

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
  .tab-btn { flex: 1; padding: 8px 12px; border-radius: 10px; border: none; background: transparent; color: #94A3B8; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .tab-btn.active { background: white; color: #1E293B; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

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

  .star-card { background: white; border-radius: 20px; padding: 1.5rem; margin-bottom: 1rem; border: 1.5px solid #FFF7ED; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative; }
  .star-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; margin-bottom: 6px; }
  .star-s { background: #FFF7ED; color: #C2410C; border: 1px solid #FED7AA; }
  .star-t { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
  .star-a { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .star-r { background: #FDF4FF; color: #7E22CE; border: 1px solid #E9D5FF; }
  .star-title-input { width: 100%; padding: 8px 12px; font-size: 15px; font-weight: 600; font-family: inherit; border: none; border-bottom: 1.5px solid #E2E8F0; background: transparent; color: #1E293B; outline: none; margin-bottom: 1rem; box-sizing: border-box; }
  .star-title-input:focus { border-bottom-color: #F97316; }
  .star-title-input::placeholder { color: #CBD5E1; font-weight: 400; }

  .link-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .link-input { flex: 1; padding: 9px 12px; font-size: 13px; font-family: inherit; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #FAFAFA; color: #1E293B; outline: none; transition: all 0.2s; min-width: 0; }
  .link-input:focus { border-color: #3B82F6; background: white; }
  .link-input::placeholder { color: #CBD5E1; }
  .link-open-btn { display: inline-flex; align-items: center; gap: 4px; padding: 8px 12px; border: 1.5px solid #DBEAFE; border-radius: 10px; background: #EFF6FF; color: #2563EB; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap; text-decoration: none; font-family: inherit; }
  .link-add-btn { display: inline-flex; align-items: center; gap: 4px; padding: 7px 12px; border: 1.5px dashed #E2E8F0; border-radius: 10px; background: transparent; color: #94A3B8; font-size: 12px; cursor: pointer; font-family: inherit; }
  .link-add-btn:hover { border-color: #3B82F6; color: #3B82F6; }
  .link-del-btn { display: inline-flex; align-items: center; padding: 8px; border: 1.5px solid #FEE2E2; border-radius: 10px; background: white; color: #EF4444; cursor: pointer; font-size: 13px; flex-shrink: 0; }

  .api-key-box { background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }
  .api-key-title { font-size: 13px; font-weight: 600; color: #92400E; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
  .api-key-desc { font-size: 12px; color: #B45309; margin-bottom: 10px; line-height: 1.6; }
  .api-key-row { display: flex; gap: 8px; align-items: center; }
  .api-key-input { flex: 1; padding: 10px 14px; font-size: 13px; font-family: inherit; border: 1.5px solid #FCD34D; border-radius: 10px; background: white; color: #1E293B; outline: none; transition: all 0.2s; }
  .api-key-input:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
  .api-key-toggle { padding: 10px 14px; border: 1.5px solid #FCD34D; border-radius: 10px; background: white; color: #92400E; font-size: 12px; cursor: pointer; white-space: nowrap; font-family: inherit; transition: all 0.2s; }
  .api-key-toggle:hover { background: #FFFBEB; }
  .api-key-link { font-size: 11px; color: #B45309; margin-top: 8px; display: block; text-decoration: underline; }
  .summary-item { background: white; border-radius: 14px; padding: 12px; text-align: center; border: 1px solid #F1F5F9; }
  .summary-label { font-size: 10px; color: #94A3B8; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px; }
  .summary-value { font-size: 13px; font-weight: 700; color: #1E293B; }
  .save-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 10px 14px; background: #F0FDF8; border: 1px solid #D1FAE5; border-radius: 12px; }
  .auto-save-badge { font-size: 12px; color: #065F46; font-weight: 500; display: flex; align-items: center; gap: 4px; }
  .clear-btn { display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px; border: 1.5px solid #FEE2E2; border-radius: 8px; background: white; color: #EF4444; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; }
  .clear-btn:hover { background: #FFF1F2; }
  .doc-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; border-radius: 10px; background: #1E3A8A; color: white; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .doc-btn:hover { background: #1e40af; }

  .generate-btn { width: 100%; padding: 14px; border: none; border-radius: 14px; background: linear-gradient(135deg, #1E293B 0%, #334155 100%); color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(30,41,59,0.3); }
  .generate-btn:hover { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); transform: translateY(-1px); }
  .generate-btn:disabled { background: #E2E8F0; color: #94A3B8; cursor: not-allowed; box-shadow: none; transform: none; }

  .result-box { background: #FAFAFA; border-radius: 14px; padding: 1.25rem 1.5rem; font-size: 14px; line-height: 1.9; color: #334155; white-space: pre-wrap; border: 1px solid #F1F5F9; }
  .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .result-title { font-size: 14px; font-weight: 700; color: #1E293B; }
  .copy-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: white; color: #64748B; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; }
  .copy-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .result-note { margin-top: 12px; font-size: 11px; color: #94A3B8; line-height: 1.6; }

  .nav { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #F1F5F9; }
  .nav-prev { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border: 1.5px solid #E2E8F0; border-radius: 12px; background: white; color: #64748B; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; }
  .nav-prev:disabled { opacity: 0.4; cursor: not-allowed; }
  .nav-next { display: flex; align-items: center; gap: 6px; padding: 10px 24px; border: none; border-radius: 12px; background: #1E293B; color: white; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; box-shadow: 0 2px 8px rgba(30,41,59,0.25); }
  .nav-next:hover { background: #0F172A; }

  .page-title { font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
  .page-desc { font-size: 13px; color: #94A3B8; margin-bottom: 1.5rem; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.3s ease forwards; }
`;

export default function Home() {
  const [step, setStep] = useState(0);

  // localStorage에서 저장된 데이터 불러오기
  const loadSaved = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem("whyus_" + key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch { return defaultVal; }
  };

  const [profile, setProfile] = useState(() => loadSaved("profile", { name: "", major: "", minor: "", grade: "", gender: "", gpa: "", disc: "" }));
  const [experience, setExperience] = useState(() => loadSaved("experience", {
    activities: [{ type: "", name: "", period: "", description: "" }],
    certs: [{ name: "", grade: "", year: "" }],
    languages: [{ lang: "", test: "", score: "" }],
  }));
  const [stars, setStars] = useState(() => loadSaved("stars", [{ ...DEFAULT_STAR }]));
  const [target, setTarget] = useState({ industry: "", company: "", job: "" });
  const [uploads, setUploads] = useState({
    porter:  { files: [], text: "", links: [""] },
    pest:    { files: [], text: "", links: [""] },
    finance: { files: [], text: "", links: [""] },
    news:    { files: [], text: "", links: [""] },
    etc:     { files: [], text: "", links: [""] },
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("activities");
  const [copied, setCopied] = useState(false);
  const [discFile, setDiscFile] = useState(null);
  const discRef = useRef(null);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // 자동 저장 - profile, experience, stars 변경 시 저장
  useEffect(() => {
    try { localStorage.setItem("whyus_profile", JSON.stringify(profile)); } catch {}
  }, [profile]);
  useEffect(() => {
    try { localStorage.setItem("whyus_experience", JSON.stringify(experience)); } catch {}
  }, [experience]);
  useEffect(() => {
    try { localStorage.setItem("whyus_stars", JSON.stringify(stars)); } catch {}
  }, [stars]);

  // 저장 초기화
  const clearSaved = () => {
    ["profile", "experience", "stars"].forEach(k => {
      try { localStorage.removeItem("whyus_" + k); } catch {}
    });
    setProfile({ name: "", major: "", minor: "", grade: "", gender: "", gpa: "", disc: "" });
    setExperience({
      activities: [{ type: "", name: "", period: "", description: "" }],
      certs: [{ name: "", grade: "", year: "" }],
      languages: [{ lang: "", test: "", score: "" }],
    });
    setStars([{ ...DEFAULT_STAR }]);
    setSaveMsg("초기화 완료!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  // DOC 다운로드
  const downloadDoc = () => {
    if (!result) return;
    const content = result;
    const blob = new Blob(["\ufeff" + content], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (target.company || "지원동기") + "_WhyUsAI.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  const fileRefs = {
    porter:  [useRef(null), useRef(null), useRef(null)],
    pest:    [useRef(null), useRef(null), useRef(null)],
    finance: [useRef(null), useRef(null), useRef(null)],
    news:    [useRef(null), useRef(null), useRef(null)],
    etc:     [useRef(null), useRef(null), useRef(null)],
  };

  const handleFileAdd = (key, file) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploads(prev => ({
          ...prev,
          [key]: { ...prev[key], files: [...prev[key].files, { name: file.name, text: "[이미지 첨부: " + file.name + "]", preview: e.target.result, isImage: true }] }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploads(prev => ({
          ...prev,
          [key]: { ...prev[key], files: [...prev[key].files, { name: file.name, text: e.target.result.slice(0, 2000), isImage: false }] }
        }));
      };
      reader.readAsText(file, "utf-8");
    }
  };

  const removeFile = (key, idx) => setUploads(u => ({ ...u, [key]: { ...u[key], files: u[key].files.filter((_, i) => i !== idx) } }));
  const addLink = (key) => setUploads(u => ({ ...u, [key]: { ...u[key], links: [...u[key].links, ""] } }));
  const updateLink = (key, idx, val) => setUploads(u => ({ ...u, [key]: { ...u[key], links: u[key].links.map((l, i) => i === idx ? val : l) } }));
  const removeLink = (key, idx) => setUploads(u => ({ ...u, [key]: { ...u[key], links: u[key].links.filter((_, i) => i !== idx) } }));

  const addItem = (section, template) => setExperience(ex => ({ ...ex, [section]: [...ex[section], { ...template }] }));
  const removeItem = (section, idx) => setExperience(ex => ({ ...ex, [section]: ex[section].filter((_, i) => i !== idx) }));
  const updateItem = (section, idx, field, val) => setExperience(ex => ({
    ...ex, [section]: ex[section].map((item, i) => i === idx ? { ...item, [field]: val } : item)
  }));

  const addStar = () => setStars(s => [...s, { ...DEFAULT_STAR }]);
  const removeStar = (idx) => setStars(s => s.filter((_, i) => i !== idx));
  const updateStar = (idx, field, val) => setStars(s => s.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const generateMotivation = async () => {
    setLoading(true);
    setResult("");
    const starText = stars.filter(s => s.title || s.situation).map((s, i) =>
      "[경험 " + (i+1) + "] " + s.title + "\n- Situation: " + s.situation + "\n- Task: " + s.task + "\n- Action: " + s.action + "\n- Result: " + s.result
    ).join("\n\n") || "없음";

    const prompt = "당신은 20년 경력의 취업 컨설턴트입니다. 다음 지원자의 정보를 바탕으로 스타일이 다른 지원동기 3개 버전을 작성해 주세요.\n\n" +
      "## 지원자 기본정보\n" +
      "- 이름: " + profile.name + " / 전공: " + profile.major + " / 부전공: " + (profile.minor || "없음") + "\n" +
      "- 학년: " + profile.grade + " | 성별: " + profile.gender + " | 학점: " + profile.gpa + "\n" +
      "- DISC 유형: " + (profile.disc || "미입력") + "\n\n" +
      "## 희망산업: " + (target.industry || "미입력") + "\n" +
      "## 지원기업: " + (target.company || "미입력") + "\n" +
      "## 희망직무: " + (target.job || "미입력") + "\n\n" +
      "## 대내외 활동 경험\n" +
      experience.activities.map(a => "- [" + a.type + "] " + a.name + " (" + a.period + "): " + a.description).join("\n") + "\n\n" +
      "## 자격증\n" + (experience.certs.map(c => "- " + c.name + " " + c.grade + " (" + c.year + ")").join("\n") || "없음") + "\n\n" +
      "## 외국어\n" + (experience.languages.map(l => "- " + l.lang + " " + l.test + " " + l.score).join("\n") || "없음") + "\n\n" +
      "## STAR 경험스토리 (지원동기 흐름 속에 자연스럽게 녹여주세요)\n" + starText + "\n\n" +
      "## 기업분석 자료 (★ 가장 중요 — 이 자료를 중심으로 지원동기를 구성하세요)\n" +
      "### 마이클 포터 5 Forces: " + ([...uploads.porter.files.map(f => f.text), uploads.porter.text].filter(Boolean).join("\n") || "(자료 없음)") + "\n" +
      "### PEST 분석: " + ([...uploads.pest.files.map(f => f.text), uploads.pest.text].filter(Boolean).join("\n") || "(자료 없음)") + "\n" +
      "### 재무분석: " + ([...uploads.finance.files.map(f => f.text), uploads.finance.text].filter(Boolean).join("\n") || "(자료 없음)") + "\n" +
      "### 이슈분석: " + ([...uploads.news.files.map(f => f.text), uploads.news.text].filter(Boolean).join("\n") || "(자료 없음)") + "\n" +
      "### 기타자료: " + ([...uploads.etc.files.map(f => f.text), uploads.etc.text].filter(Boolean).join("\n") || "(자료 없음)") + "\n\n" +
      "## 작성 지침\n" +
      "공통 원칙:\n" +
      "1. 기업분석 자료(재무수치, 이슈, 산업트렌드, 경쟁구조 등)를 구체적으로 인용하며 해당 기업에 지원하는 이유와 관심을 전체 내용의 60~70% 비중으로 작성하세요\n" +
      "2. 나머지 30~40%는 지원자의 STAR 경험과 역량이 해당 직무와 어떻게 연결되는지 서술하세요\n" +
      "3. STAR 경험스토리는 단순 나열이 아닌 지원동기 흐름 속에 자연스럽게 녹여주세요\n" +
      "4. 지원자의 DISC 유형 특성이 직무 수행 방식에 자연스럽게 드러나도록 해주세요\n" +
      "5. 분량: 각 버전 500~700자 내외\n" +
      "6. 기업분석 자료가 없는 항목은 언급하지 마세요\n\n" +
      "3가지 버전으로 작성해주세요:\n\n" +
      "【버전 1 - 열정·비전형】\n" +
      "기업분석 자료에서 발견한 기업의 성장 가능성과 비전에 공감하는 내용을 중심으로, 입사 후 기여 포부가 느껴지는 문체로 작성\n\n" +
      "【버전 2 - 경험·역량형】\n" +
      "기업분석 자료에서 도출한 기업의 핵심 과제와 지원자의 STAR 경험 역량이 어떻게 연결되는지 논리적으로 작성\n\n" +
      "【버전 3 - 스토리텔링형】\n" +
      "기업분석 자료에서 인상 깊었던 수치나 이슈로 시작해서 지원자의 경험과 자연스럽게 연결되는 스토리텔링 문체로 작성\n\n" +
      "각 버전은 【버전 1 - 열정·비전형】, 【버전 2 - 경험·역량형】, 【버전 3 - 스토리텔링형】 제목으로 구분해주세요.\n" +
      "지원동기 3개 버전만 작성해 주세요. 추가 설명 없이 바로 시작해 주세요.";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      setResult(data.content?.map(b => b.text || "").join("") || "생성에 실패했습니다.");
    } catch (e) {
      setResult("오류가 발생했습니다. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <style>{css}</style>
      <div className="app-wrap">
        <div className="container">

          {/* 헤더 */}
          <div className="header">
            <div className="header-badge">✦ AI로 완성하는 나만의 지원동기 생성기</div>
            <h1>WhyUs AI</h1>
            <p>개인정보와 희망 산업, 직무, 기업정보를 입력하면 지원동기를 작성해드립니다.</p>
            <p style={{ marginTop: "6px" }}>각각의 정보를 구체적으로 입력할수록 지원 동기가 더 풍성해질 수 있습니다.</p>
            <p style={{ marginTop: "6px" }}>다만 WhyUs AI 지원 동기 초안 작성 후 반드시 본인의 언어로 수정하시기를 권유드립니다.</p>
            <p style={{ marginTop: "14px", fontWeight: 500, color: "#334155" }}>당신의 꿈을 응원합니다. 🙂</p>
          </div>

          {/* 스텝 탭 */}
          <div className="steps-wrap">
            {STEPS.map((s, i) => {
              const c = STEP_COLORS[i];
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button key={s.id} className="step-btn" onClick={() => setStep(i)}
                  style={isActive ? { background: c.bg, borderColor: c.border, color: c.text, fontWeight: 600 }
                    : isDone ? { background: "#F8FAFC", borderColor: "#CBD5E1", color: "#64748B" } : {}}>
                  <span>{s.icon}</span>
                  {s.label}
                  {isDone && <span className="step-check">✓</span>}
                </button>
              );
            })}
          </div>

          {/* STEP 0: 개인프로필 */}
          {step === 0 && (
            <div className="fade-up">
              <p className="page-title">기본 정보 입력</p>
              <p className="page-desc">입력할수록 더 정확한 지원동기가 만들어져요.</p>
              <div className="save-bar">
                <span className="auto-save-badge">💾 자동저장 중 — 다음에 접속해도 유지돼요</span>
                <button className="clear-btn" onClick={clearSaved}>🗑 전체 초기화</button>
              </div>
              <div className="card">
                <div className="grid-2">
                  {[["이름", "name", "홍길동"], ["전공", "major", "경영학과"], ["부전공", "minor", "데이터사이언스"], ["학점 (4.5기준)", "gpa", "3.8"]].map(([lbl, key, ph]) => (
                    <div key={key}>
                      <label className="label">{lbl}</label>
                      <input className="input" placeholder={ph} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
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
                      <option>남성</option>
                      <option>여성</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="label">eDISC 유형 (선택사항)</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <select className="select" value={profile.disc} onChange={e => setProfile(p => ({ ...p, disc: e.target.value }))} style={{ flex: 1 }}>
                        <option value="">선택하세요</option>
                        {DISC.map(d => <option key={d}>{d}</option>)}
                      </select>
                      <input type="file" ref={discRef} accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => { setDiscFile(e.target.files[0]); }} style={{ display: "none" }} />
                      <button className="upload-btn" onClick={() => discRef.current.click()} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                        📄 결과 업로드
                      </button>
                    </div>
                    {discFile && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                        <span className="file-badge">✓ {discFile.name}</span>
                        <button className="delete-btn" onClick={() => { setDiscFile(null); if (discRef.current) discRef.current.value = ""; }}>🗑 삭제</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: 활동·자격·어학 */}
          {step === 1 && (
            <div className="fade-up">
              <p className="page-title">활동·자격·어학</p>
              <p className="page-desc">경험이 많을수록 더 풍부한 지원동기가 만들어져요.</p>
              <div className="tabs">
                {[{ key: "activities", label: "🎯 대내외활동" }, { key: "certs", label: "📜 자격증" }, { key: "languages", label: "🌏 외국어" }].map(({ key, label }) => (
                  <button key={key} className={"tab-btn" + (activeTab === key ? " active" : "")} onClick={() => setActiveTab(key)}>{label}</button>
                ))}
              </div>

              {activeTab === "activities" && (
                <div>
                  {experience.activities.map((act, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("activities", idx)}>✕</button>}
                      <div className="grid-2">
                        <div>
                          <label className="label">활동 유형</label>
                          <select className="select" value={act.type} onChange={e => updateItem("activities", idx, "type", e.target.value)}>
                            <option value="">선택</option>
                            {["인턴십","동아리","학회","봉사활동","공모전/대회","프로젝트","아르바이트","교환학생","기타"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">활동명</label>
                          <input className="input" placeholder="마케팅 서포터즈" value={act.name} onChange={e => updateItem("activities", idx, "name", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">기간</label>
                          <input className="input" placeholder="2024.03 ~ 2024.08" value={act.period} onChange={e => updateItem("activities", idx, "period", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">주요 활동 내용</label>
                          <input className="input" placeholder="SNS 콘텐츠 기획 및 운영" value={act.description} onChange={e => updateItem("activities", idx, "description", e.target.value)} />
                        </div>
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
                        <div>
                          <label className="label">자격증명</label>
                          <input className="input" placeholder="정보처리기사" value={c.name} onChange={e => updateItem("certs", idx, "name", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">등급/결과</label>
                          <input className="input" placeholder="1급" value={c.grade} onChange={e => updateItem("certs", idx, "grade", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">취득 연도</label>
                          <input className="input" placeholder="2024" value={c.year} onChange={e => updateItem("certs", idx, "year", e.target.value)} />
                        </div>
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
                        <div>
                          <label className="label">언어</label>
                          <select className="select" value={l.lang} onChange={e => updateItem("languages", idx, "lang", e.target.value)}>
                            <option value="">선택</option>
                            {["영어","일본어","중국어","독일어","프랑스어","스페인어","기타"].map(x => <option key={x}>{x}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">시험</label>
                          <input className="input" placeholder="TOEIC" value={l.test} onChange={e => updateItem("languages", idx, "test", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">점수/등급</label>
                          <input className="input" placeholder="870" value={l.score} onChange={e => updateItem("languages", idx, "score", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("languages", { lang: "", test: "", score: "" })}>+ 외국어 추가</button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: 경험스토리 STAR */}
          {step === 2 && (
            <div className="fade-up">
              <p className="page-title">경험스토리 (STAR 기법)</p>
              <p className="page-desc">Situation → Task → Action → Result 순서로 경험을 작성하면 지원동기에 자동 반영됩니다.</p>
              <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {[
                  { label: "S", name: "Situation · 상황", cls: "star-s" },
                  { label: "T", name: "Task · 과제",      cls: "star-t" },
                  { label: "A", name: "Action · 행동",    cls: "star-a" },
                  { label: "R", name: "Result · 결과",    cls: "star-r" },
                ].map(({ label, name, cls }) => (
                  <span key={label} className={"star-badge " + cls}><strong>{label}</strong> {name}</span>
                ))}
              </div>
              {stars.map((star, idx) => (
                <div key={idx} className="star-card">
                  {idx > 0 && <button className="remove-btn" onClick={() => removeStar(idx)}>✕</button>}
                  <input className="star-title-input" placeholder="경험 제목 (예: 마케팅 공모전 수상, 인턴십 프로젝트 성공)"
                    value={star.title} onChange={e => updateStar(idx, "title", e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    {[
                      { field: "situation", label: "S", name: "Situation (상황)", cls: "star-s", ph: "어떤 상황/배경이었나요?" },
                      { field: "task",      label: "T", name: "Task (과제/목표)", cls: "star-t", ph: "무엇을 해야 했나요?" },
                      { field: "action",    label: "A", name: "Action (행동/노력)", cls: "star-a", ph: "어떻게 행동했나요?" },
                      { field: "result",    label: "R", name: "Result (결과/성과)", cls: "star-r", ph: "어떤 결과가 나왔나요?" },
                    ].map(({ field, label, name, cls, ph }) => (
                      <div key={field}>
                        <span className={"star-badge " + cls}><strong>{label}</strong> {name}</span>
                        <textarea className="textarea" placeholder={ph} rows={2}
                          value={star[field]} onChange={e => updateStar(idx, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={addStar}>⭐ 경험스토리 추가</button>
            </div>
          )}

          {/* STEP 3: 희망산업/기업/직무 */}
          {step === 3 && (
            <div className="fade-up">
              <p className="page-title">희망 산업 / 기업 / 직무</p>
              <p className="page-desc">목록에서 선택하거나 직접 입력해 주세요.</p>
              <div className="card">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label className="label">🏭 희망 산업</label>
                    <select className="select" value={INDUSTRIES.includes(target.industry) ? target.industry : ""} onChange={e => setTarget(t => ({ ...t, industry: e.target.value }))} style={{ marginBottom: "8px" }}>
                      <option value="">목록에서 선택</option>
                      {INDUSTRIES.map(ind => <option key={ind}>{ind}</option>)}
                    </select>
                    <input className="input" placeholder="또는 직접 입력 (예: 엔터테인먼트/K-콘텐츠)" value={target.industry}
                      onChange={e => setTarget(t => ({ ...t, industry: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">🏢 지원 기업명</label>
                    <input className="input" placeholder="예: 삼성전자, CJ ENM, 현대자동차" value={target.company}
                      onChange={e => setTarget(t => ({ ...t, company: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">💼 희망 직무</label>
                    <select className="select" value={JOBS.includes(target.job) ? target.job : ""} onChange={e => setTarget(t => ({ ...t, job: e.target.value }))} style={{ marginBottom: "8px" }}>
                      <option value="">목록에서 선택</option>
                      {JOBS.map(j => <option key={j}>{j}</option>)}
                    </select>
                    <input className="input" placeholder="또는 직접 입력 (예: 글로벌 마케팅, 콘텐츠 기획)" value={target.job}
                      onChange={e => setTarget(t => ({ ...t, job: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 기업분석 */}
          {step === 4 && (
            <div className="fade-up">
              <p className="page-title">기업분석 자료 업로드</p>
              <p className="page-desc">파일·이미지 업로드, 링크 추가, 직접입력 모두 가능해요. 모두 선택사항이에요.</p>
              {[
                { key: "porter", icon: "♟️", title: "마이클 포터 5 Forces 분석", desc: "경쟁강도, 공급자/구매자 교섭력, 신규진입, 대체재 위협" },
                { key: "pest",   icon: "🌍", title: "PEST 분석",                 desc: "정치·경제·사회·기술 환경 분석 자료" },
                { key: "finance",icon: "💰", title: "재무분석 자료",              desc: "DART 사업보고서, 네이버증권 재무제표" },
                { key: "news",   icon: "📰", title: "이슈분석 자료",              desc: "빅카인즈 뉴스 분석, 주요 이슈 텍스트" },
                { key: "etc",    icon: "📁", title: "기타 자료",                  desc: "위 항목 외 추가로 참고할 자료" },
              ].map(({ key, icon, title, desc }) => (
                <div key={key} className="upload-card">
                  <div className="upload-header">
                    <div className="upload-icon">{icon}</div>
                    <div>
                      <div className="upload-title">{title}</div>
                      <div className="upload-desc">{desc}</div>
                    </div>
                  </div>

                  {uploads[key].files.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
                      {uploads[key].files.map((f, idx) => (
                        <div key={idx}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="file-badge">{f.isImage ? "🖼 " : "✓ "}{f.name}</span>
                            <button className="delete-btn" onClick={() => removeFile(key, idx)}>🗑 삭제</button>
                          </div>
                          {f.isImage && f.preview && (
                            <img src={f.preview} alt={f.name}
                              style={{ marginTop: "8px", maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", border: "1px solid #E2E8F0", objectFit: "contain" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {uploads[key].files.length < 3 && (
                    <div style={{ marginBottom: "12px" }}>
                      {fileRefs[key].map((ref, idx) => (
                        <input key={idx} type="file" ref={ref}
                          accept=".txt,.csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png,.gif,.webp"
                          onChange={e => { handleFileAdd(key, e.target.files[0]); e.target.value = ""; }}
                          style={{ display: "none" }} />
                      ))}
                      <button className="upload-btn" onClick={() => fileRefs[key][uploads[key].files.length].current.click()}>
                        📎 파일/이미지 추가 {uploads[key].files.length > 0 ? "(" + uploads[key].files.length + "/3)" : ""}
                      </button>
                    </div>
                  )}
                  {uploads[key].files.length >= 3 && (
                    <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "10px" }}>✓ 파일 3개 업로드 완료</div>
                  )}

                  <div style={{ marginBottom: "12px" }}>
                    <label className="label">🔗 참고 링크</label>
                    {uploads[key].links.map((link, idx) => (
                      <div key={idx} className="link-row">
                        <input className="link-input" placeholder="https://dart.fss.or.kr 등 참고 URL"
                          value={link} onChange={e => updateLink(key, idx, e.target.value)} />
                        {link && (
                          <a href={link} target="_blank" rel="noreferrer" className="link-open-btn">🔗 열기</a>
                        )}
                        {uploads[key].links.length > 1 && (
                          <button className="link-del-btn" onClick={() => removeLink(key, idx)}>✕</button>
                        )}
                      </div>
                    ))}
                    {uploads[key].links.length < 3 && (
                      <button className="link-add-btn" onClick={() => addLink(key)}>+ 링크 추가</button>
                    )}
                  </div>

                  <div>
                    <label className="label">✏️ 직접 붙여넣기</label>
                    <textarea className="textarea" placeholder="분석 내용을 직접 입력하거나 붙여넣어 주세요..."
                      value={uploads[key].text}
                      onChange={e => setUploads(u => ({ ...u, [key]: { ...u[key], text: e.target.value } }))} />
                    {uploads[key].text && (
                      <button className="delete-btn" style={{ marginTop: "6px" }}
                        onClick={() => setUploads(u => ({ ...u, [key]: { ...u[key], text: "" } }))}>🗑 내용 삭제</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: 지원동기 생성 */}
          {step === 5 && (
            <div className="fade-up">
              <p className="page-title">지원동기 생성</p>
              <p className="page-desc">입력한 정보를 AI가 분석해 맞춤형 지원동기 3가지를 작성해드려요.</p>
              <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: "16px", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#92400E", marginBottom: "4px" }}>🔑 Anthropic API 키 입력</div>
                <div style={{ fontSize: "12px", color: "#B45309", marginBottom: "10px", lineHeight: "1.6" }}>
                  본인의 Anthropic API 키를 입력해야 지원동기를 생성할 수 있어요.<br />
                  API 키는 이 페이지에 저장되지 않으며 생성 시에만 사용됩니다.
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input style={{ flex: 1, padding: "10px 14px", fontSize: "13px", fontFamily: "inherit", border: "1.5px solid #FCD34D", borderRadius: "10px", background: "white", color: "#1E293B", outline: "none" }}
                    type={showKey ? "text" : "password"} placeholder="sk-ant-api03-..."
                    value={apiKey} onChange={e => setApiKey(e.target.value)} />
                  <button style={{ padding: "10px 14px", border: "1.5px solid #FCD34D", borderRadius: "10px", background: "white", color: "#92400E", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}
                    onClick={() => setShowKey(v => !v)}>
                    {showKey ? "🙈 숨기기" : "👁 보기"}
                  </button>
                </div>
                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
                  style={{ fontSize: "11px", color: "#B45309", marginTop: "8px", display: "block", textDecoration: "underline" }}>
                  👉 API 키가 없으신가요? console.anthropic.com 에서 무료로 발급받으세요
                </a>
              </div>
              <div className="card">
                <div className="summary-grid">
                  {[
                    ["지원 기업", target.company || "-"],
                    ["희망 산업", target.industry || "-"],
                    ["희망 직무", target.job || "-"],
                    ["분석 자료", Object.values(uploads).reduce((acc, u) => acc + u.files.length + (u.text ? 1 : 0), 0) + "개"],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="summary-item">
                      <div className="summary-label">{lbl}</div>
                      <div className="summary-value">{val}</div>
                    </div>
                  ))}
                </div>
                <button className="generate-btn" onClick={generateMotivation} disabled={loading}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className="spinner" /> AI가 작성 중입니다...
                    </span>
                  ) : "✨ 지원동기 생성하기"}
                </button>
              </div>
              {result && (
                <div className="card">
                  <div className="result-header">
                    <div className="result-title">📝 생성된 지원동기</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="copy-btn" onClick={handleCopy}>{copied ? "✓ 복사됨!" : "📋 복사"}</button>
                      <button className="doc-btn" onClick={downloadDoc}>📄 DOC 다운로드</button>
                    </div>
                  </div>
                  <div className="result-box">{result}</div>
                  <div className="result-note">⚠️ AI가 생성한 초안입니다. 실제 제출 전 반드시 본인의 경험과 언어로 수정하세요.</div>
                </div>
              )}
            </div>
          )}

          {/* 네비게이션 */}
          <div className="nav">
            <button className="nav-prev" onClick={() => setStep(s => s - 1)} disabled={step === 0}>← 이전</button>
            {step < STEPS.length - 1 && (
              <button className="nav-next" onClick={() => setStep(s => s + 1)}>다음 →</button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}