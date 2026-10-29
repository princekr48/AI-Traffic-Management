 import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert, Camera, Car, CheckCircle2, AlertTriangle, FileText,
  Search, RefreshCw, Upload, Eye, Download, CreditCard, ChevronRight,
  TrendingUp, Activity, Smartphone, Printer, XCircle, ArrowUpRight,
  Cpu, Clock, MapPin, Check, Video, UserCheck, Settings, BarChart2,
  BellRing, Send, AlertOctagon, Radio
} from 'lucide-react';

const VIOLATIONS_CONFIG = {
  NO_HELMET: { name: 'Riding without Helmet', code: 'SEC-129', fine: 1000, severity: 'High' },
  RED_LIGHT: { name: 'Red-Light / Stop Line Jump', code: 'SEC-184', fine: 5000, severity: 'Critical' },
  TRIPLE_RIDING: { name: 'Triple Riding on Two-Wheeler', code: 'SEC-128', fine: 1000, severity: 'Medium' },
  OVERSPEEDING: { name: 'Dangerous Over-Speeding', code: 'SEC-183', fine: 2000, severity: 'Critical' },
  NO_SEATBELT: { name: 'Driving without Seatbelt', code: 'SEC-194B', fine: 1000, severity: 'Medium' },
  ILLEGAL_PARKING: { name: 'Illegal Obstruction Parking', code: 'SEC-122', fine: 500, severity: 'Low' },
  WRONG_WAY: { name: 'Driving Against Flow (Wrong Way)', code: 'SEC-184(C)', fine: 5000, severity: 'Critical' }
};

const SAMPLE_VEHICLES = {
  'UP14-BV-4921': { owner: 'Rajesh Kumar Verma', phone: '+91 98765-XXXX1', model: 'Hero Splendor Plus', class: 'Two-Wheeler (Motorcycle)' },
  'DL3C-AT-8820': { owner: 'Pooja Sharma', phone: '+91 98112-XXXX4', model: 'Maruti Suzuki Swift', class: 'Light Motor Vehicle' },
  'UP16-ZZ-1092': { owner: 'Amit Vikram Singh', phone: '+91 99580-XXXX7', model: 'Bajaj Pulsar 150', class: 'Two-Wheeler' },
  'HR26-DK-3490': { owner: 'Vikas Malhotra', phone: '+91 94120-XXXX9', model: 'Auto Rickshaw (CNG)', class: 'Commercial 3-Wheeler' },
  'MH02-EF-7711': { owner: 'Sunita Patil', phone: '+91 97230-XXXX2', model: 'Tata Nexon', class: 'Compact SUV' }
};

// High-fidelity Indian Traffic CCTV Feeds
const INDIAN_CCTV_CAMERAS = [
  {
    id: 'CAM-DEL-01',
    name: 'Delhi ITO Chowk / Ring Road Junction',
    streamUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    violation: 'NO_HELMET',
    plate: 'UP14-BV-4921',
    confidence: '97.2%',
    speed: '48 km/h',
    boxStyle: { top: '38%', left: '32%', width: '130px', height: '110px' }
  },
  {
    id: 'CAM-GZB-02',
    name: 'Ghaziabad Meerut Expressway Interchange',
    streamUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    violation: 'RED_LIGHT',
    plate: 'DL3C-AT-8820',
    confidence: '95.6%',
    speed: '68 km/h',
    boxStyle: { top: '45%', right: '28%', width: '140px', height: '100px' }
  },
  {
    id: 'CAM-NOI-03',
    name: 'Noida Sector 62 / Model Town Flyover',
    streamUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    violation: 'WRONG_WAY',
    plate: 'UP16-ZZ-1092',
    confidence: '93.8%',
    speed: '54 km/h',
    boxStyle: { top: '50%', left: '46%', width: '120px', height: '90px' }
  },
  {
    id: 'CAM-MUM-04',
    name: 'Western Express Highway Surveillance Cam #09',
    streamUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    violation: 'OVERSPEEDING',
    plate: 'MH02-EF-7711',
    confidence: '98.1%',
    speed: '86 km/h',
    boxStyle: { bottom: '25%', left: '20%', width: '150px', height: '120px' }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [userRole, setUserRole] = useState('officer');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock for CCTV HUD
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Master Challans Database
  const [challans, setChallans] = useState([
    {
      id: 'CH-2026-00481',
      vehicleNo: 'UP14-BV-4921',
      ownerName: 'Rajesh Kumar Verma',
      violationType: 'NO_HELMET',
      location: 'Delhi ITO Chowk / Ring Road Junction',
      timestamp: '2026-10-10 10:14 AM',
      daysElapsed: 14,
      fineAmount: 1000,
      confidence: 96.4,
      status: 'Issued',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      paidBy: null,
      paidAt: null,
      paymentId: null,
      reminderSent: false
    },
    {
      id: 'CH-2026-00482',
      vehicleNo: 'DL3C-AT-8820',
      ownerName: 'Pooja Sharma',
      violationType: 'RED_LIGHT',
      location: 'Ghaziabad Meerut Expressway Interchange',
      timestamp: '2026-10-22 11:30 AM',
      daysElapsed: 2,
      fineAmount: 5000,
      confidence: 94.8,
      status: 'Issued',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      paidBy: null,
      paidAt: null,
      paymentId: null,
      reminderSent: false
    },
    {
      id: 'CH-2026-00483',
      vehicleNo: 'UP16-ZZ-1092',
      ownerName: 'Amit Vikram Singh',
      violationType: 'WRONG_WAY',
      location: 'Noida Sector 62 / Model Town Flyover',
      timestamp: '2026-10-12 01:15 PM',
      daysElapsed: 12,
      fineAmount: 5000,
      confidence: 92.1,
      status: 'Pending Review',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      paidBy: null,
      paidAt: null,
      paymentId: null,
      reminderSent: false
    }
  ]);

  // 10-Day Overdue Modal State
  const [showOverduePopup, setShowOverduePopup] = useState(false);
  const [overdueChallan, setOverdueChallan] = useState(null);
  const [smsSuccessMsg, setSmsSuccessMsg] = useState('');

  useEffect(() => {
    const overdue = challans.find(c => c.daysElapsed >= 10 && c.status !== 'Paid');
    if (overdue) {
      setOverdueChallan(overdue);
      setShowOverduePopup(true);
    }
  }, []);

  // Upload & Inference State
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const fileInputRef = useRef(null);

  // Payment & PDF State
  const [selectedChallanForPay, setSelectedChallanForPay] = useState(null);
  const [payerName, setPayerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null);

  // Public Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedChallan, setSearchedChallan] = useState(null);

  // Simulated Live Vehicle Telemetry
  const [liveVehicleCount, setLiveVehicleCount] = useState(2491);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVehicleCount(prev => prev + Math.floor(Math.random() * 4));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        runAiDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiDetection = () => {
    setIsScanning(true);
    setDetectionResult(null);

    setTimeout(() => {
      const keys = Object.keys(SAMPLE_VEHICLES);
      const randomPlate = keys[Math.floor(Math.random() * keys.length)];
      const violationKeys = Object.keys(VIOLATIONS_CONFIG);
      const randomViolation = violationKeys[Math.floor(Math.random() * violationKeys.length)];

      setDetectionResult({
        detectedPlate: randomPlate,
        violationKey: randomViolation,
        confidence: (92 + Math.random() * 6).toFixed(1),
        speed: (52 + Math.floor(Math.random() * 40)),
        plateConfidence: (94 + Math.random() * 5).toFixed(1),
        junction: 'Delhi ITO Chowk Surveillance Zone'
      });
      setIsScanning(false);
    }, 1800);
  };

  const handleCreateChallanFromUpload = () => {
    if (!detectionResult || !uploadedImage) return;

    const newChallanId = `CH-2026-00${Math.floor(100 + Math.random() * 900)}`;
    const vehicleInfo = SAMPLE_VEHICLES[detectionResult.detectedPlate] || {
      owner: 'Citizen Motorist',
      phone: '+91 98XXX-XXXXX'
    };

    const newChallan = {
      id: newChallanId,
      vehicleNo: detectionResult.detectedPlate,
      ownerName: vehicleInfo.owner,
      violationType: detectionResult.violationKey,
      location: detectionResult.junction,
      timestamp: new Date().toLocaleString(),
      daysElapsed: 0,
      fineAmount: VIOLATIONS_CONFIG[detectionResult.violationKey].fine,
      confidence: detectionResult.confidence,
      status: 'Issued',
      image: uploadedImage,
      paidBy: null,
      paidAt: null,
      paymentId: null,
      reminderSent: false
    };

    setChallans([newChallan, ...challans]);
    alert(`E-Challan ${newChallanId} generated successfully!`);
    setSelectedChallanForPay(newChallan);
    setPayerName(vehicleInfo.owner);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!payerName.trim()) {
      alert('Payer Name is required!');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const txnId = `TXN-UPI-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const paidTime = new Date().toLocaleString();

      const updated = challans.map((ch) => {
        if (ch.id === selectedChallanForPay.id) {
          return {
            ...ch,
            status: 'Paid',
            paidBy: payerName,
            paidAt: paidTime,
            paymentId: txnId
          };
        }
        return ch;
      });

      setChallans(updated);

      setPaidReceipt({
        ...selectedChallanForPay,
        status: 'Paid',
        paidBy: payerName,
        paidAt: paidTime,
        paymentId: txnId,
        paymentMethod: paymentMethod
      });

      setIsProcessingPayment(false);
      setSelectedChallanForPay(null);
    }, 1200);
  };

  const handleSendOverdueSms = (challanId) => {
    setChallans(challans.map(ch => ch.id === challanId ? { ...ch, reminderSent: true } : ch));
    setSmsSuccessMsg('MoRTH DLT Urgent Legal Notice SMS dispatched to registered mobile number!');
    setTimeout(() => setSmsSuccessMsg(''), 4000);
  };

  const handleCitizenSearch = (e) => {
    e.preventDefault();
    const found = challans.find(
      c => c.vehicleNo.toLowerCase().replace(/[\s-]/g, '') === searchQuery.toLowerCase().replace(/[\s-]/g, '') ||
           c.id.toLowerCase() === searchQuery.toLowerCase().trim()
    );
    setSearchedChallan(found || 'NOT_FOUND');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-xl text-slate-950 shadow-md">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wide text-white flex items-center gap-2">
                TrafficOps AI <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">INDIA CCTV HUB</span>
              </h1>
              <p className="text-xs text-slate-400">Intelligent Indian Traffic Monitoring & ANPR E-Challan System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {challans.some(c => c.daysElapsed >= 10 && c.status !== 'Paid') && (
              <button
                onClick={() => {
                  const overdue = challans.find(c => c.daysElapsed >= 10 && c.status !== 'Paid');
                  setOverdueChallan(overdue);
                  setShowOverduePopup(true);
                }}
                className="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 text-xs rounded-lg font-bold flex items-center gap-1.5 animate-pulse"
              >
                <BellRing className="w-3.5 h-3.5" />
                10+ Days Unpaid Notice
              </button>
            )}

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Role:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent text-amber-400 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="officer" className="bg-slate-900">Traffic Police Officer</option>
                <option value="admin" className="bg-slate-900">System Admin</option>
                <option value="citizen" className="bg-slate-900">Public Citizen</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 border-t border-slate-800/80 overflow-x-auto py-1">
          {[
            { id: 'live', name: 'Live Indian CCTV Feeds', icon: Video },
            { id: 'upload', name: 'AI Vision Studio (Upload)', icon: Upload },
            { id: 'officer', name: 'Officer Review Queue', icon: UserCheck },
            { id: 'registry', name: `Challan Registry (${challans.length})`, icon: FileText },
            { id: 'citizen', name: 'Public Citizen Portal', icon: Search },
            { id: 'analytics', name: 'Analytics & Trends', icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* OVERDUE LEGAL POPUP (10+ DAYS) */}
      {showOverduePopup && overdueChallan && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-red-500/80 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowOverduePopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-red-500/30 pb-3">
              <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/40">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wide text-red-400">
                  CRITICAL: 10+ DAYS OVERDUE PAYMENT ALERT!
                </h3>
                <p className="text-xs text-slate-300">Statutory Notice under Motor Vehicles Act, Section 184</p>
              </div>
            </div>

            <div className="bg-red-950/30 border border-red-500/30 p-3.5 rounded-xl space-y-2 text-xs">
              <p className="text-slate-200">
                Vehicle <strong className="text-amber-400 font-mono">{overdueChallan.vehicleNo}</strong> ({overdueChallan.ownerName}) challan <span className="text-red-400 font-bold font-mono">#{overdueChallan.id}</span> is unpaid for <span className="underline font-bold text-red-300">{overdueChallan.daysElapsed} days</span>.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-red-500/20 font-mono text-[11px]">
                <div><span className="text-slate-400">Fine Amount:</span> <span className="font-bold text-white">₹{overdueChallan.fineAmount}</span></div>
                <div><span className="text-slate-400">Issued On:</span> <span className="text-slate-300">{overdueChallan.timestamp}</span></div>
                <div><span className="text-slate-400">Violation:</span> <span className="text-red-300">{VIOLATIONS_CONFIG[overdueChallan.violationType]?.name}</span></div>
                <div><span className="text-slate-400">Legal Step:</span> <span className="text-amber-400 font-bold">Virtual Court Summons</span></div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] block font-mono">AUTOMATED LEGAL SMS DISPATCH FORMAT:</span>
              <p className="text-slate-300 italic text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
                "URGENT: Vehicle {overdueChallan.vehicleNo} has an UNPAID e-challan ({overdueChallan.id}) of ₹{overdueChallan.fineAmount} pending for {overdueChallan.daysElapsed} days. Clear your dues immediately within 24 hours to avoid court summons & vehicle impounding. Pay securely: https://echallan.parivahan.gov.in"
              </p>
            </div>

            {smsSuccessMsg && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {smsSuccessMsg}
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => handleSendOverdueSms(overdueChallan.id)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" /> Send Urgent SMS Reminder
              </button>
              <button
                onClick={() => {
                  setShowOverduePopup(false);
                  setSelectedChallanForPay(overdueChallan);
                  setPayerName(overdueChallan.ownerName);
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TELEMETRY STRIP */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Live Monitored Vehicles</p>
              <p className="font-bold text-slate-200">{liveVehicleCount.toLocaleString()} units</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Active Indian Streams</p>
              <p className="font-bold text-red-400">4 Intersections Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Pending Officer Reviews</p>
              <p className="font-bold text-amber-400">{challans.filter(c => c.status === 'Pending Review').length} Cases</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Total Cleared Fines</p>
              <p className="font-bold text-cyan-400">{challans.filter(c => c.status === 'Paid').length} Settled</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 1. REAL INDIAN CCTV TRAFFIC STREAMS */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  Live Indian CCTV Junction Monitoring Network
                </h2>
                <p className="text-xs text-slate-400">High-definition road surveillance featuring real Indian traffic (Bikes, Autos, Buses, Cars)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs rounded">
                  {currentTime}
                </span>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-xs font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> YOLOv8 Live (30 FPS)
                </span>
              </div>
            </div>

            {/* 4-GRID INDIAN CCTV CAMERAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {INDIAN_CCTV_CAMERAS.map((cam) => (
                <div key={cam.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                  {/* Camera Top Bar */}
                  <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-amber-400" /> {cam.id}: {cam.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-cyan-400">RADAR: {cam.speed}</span>
                      <span className="text-red-400 flex items-center gap-1 font-bold">● REC</span>
                    </div>
                  </div>

                  {/* CCTV Viewport with HUD & Indian Traffic Stream */}
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={cam.streamUrl}
                      alt={cam.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />

                    {/* Camera OSD HUD (Timestamp & Location watermark) */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-700/80 font-mono text-[10px] text-white space-y-0.5">
                      <div className="text-amber-400 font-bold">{cam.id} | {currentTime}</div>
                      <div className="text-slate-300">{cam.name}</div>
                    </div>

                    {/* AI Bounding Box on Target Indian Vehicle */}
                    <div
                      className="absolute border-2 border-red-500 bg-red-500/25 p-1 rounded font-mono text-[10px] shadow-lg animate-pulse"
                      style={cam.boxStyle}
                    >
                      <div className="bg-red-600 text-white font-extrabold px-1 rounded text-[9px] uppercase leading-tight">
                        {VIOLATIONS_CONFIG[cam.violation].name} ({cam.confidence})
                      </div>
                      <div className="text-amber-300 font-bold mt-0.5 bg-black/70 px-1 rounded text-[9px]">
                        ANPR: {cam.plate}
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                      OCR ACCURACY: {cam.confidence}
                    </div>
                  </div>

                  {/* Camera Bottom Action */}
                  <div className="p-3 bg-slate-950 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400">Violation: </span>
                      <span className="text-red-400 font-semibold">{VIOLATIONS_CONFIG[cam.violation].name}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      Open in AI Studio <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. AI VISION STUDIO (CUSTOM UPLOAD & ANPR DETECTION) */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400" /> Evidence Image Upload & AI Scanner
                  </h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Browse Traffic Image
                  </button>
                </div>

                <div className="relative border-2 border-dashed border-slate-700 bg-slate-950 rounded-xl h-80 flex flex-col items-center justify-center overflow-hidden">
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <img src={uploadedImage} alt="Traffic Evidence" className="w-full h-full object-contain" />
                      {isScanning && (
                        <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
                          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute animate-bounce" />
                          <div className="bg-slate-900/90 border border-cyan-500/50 px-4 py-2 rounded-lg flex items-center gap-3">
                            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                            <span className="text-xs font-mono text-cyan-300">YOLOv8 + OCR Scanning...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-300">Click to Upload Traffic Evidence Photo</p>
                      <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, AVIF with vehicle license plates</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" /> AI Detection Pipeline Output
                  </h3>

                  {detectionResult ? (
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">Detected Registration Plate (ANPR)</span>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xl font-bold tracking-wider text-amber-400 bg-amber-950/40 px-3 py-1 rounded border border-amber-600/50">
                            {detectionResult.detectedPlate}
                          </span>
                          <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                            {detectionResult.plateConfidence}% Confidence
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">Violation Identified</span>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-red-400">
                              {VIOLATIONS_CONFIG[detectionResult.violationKey].name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {VIOLATIONS_CONFIG[detectionResult.violationKey].code}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-white">
                              ₹{VIOLATIONS_CONFIG[detectionResult.violationKey].fine}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Camera / Location:</span>
                          <span>{detectionResult.junction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Speed Radar Estimate:</span>
                          <span>{detectionResult.speed} km/h</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-center text-slate-500 text-xs">
                      Upload an image or pick a CCTV frame to detect registration plate and violation.
                    </div>
                  )}
                </div>

                {detectionResult && (
                  <button
                    onClick={handleCreateChallanFromUpload}
                    className="w-full mt-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Issue Challan & Open Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. OFFICER REVIEW QUEUE TAB */}
        {activeTab === 'officer' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Officer Human-In-The-Loop Approval Queue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challans.map((ch) => (
                <div key={ch.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4">
                  <img src={ch.image} alt="Violation" className="w-32 h-28 object-cover rounded-lg border border-slate-700" />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-amber-400">{ch.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          ch.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                        }`}>{ch.status}</span>
                      </div>
                      <p className="font-mono text-sm text-white font-bold mt-1">{ch.vehicleNo}</p>
                      <p className="text-red-400 font-medium">{VIOLATIONS_CONFIG[ch.violationType]?.name}</p>
                      <p className="text-slate-400 text-[11px]">{ch.location}</p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {ch.status === 'Pending Review' && (
                        <>
                          <button
                            onClick={() => setChallans(challans.map(c => c.id === ch.id ? { ...c, status: 'Approved' } : c))}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setChallans(challans.map(c => c.id === ch.id ? { ...c, status: 'Cancelled' } : c))}
                            className="px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedChallanForPay(ch);
                          setPayerName(ch.ownerName);
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                      >
                        Pay / Settle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CHALLAN MASTER REGISTRY TAB */}
        {activeTab === 'registry' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                E-Challan Master Database
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Challan ID</th>
                    <th className="p-3">Vehicle Plate</th>
                    <th className="p-3">Owner / Payer</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Violation</th>
                    <th className="p-3">Fine</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {challans.map((ch) => (
                    <tr key={ch.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-amber-400">{ch.id}</td>
                      <td className="p-3 font-mono font-medium">{ch.vehicleNo}</td>
                      <td className="p-3">{ch.paidBy ? `${ch.paidBy} (Paid)` : ch.ownerName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                          ch.daysElapsed >= 10 && ch.status !== 'Paid' ? 'bg-red-950 text-red-400 font-bold' : 'text-slate-400'
                        }`}>
                          {ch.daysElapsed} Days
                        </span>
                      </td>
                      <td className="p-3 text-red-400">{VIOLATIONS_CONFIG[ch.violationType]?.name || ch.violationType}</td>
                      <td className="p-3 font-bold">₹{ch.fineAmount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          ch.status === 'Paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : ch.daysElapsed >= 10
                            ? 'bg-red-950 text-red-400 border border-red-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {ch.daysElapsed >= 10 && ch.status !== 'Paid' ? 'Overdue' : ch.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {ch.status !== 'Paid' ? (
                          <>
                            {ch.daysElapsed >= 10 && (
                              <button
                                onClick={() => {
                                  setOverdueChallan(ch);
                                  setShowOverduePopup(true);
                                }}
                                className="px-2 py-1 bg-red-600/30 text-red-400 hover:bg-red-600 hover:text-white rounded text-[11px] font-semibold"
                              >
                                Send Legal SMS
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedChallanForPay(ch);
                                setPayerName(ch.ownerName);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px]"
                            >
                              Pay Online
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setPaidReceipt(ch)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 rounded text-[11px] flex items-center gap-1 inline-flex"
                          >
                            <Download className="w-3 h-3" /> PDF Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. PUBLIC CITIZEN PORTAL TAB */}
        {activeTab === 'citizen' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg text-center">
              <h2 className="text-lg font-bold text-white mb-2">MoRTH Citizen e-Challan Verification & Payment</h2>
              <p className="text-xs text-slate-400 mb-6">Enter vehicle registration number (e.g., UP14-BV-4921) or Challan ID to view violation proof and pay</p>
              
              <form onSubmit={handleCitizenSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Plate (e.g., UP14-BV-4921) or Challan ID"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </form>
            </div>

            {searchedChallan && searchedChallan !== 'NOT_FOUND' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-bold">{searchedChallan.id}</span>
                    <h3 className="font-bold text-base text-white mt-0.5">{searchedChallan.vehicleNo}</h3>
                    <p className="text-xs text-slate-400">Owner: {searchedChallan.ownerName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    searchedChallan.status === 'Paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                  }`}>
                    {searchedChallan.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <img src={searchedChallan.image} alt="Photographic Proof" className="rounded-lg border border-slate-700 w-full h-40 object-cover" />
                  </div>
                  <div className="space-y-2">
                    <div><span className="text-slate-400">Violation:</span> <p className="font-semibold text-red-400">{VIOLATIONS_CONFIG[searchedChallan.violationType]?.name}</p></div>
                    <div><span className="text-slate-400">Location:</span> <p className="text-slate-200">{searchedChallan.location}</p></div>
                    <div><span className="text-slate-400">Fine Payable:</span> <p className="text-lg font-bold text-white">₹{searchedChallan.fineAmount}</p></div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  {searchedChallan.status !== 'Paid' ? (
                    <button
                      onClick={() => {
                        setSelectedChallanForPay(searchedChallan);
                        setPayerName(searchedChallan.ownerName);
                      }}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs uppercase"
                    >
                      Pay ₹{searchedChallan.fineAmount} Instantly
                    </button>
                  ) : (
                    <button
                      onClick={() => setPaidReceipt(searchedChallan)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Official Tax Receipt
                    </button>
                  )}
                </div>
              </div>
            )}

            {searchedChallan === 'NOT_FOUND' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                No pending challan record found for this registration number.
              </div>
            )}
          </div>
        )}

        {/* 6. ANALYTICS & TRENDS TAB */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="font-bold text-slate-200 uppercase mb-3">Top Detected Infractions</h3>
              <div className="space-y-3">
                {Object.entries(VIOLATIONS_CONFIG).slice(0, 4).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>{val.name}</span>
                      <span className="font-mono text-amber-400">₹{val.fine}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.random() * 60 + 30}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="font-bold text-slate-200 uppercase mb-3">DLT SMS Delivery Gateway</h3>
              <div className="space-y-2 text-slate-400">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-emerald-400 font-mono">[DELIVERED]</span> Alert sent to +91 98765-XXXX1 (UP14-BV-4921)
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-emerald-400 font-mono">[DELIVERED]</span> Alert sent to +91 98112-XXXX4 (DL3C-AT-8820)
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-amber-400 font-mono">[QUEUED]</span> Retrying DLT SMS dispatch for UP16-ZZ-1092
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="font-bold text-slate-200 uppercase mb-3">Motor Vehicles Act 2019 Rules</h3>
              <p className="text-slate-400 mb-3">All fine amounts and provisions are mapped directly according to legal statutory norms.</p>
              <div className="text-[11px] text-slate-500 space-y-1">
                <p>• Red-light: Section 184 (₹5,000)</p>
                <p>• Helmetless: Section 129 (₹1,000)</p>
                <p>• Wrong Way: Section 184(C) (₹5,000)</p>
                <p>• Speeding: Section 183 (₹2,000)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PAYMENT MODAL */}
      {selectedChallanForPay && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Online Challan Payment Gateway</h3>
              <button onClick={() => setSelectedChallanForPay(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Challan Ref:</span><span className="font-mono text-amber-400">{selectedChallanForPay.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Vehicle:</span><span className="font-mono">{selectedChallanForPay.vehicleNo}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payable Amount:</span><span className="text-sm font-bold text-white">₹{selectedChallanForPay.fineAmount}</span></div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Payer Full Name (Printed on Official Receipt):
                </label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="UPI">BHIM / PhonePe / GPay (UPI)</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="NetBanking">Internet Banking</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
              >
                {isProcessingPayment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {isProcessingPayment ? 'Processing Transaction...' : `Pay ₹${selectedChallanForPay.fineAmount} Now`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL (DOWNLOAD / PRINT PDF) */}
      {paidReceipt && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Payment Successful
              </h3>
              <button onClick={() => setPaidReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div id="challan-receipt" className="bg-white text-slate-900 p-5 rounded-lg border border-slate-300 space-y-3 font-sans">
              <div className="text-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-sm uppercase tracking-wide">Government of India / MoRTH</h4>
                <p className="text-[10px] text-slate-600">Electronic Traffic Violation Payment Receipt</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500 block text-[10px]">Challan ID:</span><strong>{paidReceipt.id}</strong></div>
                <div><span className="text-slate-500 block text-[10px]">Vehicle No:</span><strong className="font-mono">{paidReceipt.vehicleNo}</strong></div>
                <div><span className="text-slate-500 block text-[10px]">Payer Name:</span><strong className="text-indigo-900">{paidReceipt.paidBy}</strong></div>
                <div><span className="text-slate-500 block text-[10px]">Transaction ID:</span><span className="font-mono text-[11px]">{paidReceipt.paymentId}</span></div>
                <div><span className="text-slate-500 block text-[10px]">Paid Amount:</span><strong className="text-emerald-700">₹{paidReceipt.fineAmount}.00</strong></div>
                <div><span className="text-slate-500 block text-[10px]">Date & Time:</span><span className="text-[11px]">{paidReceipt.paidAt}</span></div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-600">
                <span>Status: <strong className="text-emerald-600">PAID & CLEARED</strong></span>
                <span>Authorized Digital Stamp</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
              <button
                onClick={() => setPaidReceipt(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}