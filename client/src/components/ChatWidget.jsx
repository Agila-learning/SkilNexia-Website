import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Paperclip, Smile, MoreVertical, Search, Minimize2, Maximize2, Mic, Square, Shield } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import api from '../services/api';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const socket = useRef(null);
    const scrollRef = useRef(null);
    const widgetRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const fileInputRef = useRef(null);

    const [guestId] = useState(() => {
        const saved = localStorage.getItem('skilnexia_guest_id');
        if (saved) return saved;
        const newId = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('skilnexia_guest_id', newId);
        return newId;
    });

    const currentUserId = user?.id || user?._id || guestId;
    const isGuest = !user;

    useEffect(() => {
        if (isOpen) {
            // Initialize Socket
            const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');
            socket.current = io(socketUrl);

            // Initial call to get/create chat
            const initChat = async () => {
                try {
                    // Students chat with support (automatically assigned admin in backend)
                    const res = await api.post('/chats', {
                        topic: 'Course Support'
                    });
                    setActiveChat(res.data.data);

                    // Join and Fetch history
                    socket.current.emit('join_chat', res.data.data._id);
                    const history = await api.get(`/chats/${res.data.data._id}/messages`);
                    setMessages(history.data.data);
                } catch (err) {
                    console.error('Chat init error:', err);
                }
            };

            initChat();

            socket.current.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
                setIsTyping(false);
            });

            // Entry animation
            gsap.fromTo(widgetRef.current, { scale: 0.8, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' });
        }

        return () => {
            if (socket.current) socket.current.disconnect();
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        const messageData = {
            chatId: activeChat._id,
            senderId: currentUserId,
            content: input
        };

        socket.current.emit('send_message', messageData);
        setInput('');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !activeChat) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            socket.current.emit('send_message', {
                chatId: activeChat._id,
                senderId: currentUserId,
                content: file.name,
                messageType: 'file',
                fileUrl: res.data.url
            });
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload file");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.current.push(e.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });

                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', audioBlob, 'voice-message.webm');

                try {
                    const res = await api.post('/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    socket.current.emit('send_message', {
                        chatId: activeChat._id,
                        senderId: currentUserId,
                        content: 'Voice Message',
                        messageType: 'audio',
                        fileUrl: res.data.url
                    });
                } catch (error) {
                    console.error("Audio upload failed", error);
                } finally {
                    setIsUploading(false);
                }

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone", error);
            alert("Microphone access denied or not available");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    // if (!user) return null; // MOVED: Now everyone can see support

    return (
        <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div
                    ref={widgetRef}
                    className={`w-[400px] bg-white rounded-[32px] shadow-33xl border border-slate-100 overflow-hidden flex flex-col pointer-events-auto mb-6 transition-all duration-300 ${isMinimized ? 'h-20' : 'h-[600px]'}`}
                    style={{ filter: 'drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.15))' }}
                >
                    {/* Header */}
                    <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                                    <Bot size={28} className="text-accent-500" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-950"></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight uppercase leading-none mb-1">Skilnexia Support</h3>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Always Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button title="View Chat History" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                                <Search size={18} />
                            </button>
                            <button title="Privacy & Security" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                                <Shield size={18} />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1"></div>
                            <button onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? "Maximize" : "Minimize"} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} title="Close Chat" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div
                                ref={scrollRef}
                                className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth"
                                style={{ scrollbarWidth: 'thin' }}
                            >
                                <div className="text-center py-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">Today</span>
                                </div>

                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${m.sender === currentUserId ? 'bg-primary-900 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'}`}>
                                            {m.messageType === 'audio' && m.fileUrl ? (
                                                <audio src={m.fileUrl} controls className="max-w-[200px] h-10" />
                                            ) : m.messageType === 'file' && m.fileUrl ? (
                                                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 underline ${m.sender === currentUserId ? 'decoration-white/50 text-white' : 'text-slate-800'}`}>
                                                    <Paperclip size={16} /> {m.content}
                                                </a>
                                            ) : (
                                                <p>{m.content}</p>
                                            )}
                                            <p className={`text-[9px] mt-2 font-black ${m.sender === currentUserId ? 'text-primary-200 text-right' : 'text-slate-400 text-left'}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white border-t border-slate-100 relative">
                                {isUploading && <div className="absolute -top-6 left-0 right-0 text-center text-[10px] text-primary-600 font-bold tracking-widest uppercase bg-primary-50 py-1">Uploading...</div>}

                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                                <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                    <div className="relative flex-grow group flex items-center bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-primary-500/10 focus-within:bg-white transition-all">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={isRecording ? "Recording..." : "Ask a question..."}
                                            disabled={isRecording || isUploading}
                                            className="w-full pl-6 pr-2 py-4 bg-transparent focus:outline-none font-bold text-sm overflow-hidden"
                                        />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                                            <Paperclip size={20} />
                                        </button>
                                        <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`p-3 mr-1 transition-colors ${isRecording ? 'text-red-500 hover:text-red-600 animate-pulse' : 'text-slate-300 hover:text-slate-900'}`}>
                                            {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
                                        </button>
                                    </div>
                                    <button
                                        disabled={!input.trim() || isRecording || isUploading}
                                        className="w-14 h-14 bg-accent-500 text-white rounded-2xl flex flex-shrink-0 items-center justify-center hover:bg-accent-600 transition-all shadow-xl shadow-accent-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                    >
                                        <Send size={24} className="-mr-1 -mt-1" />
                                    </button>
                                </form>
                                <div className="flex items-center gap-4 mt-4">
                                    <button type="button" onClick={() => {
                                        if (activeChat) socket.current.emit('send_message', { chatId: activeChat._id, senderId: currentUserId, content: 'Course Help' });
                                    }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 transition-colors">Course Help</button>
                                    <button type="button" onClick={() => {
                                        if (activeChat) socket.current.emit('send_message', { chatId: activeChat._id, senderId: currentUserId, content: 'Technical Issue' });
                                    }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 transition-colors">Technical Issue</button>
                                    <button type="button" onClick={() => {
                                        if (activeChat) socket.current.emit('send_message', { chatId: activeChat._id, senderId: currentUserId, content: 'Pricing' });
                                    }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 transition-colors">Pricing</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Toggle Button + WhatsApp stacked vertically */}
            <div className="flex flex-col-reverse items-end gap-3 pointer-events-auto">
                {/* Chat Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white rounded-[18px] shadow-2xl shadow-primary-500/40 flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all outline-none ring-4 ring-primary-500/20 group relative`}
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:animate-pulse" />}
                    {!isOpen && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center font-black text-[9px] border-2 border-white animate-bounce">1</div>
                    )}
                </button>

                {/* WhatsApp Button */}
                {!isOpen && (
                    <a
                        href="https://wa.me/9342234028"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat on WhatsApp"
                        className="w-14 h-14 flex items-center justify-center bg-[#25D366] text-white rounded-[18px] shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all ring-4 ring-green-500/20 group"
                    >
                        {/* WhatsApp SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.85L4.43 19.65L5.25 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 15.99C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.1 16.56 13.98C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.48 13.06 14.32 13.31C14.16 13.55 13.67 14.1 13.53 14.27C13.39 14.44 13.25 14.46 13 14.34C12.75 14.21 11.94 13.95 10.98 13.1C10.23 12.44 9.73 11.62 9.59 11.37C9.45 11.12 9.58 10.99 9.7 10.86C9.82 10.74 9.95 10.55 10.07 10.41C10.19 10.27 10.23 10.17 10.31 10C10.39 9.83 10.35 9.69 10.29 9.57C10.23 9.45 9.73 8.23 9.53 7.73C9.33 7.25 9.13 7.31 8.97 7.3C8.81 7.29 8.67 7.28 8.53 7.28V7.33Z" />
                        </svg>
                    </a>
                )}
            </div>

        </div>
    );
};

export default ChatWidget;
