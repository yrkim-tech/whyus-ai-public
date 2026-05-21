"use client";
import { useState, useRef, useEffect } from "react";

const STEPS = [
  { id: "profile", label: "개인?�로??, icon: "?��" },
  { id: "experience", label: "?�동·?�격·?�학", icon: "?��" },
  { id: "story", label: "경험?�토�?, icon: "�? },
  { id: "target", label: "?�망?�업/기업/직무", icon: "?��" },
  { id: "analysis", label: "기업분석", icon: "?��" },
  { id: "result", label: "지?�동기작??, icon: "?? },
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
  "D (주도??", "DI (주도+?�교)", "DC (주도+?�중)", "DS (주도+?�정)",
  "I (?�교??", "ID (?�교+주도)", "IS (?�교+?�정)", "IC (?�교+?�중)",
  "S (?�정??", "SI (?�정+?�교)", "SC (?�정+?�중)", "SD (?�정+주도)",
  "C (?�중??", "CS (?�중+?�정)", "CD (?�중+주도)", "CI (?�중+?�교)",
];
const GRADES = ["1?�년", "2?�년", "3?�년", "4?�년", "?�?�원??, "졸업?�정"];
const INDUSTRIES = [
  "반도�??�자", "?�동�?모빌리티", "IT/?�프?�웨??, "금융/?�?�크", "바이???�약",
  "?�학/?�재", "?�품/?�료", "?�통/?�커머스", "건설/부?�산", "?�너지/?�경",
  "미디???�터?�인먼트", "교육", "물류/?�송", "?�료/?�스케??, "?�션/뷰티",
  "??��/?�행", "게임", "컨설??, "공기??공공기�?", "?��??�업",
];
const JOBS = [
  "마�???, "?�업/?�일�?, "기획/?�략", "?�사/HR", "?�무/?�계", "IT/개발",
  "?�구개발(R&D)", "?�산/?�질관�?, "물류/SCM", "고객?�비??, "?�자??, "법무/컴플?�이?�스",
  "?�이?�분??, "ESG/지?��??�경??, "?�외?�업", "구매/조달",
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

  // localStorage?�서 ?�?�된 ?�이??불러?�기
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
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const discRef = useRef(null);
  const [saveMsg, setSaveMsg] = useState("");

  // ?�동 ?�??- profile, experience, stars 변�????�??
  useEffect(() => {
    try { localStorage.setItem("whyus_profile", JSON.stringify(profile)); } catch {}
  }, [profile]);
  useEffect(() => {
    try { localStorage.setItem("whyus_experience", JSON.stringify(experience)); } catch {}
  }, [experience]);
  useEffect(() => {
    try { localStorage.setItem("whyus_stars", JSON.stringify(stars)); } catch {}
  }, [stars]);

  // ?�??초기??
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
    setSaveMsg("초기???�료!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  // DOC ?�운로드
  const downloadDoc = () => {
    if (!result) return;
    const content = result;
    const blob = new Blob(["\ufeff" + content], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (target.company || "지?�동�?) + "_WhyUsAI.doc";
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
          [key]: { ...prev[key], files: [...prev[key].files, { name: file.name, text: "[?��?지 첨�?: " + file.name + "]", preview: e.target.result, isImage: true }] }
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
    ).join("\n\n") || "?�음";

    const prompt = "?�신?� 20??경력??취업 컨설?�트?�니?? ?�음 지?�자???�보�?바탕?�로 ?��??�이 ?�른 지?�동�?3�?버전???�성??주세??\n\n" +
      "## 지?�자 기본?�보\n" +
      "- ?�름: " + profile.name + " / ?�공: " + profile.major + " / 부?�공: " + (profile.minor || "?�음") + "\n" +
      "- ?�년: " + profile.grade + " | ?�별: " + profile.gender + " | ?�점: " + profile.gpa + "\n" +
      "- DISC ?�형: " + (profile.disc || "미입??) + "\n\n" +
      "## ?�망?�업: " + (target.industry || "미입??) + "\n" +
      "## 지?�기?? " + (target.company || "미입??) + "\n" +
      "## ?�망직무: " + (target.job || "미입??) + "\n\n" +
      "## ?�?�외 ?�동 경험\n" +
      experience.activities.map(a => "- [" + a.type + "] " + a.name + " (" + a.period + "): " + a.description).join("\n") + "\n\n" +
      "## ?�격�?n" + (experience.certs.map(c => "- " + c.name + " " + c.grade + " (" + c.year + ")").join("\n") || "?�음") + "\n\n" +
      "## ?�국??n" + (experience.languages.map(l => "- " + l.lang + " " + l.test + " " + l.score).join("\n") || "?�음") + "\n\n" +
      "## STAR 경험?�토�?(?�심 경험 ??반드??지?�동기에 ?�연?�럽�??�여주세??\n" + starText + "\n\n" +
      "## 기업분석 ?�료\n" +
      "### 마이???�터 5 Forces: " + ([...uploads.porter.files.map(f => f.text), uploads.porter.text].filter(Boolean).join("\n") || "(?�료 ?�음)") + "\n" +
      "### PEST 분석: " + ([...uploads.pest.files.map(f => f.text), uploads.pest.text].filter(Boolean).join("\n") || "(?�료 ?�음)") + "\n" +
      "### ?�무분석: " + ([...uploads.finance.files.map(f => f.text), uploads.finance.text].filter(Boolean).join("\n") || "(?�료 ?�음)") + "\n" +
      "### ?�슈분석: " + ([...uploads.news.files.map(f => f.text), uploads.news.text].filter(Boolean).join("\n") || "(?�료 ?�음)") + "\n" +
      "### 기�??�료: " + ([...uploads.etc.files.map(f => f.text), uploads.etc.text].filter(Boolean).join("\n") || "(?�료 ?�음)") + "\n\n" +
      "## ?�성 지�?n" +
      "**공통 ?�칙:**\n" +
      "- STAR 경험?�토리�? ?�순 ?�열?��? 말고, 지?�동기의 ?�름 ?�에 ?�연?�럽�??�여주세??n" +
      "- 기업분석 ?�료(?�무, ?�슈, ?�업 ?�렌??�?구체???�치???�워?�로 ?�급??주세??n" +
      "- 지?�자??DISC ?�형 ?�성??직무 ?�행 방식???�연?�럽�??�러?�도�??�주?�요\n" +
      "- 분량: �?버전 500~700???�외\n\n" +
      "**3가지 버전?�로 ?�성?�주?�요:**\n\n" +
      "?�버??1 - ?�정·비전?��?n" +
      "기업�??�업???�??깊�? 관?�과 ?�사 ???��?�?중심?�로, 지?�자???�정???�껴지??문체�??�성\n\n" +
      "?�버??2 - 경험·??��?��?n" +
      "STAR 경험?�토리�? 보유 ??��??직무?� ?�떻�??�결?�는지�?중심?�로, ?�리?�이�?구체?�인 문체�??�성\n\n" +
      "?�버??3 - ?�토리텔링형??n" +
      "?�상?�인 경험 ??가지�??�작?�서 ?�연?�럽�?지?�동기로 ?�결?�는 ?�토리텔�?문체�??�성\n\n" +
      "�?버전?� '?�버??1 - ?�정·비전?��?, '?�버??2 - 경험·??��?��?, '?�버??3 - ?�토리텔링형?? ?�목??붙여??구분?�주?�요.\n" +
      "지?�동�?3�?버전�??�성??주세?? 추�? ?�명?� 불필?�합?�다.";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.error) {
        setResult("API ?�류: " + data.error.message + "\nAPI ?��? ?�시 ?�인??주세??");
      } else {
        setResult(data.content?.map(b => b.text || "").join("") || "?�성???�패?�습?�다.");
      }
    } catch (e) {
      setResult("?�류: " + e.message);
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

          {/* ?�더 */}
          <div className="header">
            <div className="header-badge">??AI�??�성?�는 ?�만??지?�동�??�성�?/div>
            <h1>WhyUs AI</h1>
            <p>개인?�보?� ?�망 ?�업, 직무, 기업?�보�??�력?�면 지?�동기�? ?�성?�드립니??</p>
            <p style={{ marginTop: "6px" }}>각각???�보�?구체?�으�??�력?�수�?지???�기가 ???�성?�질 ???�습?�다.</p>
            <p style={{ marginTop: "6px" }}>?�만 WhyUs AI 지???�기 초안 ?�성 ??반드??본인???�어�??�정?�시기�? 권유?�립?�다.</p>
            <p style={{ marginTop: "14px", fontWeight: 500, color: "#334155" }}>?�신??꿈을 ?�원?�니?? ?��</p>
          </div>

          {/* ?�텝 ??*/}
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
                  {isDone && <span className="step-check">??/span>}
                </button>
              );
            })}
          </div>

          {/* STEP 0: 개인?�로??*/}
          {step === 0 && (
            <div className="fade-up">
              <p className="page-title">기본 ?�보 ?�력</p>
              <p className="page-desc">?�력?�수�????�확??지?�동기�? 만들?�져??</p>
              <div className="save-bar">
                <span className="auto-save-badge">?�� ?�동?�??�????�음???�속?�도 ?��??�요</span>
                <button className="clear-btn" onClick={clearSaved}>?�� ?�체 초기??/button>
              </div>
              <div className="card">
                <div className="grid-2">
                  {[["?�름", "name", "?�길??], ["?�공", "major", "경영?�과"], ["부?�공", "minor", "?�이?�사?�언??], ["?�점 (4.5기�?)", "gpa", "3.8"]].map(([lbl, key, ph]) => (
                    <div key={key}>
                      <label className="label">{lbl}</label>
                      <input className="input" placeholder={ph} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="label">?�년</label>
                    <select className="select" value={profile.grade} onChange={e => setProfile(p => ({ ...p, grade: e.target.value }))}>
                      <option value="">?�택?�세??/option>
                      {GRADES.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">?�별</label>
                    <select className="select" value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">?�택?�세??/option>
                      <option>?�성</option>
                      <option>?�성</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="label">eDISC ?�형 (?�택?�항)</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <select className="select" value={profile.disc} onChange={e => setProfile(p => ({ ...p, disc: e.target.value }))} style={{ flex: 1 }}>
                        <option value="">?�택?�세??/option>
                        {DISC.map(d => <option key={d}>{d}</option>)}
                      </select>
                      <input type="file" ref={discRef} accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => { setDiscFile(e.target.files[0]); }} style={{ display: "none" }} />
                      <button className="upload-btn" onClick={() => discRef.current.click()} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                        ?�� 결과 ?�로??
                      </button>
                    </div>
                    {discFile && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                        <span className="file-badge">??{discFile.name}</span>
                        <button className="delete-btn" onClick={() => { setDiscFile(null); if (discRef.current) discRef.current.value = ""; }}>?�� ??��</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: ?�동·?�격·?�학 */}
          {step === 1 && (
            <div className="fade-up">
              <p className="page-title">?�동·?�격·?�학</p>
              <p className="page-desc">경험??많을?�록 ???��???지?�동기�? 만들?�져??</p>
              <div className="tabs">
                {[{ key: "activities", label: "?�� ?�?�외?�동" }, { key: "certs", label: "?�� ?�격�? }, { key: "languages", label: "?�� ?�국?? }].map(({ key, label }) => (
                  <button key={key} className={"tab-btn" + (activeTab === key ? " active" : "")} onClick={() => setActiveTab(key)}>{label}</button>
                ))}
              </div>

              {activeTab === "activities" && (
                <div>
                  {experience.activities.map((act, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("activities", idx)}>??/button>}
                      <div className="grid-2">
                        <div>
                          <label className="label">?�동 ?�형</label>
                          <select className="select" value={act.type} onChange={e => updateItem("activities", idx, "type", e.target.value)}>
                            <option value="">?�택</option>
                            {["?�턴??,"?�아�?,"?�회","봉사?�동","공모???�??,"?�로?�트","?�르바이??,"교환?�생","기�?"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">?�동�?/label>
                          <input className="input" placeholder="마�????�포?�즈" value={act.name} onChange={e => updateItem("activities", idx, "name", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">기간</label>
                          <input className="input" placeholder="2024.03 ~ 2024.08" value={act.period} onChange={e => updateItem("activities", idx, "period", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">주요 ?�동 ?�용</label>
                          <input className="input" placeholder="SNS 콘텐�?기획 �??�영" value={act.description} onChange={e => updateItem("activities", idx, "description", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("activities", { type: "", name: "", period: "", description: "" })}>+ ?�동 추�?</button>
                </div>
              )}

              {activeTab === "certs" && (
                <div>
                  {experience.certs.map((c, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("certs", idx)}>??/button>}
                      <div className="grid-3">
                        <div>
                          <label className="label">?�격증명</label>
                          <input className="input" placeholder="?�보처리기사" value={c.name} onChange={e => updateItem("certs", idx, "name", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">?�급/결과</label>
                          <input className="input" placeholder="1�? value={c.grade} onChange={e => updateItem("certs", idx, "grade", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">취득 ?�도</label>
                          <input className="input" placeholder="2024" value={c.year} onChange={e => updateItem("certs", idx, "year", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("certs", { name: "", grade: "", year: "" })}>+ ?�격�?추�?</button>
                </div>
              )}

              {activeTab === "languages" && (
                <div>
                  {experience.languages.map((l, idx) => (
                    <div key={idx} className="card" style={{ position: "relative" }}>
                      {idx > 0 && <button className="remove-btn" onClick={() => removeItem("languages", idx)}>??/button>}
                      <div className="grid-3">
                        <div>
                          <label className="label">?�어</label>
                          <select className="select" value={l.lang} onChange={e => updateItem("languages", idx, "lang", e.target.value)}>
                            <option value="">?�택</option>
                            {["?�어","?�본??,"중국??,"?�일??,"?�랑?�어","?�페?�어","기�?"].map(x => <option key={x}>{x}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">?�험</label>
                          <input className="input" placeholder="TOEIC" value={l.test} onChange={e => updateItem("languages", idx, "test", e.target.value)} />
                        </div>
                        <div>
                          <label className="label">?�수/?�급</label>
                          <input className="input" placeholder="870" value={l.score} onChange={e => updateItem("languages", idx, "score", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addItem("languages", { lang: "", test: "", score: "" })}>+ ?�국??추�?</button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: 경험?�토�?STAR */}
          {step === 2 && (
            <div className="fade-up">
              <p className="page-title">경험?�토�?(STAR 기법)</p>
              <p className="page-desc">Situation ??Task ??Action ??Result ?�서�?경험???�성?�면 지?�동기에 ?�동 반영?�니??</p>
              <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {[
                  { label: "S", name: "Situation · ?�황", cls: "star-s" },
                  { label: "T", name: "Task · 과제",      cls: "star-t" },
                  { label: "A", name: "Action · ?�동",    cls: "star-a" },
                  { label: "R", name: "Result · 결과",    cls: "star-r" },
                ].map(({ label, name, cls }) => (
                  <span key={label} className={"star-badge " + cls}><strong>{label}</strong> {name}</span>
                ))}
              </div>
              {stars.map((star, idx) => (
                <div key={idx} className="star-card">
                  {idx > 0 && <button className="remove-btn" onClick={() => removeStar(idx)}>??/button>}
                  <input className="star-title-input" placeholder="경험 ?�목 (?? 마�???공모???�상, ?�턴???�로?�트 ?�공)"
                    value={star.title} onChange={e => updateStar(idx, "title", e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    {[
                      { field: "situation", label: "S", name: "Situation (?�황)", cls: "star-s", ph: "?�떤 ?�황/배경?�었?�요?" },
                      { field: "task",      label: "T", name: "Task (과제/목표)", cls: "star-t", ph: "무엇???�야 ?�나??" },
                      { field: "action",    label: "A", name: "Action (?�동/?�력)", cls: "star-a", ph: "?�떻�??�동?�나??" },
                      { field: "result",    label: "R", name: "Result (결과/?�과)", cls: "star-r", ph: "?�떤 결과가 ?�왔?�요?" },
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
              <button className="add-btn" onClick={addStar}>�?경험?�토�?추�?</button>
            </div>
          )}

          {/* STEP 3: ?�망?�업/기업/직무 */}
          {step === 3 && (
            <div className="fade-up">
              <p className="page-title">?�망 ?�업 / 기업 / 직무</p>
              <p className="page-desc">지?�하?�는 ?�업, 기업, 직무�??�력??주세??</p>
              <div className="card">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label className="label">?�� ?�망 ?�업</label>
                    <select className="select" value={target.industry} onChange={e => setTarget(t => ({ ...t, industry: e.target.value }))}>
                      <option value="">?�업 ?�택</option>
                      {INDUSTRIES.map(ind => <option key={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">?�� 지??기업�?/label>
                    <input className="input" placeholder="?? ?�성?�자, CJ ENM, ?��??�동�? value={target.company}
                      onChange={e => setTarget(t => ({ ...t, company: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">?�� ?�망 직무</label>
                    <select className="select" value={target.job} onChange={e => setTarget(t => ({ ...t, job: e.target.value }))}>
                      <option value="">직무 ?�택</option>
                      {JOBS.map(j => <option key={j}>{j}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 기업분석 */}
          {step === 4 && (
            <div className="fade-up">
              <p className="page-title">기업분석 ?�료 ?�로??/p>
              <p className="page-desc">?�일·?��?지 ?�로?? 링크 추�?, 직접?�력 모두 가?�해?? 모두 ?�택?�항?�에??</p>
              {[
                { key: "porter", icon: "?�️", title: "마이???�터 5 Forces 분석", desc: "경쟁강도, 공급??구매??교섭?? ?�규진입, ?�체재 ?�협" },
                { key: "pest",   icon: "?��", title: "PEST 분석",                 desc: "?�치·경제·?�회·기술 ?�경 분석 ?�료" },
                { key: "finance",icon: "?��", title: "?�무분석 ?�료",              desc: "DART ?�업보고?? ?�이버증�??�무?�표" },
                { key: "news",   icon: "?��", title: "?�슈분석 ?�료",              desc: "빅카?�즈 ?�스 분석, 주요 ?�슈 ?�스?? },
                { key: "etc",    icon: "?��", title: "기�? ?�료",                  desc: "????�� ??추�?�?참고???�료" },
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
                            <span className="file-badge">{f.isImage ? "?�� " : "??"}{f.name}</span>
                            <button className="delete-btn" onClick={() => removeFile(key, idx)}>?�� ??��</button>
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
                        ?�� ?�일/?��?지 추�? {uploads[key].files.length > 0 ? "(" + uploads[key].files.length + "/3)" : ""}
                      </button>
                    </div>
                  )}
                  {uploads[key].files.length >= 3 && (
                    <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "10px" }}>???�일 3�??�로???�료</div>
                  )}

                  <div style={{ marginBottom: "12px" }}>
                    <label className="label">?�� 참고 링크</label>
                    {uploads[key].links.map((link, idx) => (
                      <div key={idx} className="link-row">
                        <input className="link-input" placeholder="https://dart.fss.or.kr ??참고 URL"
                          value={link} onChange={e => updateLink(key, idx, e.target.value)} />
                        {link && (
                          <a href={link} target="_blank" rel="noreferrer" className="link-open-btn">?�� ?�기</a>
                        )}
                        {uploads[key].links.length > 1 && (
                          <button className="link-del-btn" onClick={() => removeLink(key, idx)}>??/button>
                        )}
                      </div>
                    ))}
                    {uploads[key].links.length < 3 && (
                      <button className="link-add-btn" onClick={() => addLink(key)}>+ 링크 추�?</button>
                    )}
                  </div>

                  <div>
                    <label className="label">?�️ 직접 붙여?�기</label>
                    <textarea className="textarea" placeholder="분석 ?�용??직접 ?�력?�거??붙여?�어 주세??.."
                      value={uploads[key].text}
                      onChange={e => setUploads(u => ({ ...u, [key]: { ...u[key], text: e.target.value } }))} />
                    {uploads[key].text && (
                      <button className="delete-btn" style={{ marginTop: "6px" }}
                        onClick={() => setUploads(u => ({ ...u, [key]: { ...u[key], text: "" } }))}>?�� ?�용 ??��</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: 지?�동�??�성 */}
          {step === 5 && (
            <div className="fade-up">
              <p className="page-title">지?�동�??�성</p>
              <p className="page-desc">?�력???�보�?AI가 분석??맞춤??지?�동�?3가지�??�성?�드?�요.</p>
              <div className="api-key-box">
                <div className="api-key-title">?�� Anthropic API ???�력</div>
                <div className="api-key-desc">
                  본인??Anthropic API ?��? ?�력?�야 지?�동기�? ?�성?????�어??<br />
                  API ?�는 ???�이지???�?�되지 ?�으�??�성 ?�에�??�용?�니??
                </div>
                <div className="api-key-row">
                  <input className="api-key-input" type={showKey ? "text" : "password"}
                    placeholder="sk-ant-api03-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
                  <button className="api-key-toggle" onClick={() => setShowKey(v => !v)}>
                    {showKey ? "?�� ?�기�? : "?�� 보기"}
                  </button>
                </div>
                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="api-key-link">
                  ?�� API ?��? ?�으?��??? console.anthropic.com ?�서 무료�?발급받으?�요
                </a>
              </div>
              <div className="card">
                <div className="summary-grid">
                  {[
                    ["지??기업", target.company || "-"],
                    ["?�망 ?�업", target.industry || "-"],
                    ["?�망 직무", target.job || "-"],
                    ["분석 ?�료", Object.values(uploads).reduce((acc, u) => acc + u.files.length + (u.text ? 1 : 0), 0) + "�?],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="summary-item">
                      <div className="summary-label">{lbl}</div>
                      <div className="summary-value">{val}</div>
                    </div>
                  ))}
                </div>
                <button className="generate-btn" onClick={generateMotivation} disabled={loading || !apiKey.trim()}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className="spinner" /> AI가 ?�성 중입?�다...
                    </span>
                  ) : "??지?�동�??�성?�기"}
                </button>
              </div>
              {result && (
                <div className="card">
                  <div className="result-header">
                    <div className="result-title">?�� ?�성??지?�동�?/div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="copy-btn" onClick={handleCopy}>{copied ? "??복사??" : "?�� 복사"}</button>
                      <button className="doc-btn" onClick={downloadDoc}>?�� DOC ?�운로드</button>
                    </div>
                  </div>
                  <div className="result-box">{result}</div>
                  <div className="result-note">?�️ AI가 ?�성??초안?�니?? ?�제 ?�출 ??반드??본인??경험�??�어�??�정?�세??</div>
                </div>
              )}
            </div>
          )}

          {/* ?�비게이??*/}
          <div className="nav">
            <button className="nav-prev" onClick={() => setStep(s => s - 1)} disabled={step === 0}>???�전</button>
            {step < STEPS.length - 1 && (
              <button className="nav-next" onClick={() => setStep(s => s + 1)}>?�음 ??/button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
