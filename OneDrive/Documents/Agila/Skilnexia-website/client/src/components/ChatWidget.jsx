import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Paperclip, Smile, MoreVertical, Search, Minimize2, Maximize2 } from 'lucide-react';
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

    const socket = useRef(null);
    const scrollRef = useRef(null);
    const widgetRef = useRef(null);

    useEffect(() => {
        if (user && isOpen) {
            // Initialize Socket
            socket.current = io('http://localhost:5000'); // Use your server URL

            // Initial call to get/create chat
            const initChat = async () => {
                try {
                    // For demo: students chat with a generic 'admin' or trainer
                    // In real app, you'd fetch the specific trainer for the course
                    const res = await api.post('/chats', {
                        participantId: '65dd1234567890abcdef1234', // Mock Admin/Trainer ID
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
            senderId: user.id || user._id,
            content: input
        };

        socket.current.emit('send_message', messageData);
        setInput('');
    };

    if (!user) return null; // Show only for logged-in users

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
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
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
                                    <div key={i} className={`flex ${m.sender === (user.id || user._id) ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${m.sender === (user.id || user._id) ? 'bg-primary-900 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'}`}>
                                            {m.content}
                                            <p className={`text-[9px] mt-2 font-black ${m.sender === (user.id || user._id) ? 'text-primary-200 text-right' : 'text-slate-400 text-left'}`}>
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
                            <div className="p-6 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                                    <div className="relative flex-grow group">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask a question..."
                                            className="w-full pl-6 pr-12 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500/10 focus:bg-white focus:outline-none font-bold text-sm transition-all"
                                        />
                                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors">
                                            <Paperclip size={20} />
                                        </button>
                                    </div>
                                    <button
                                        disabled={!input.trim()}
                                        className="w-14 h-14 bg-accent-500 text-white rounded-2xl flex items-center justify-center hover:bg-accent-600 transition-all shadow-xl shadow-accent-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                    >
                                        <Send size={24} className="-mr-1 -mt-1" />
                                    </button>
                                </form>
                                <div className="flex items-center gap-4 mt-4">
                                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 transition-colors">Course Help</button>
                                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 transition-colors">Technical Issue</button>
                                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-900 transition-colors">Pricing</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 bg-slate-950 text-white rounded-[28px] shadow-33xl flex items-center justify-center pointer-events-auto transform hover:scale-110 active:scale-95 transition-all outline-none ring-4 ring-slate-950/10 group ${isOpen ? 'rotate-90' : ''}`}
            >
                {isOpen ? <X size={32} /> : <MessageCircle size={32} className="group-hover:animate-pulse" />}
                {!isOpen && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-2xl flex items-center justify-center font-black text-xs border-4 border-[#fcfdfe]">1</div>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
