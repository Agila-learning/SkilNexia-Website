import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Send, Folder, File, ArrowRight, Zap, Target } from 'lucide-react';
import gsap from 'gsap';

// --- MOCK DATA FOR DEMO ---
const CONVERSATION_FLOW = [
  {
    id: 1,
    userQ: "How do I upload a document in the portal?",
    aiA: "To upload a document in the portal, click the 'Upload' button, then choose the company, category, and pick the file you wish to upload.",
    points: ["Click 'Upload' button", "Choose the company", "Select document category", "Pick and upload the file"],
    actionTrigger: "upload_flow",
    duration: 6000 // ms
  },
  {
    id: 2,
    userQ: "How are the categories structured?",
    aiA: "Categories are structured in nested folders. Let's open the primary repository to see how PDF and JPG files are organized.",
    points: ["Open Primary Repo", "View Sub-folders", "Sort by File Types (PDF, JPG)"],
    actionTrigger: "folder_flow",
    duration: 5000
  }
];

// Open-source Lottie (using a placeholder generic animation, typically we'd use a specific one)
// Using an animated robot/character URL placeholder.
const LOTTIE_URL = "https://assets3.lottiefiles.com/packages/lf20_1rrx3i3b.json";

const LiveTutor = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const [activeAction, setActiveAction] = useState(null);
    const [currentPoints, setCurrentPoints] = useState([]);

    const lottieRef = useRef(null);
    const chatEndRef = useRef(null);

    // Fetch Lottie JSON
    useEffect(() => {
        fetch(LOTTIE_URL)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Error loading Lottie", err));
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e?.preventDefault();
        if(!input.trim()) return;

        // Add user msg
        const newMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Find match or default to next step
        let stepIndex = currentStep;
        if (stepIndex >= CONVERSATION_FLOW.length) stepIndex = 0; // loop back
        
        const flowDef = CONVERSATION_FLOW[stepIndex];

        // Simulate network/thinking
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { sender: 'ai', text: flowDef.aiA }]);
            setCurrentPoints(flowDef.points);
            setActiveAction(flowDef.actionTrigger);
            setIsPlaying(true);
            
            if (lottieRef.current) {
                lottieRef.current.play();
                lottieRef.current.setSpeed(1.5);
            }

            // End action after specified duration
            setTimeout(() => {
                setIsPlaying(false);
                if (lottieRef.current) lottieRef.current.pause();
                setCurrentStep(s => s + 1);
            }, flowDef.duration);

        }, 1500);
    };

    // Sub-components for Dynamic Visuals
    const VisualStage = () => {
        if (!activeAction) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 space-y-4">
                    <Zap size={64} className="animate-pulse" />
                    <p className="font-black uppercase tracking-widest text-sm">System Idle. Ask a question.</p>
                </div>
            );
        }

        if (activeAction === 'upload_flow') {
            return (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="relative w-full h-full flex items-center justify-center bg-slate-900 border-2 border-white/10 rounded-[30px] overflow-hidden cartoon-shadow"
                >
                    <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-8 w-full px-8">
                        {/* Fake Upload UI */}
                        <div className="w-full max-w-md glass-dark p-6 rounded-2xl border border-white/10 space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="font-black uppercase text-xl">All Documents</h3>
                                <motion.button 
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold font-black"
                                >
                                    + Upload
                                </motion.button>
                            </div>
                            
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="w-full h-32 border-2 border-dashed border-blue-500/50 rounded-xl bg-blue-500/5 flex items-center justify-center"
                            >
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Folder className="text-blue-400 w-16 h-16" />
                                </motion.div>
                            </motion.div>

                            {/* Floating File Icons */}
                            <motion.div 
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                                className="absolute right-[10%] top-[40%] flex items-center gap-4 text-xs font-black"
                            >
                                <div className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 cartoon-shadow">PDF</div>
                                <div className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 cartoon-shadow">JPG</div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (activeAction === 'folder_flow') {
            return (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="relative w-full h-full flex flex-col items-center justify-center"
                >
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.1, type: "spring" }}
                                className="glass-dark p-6 rounded-2xl flex flex-col items-center gap-4 hover:scale-110 transition-transform cursor-pointer border border-white/5"
                            >
                                <Folder fill="currentColor" className="text-cyan-400 w-12 h-12" />
                                <div className="h-2 w-16 bg-white/10 rounded-full" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-20 pb-10 px-6 font-sans overflow-hidden">
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center cartoon-shadow">
                            <Zap className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Live AI Tutor</h1>
                            <p className="text-xs text-cyan-400 font-bold tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                Session Active
                            </p>
                        </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex gap-4">
                        <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <button onClick={() => setMessages([])} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Main 3-Column Layout */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    
                    {/* LEFT: Chat Panel */}
                    <div className="lg:col-span-3 flex flex-col glass-dark border border-white/10 rounded-3xl overflow-hidden cartoon-shadow min-h-0">
                        <div className="p-4 border-b border-white/10 bg-white/5 font-black uppercase text-sm tracking-widest text-slate-400">
                            Chat Assistant
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed
                                            ${msg.sender === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-sm' 
                                                : 'glass-dark border border-white/10 text-slate-300 rounded-tl-sm'}`}
                                        >
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="glass-dark border border-white/10 p-4 rounded-2xl rounded-tl-sm w-16 flex justify-center gap-1">
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 flex gap-2 shrink-0">
                            <input 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your question..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                            />
                            <button 
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 p-3 rounded-xl transition-colors cartoon-shadow"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>

                    {/* CENTER: Animation Stage */}
                    <div className="lg:col-span-6 relative border-4 border-white/5 rounded-[40px] bg-slate-950 flex flex-col overflow-hidden min-h-0">
                        {/* Dynamic Stage Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        
                        {/* The Interactive Visual UI */}
                        <div className="relative z-10 flex-1 p-8">
                            <VisualStage />
                        </div>

                        {/* The Lottie Character Foreground */}
                        <div className="absolute bottom-0 left-10 w-64 h-64 z-20 pointer-events-none">
                            {animationData ? (
                                <Lottie 
                                    lottieRef={lottieRef}
                                    animationData={animationData} 
                                    loop={isPlaying} 
                                    autoplay={false}
                                    className="w-full h-full drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                                />
                            ) : (
                                <div className="w-full h-full animate-pulse bg-slate-800 rounded-t-full" />
                            )}
                        </div>

                        {/* Status Overlay */}
                        <div className="absolute top-6 left-6 z-20 glass-dark rounded-full px-4 py-2 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            {isPlaying ? (
                                <><Volume2 size={14} className="text-cyan-400 animate-pulse"/> AI Teaching</>
                            ) : (
                                <><Pause size={14} /> AI Idle</>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Key Points */}
                    <div className="lg:col-span-3 glass-dark border border-white/10 rounded-3xl p-6 flex flex-col cartoon-shadow overflow-y-auto min-h-0 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full" />
                        
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <Target className="text-cyan-400" size={28} />
                            <h2 className="text-xl font-black uppercase tracking-tight">Key Learning Points</h2>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <AnimatePresence mode="popLayout">
                                {currentPoints.length > 0 ? (
                                    currentPoints.map((point, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.2 }}
                                            className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs shrink-0">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm font-medium text-slate-300 leading-snug">{point}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Awaiting Context...</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {currentPoints.length > 0 && (
                            <motion.button 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-colors cartoon-shadow"
                            >
                                Start Practice
                            </motion.button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LiveTutor;
