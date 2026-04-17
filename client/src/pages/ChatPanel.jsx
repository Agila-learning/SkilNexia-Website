import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Search, Send, User, MessageCircle, Clock, CheckCircle, ChevronRight, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const ChatPanel = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);

    const socket = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Initialize Socket
        let socketUrl = import.meta.env.VITE_SOCKET_URL;
        if (!socketUrl) {
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                socketUrl = window.location.origin;
            } else {
                socketUrl = 'http://localhost:5000';
            }
        }
        socket.current = io(socketUrl);

        socket.current.on('receive_message', (message) => {
            if (selectedChat && message.chatId === selectedChat._id) {
                setMessages((prev) => [...prev, message]);
            }
            // Update latest message in chat list
            setChats(prev => prev.map(c =>
                c._id === message.chatId ? { ...c, latestMessage: message } : c
            ));
        });

        fetchChats();

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedChat) {
            socket.current.emit('join_chat', selectedChat._id);
            fetchMessages(selectedChat._id);
        }
    }, [selectedChat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchChats = async () => {
        try {
            const res = await api.get('/chats');
            setChats(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const res = await api.get('/chats/users');
            setAvailableUsers(res.data.data || []);
            setShowUserList(true);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const startNewChat = async (participantId) => {
        try {
            const res = await api.post('/chats', { participantId });
            const newChat = res.data.data;
            if (!chats.find(c => c._id === newChat._id)) {
                setChats([newChat, ...chats]);
            }
            setSelectedChat(newChat);
            setShowUserList(false);
        } catch (error) {
            console.error("Failed to start chat", error);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const res = await api.get(`/chats/${chatId}/messages`);
            setMessages(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedChat) return;

        const messageData = {
            chatId: selectedChat._id,
            senderId: user._id,
            content: input
        };

        socket.current.emit('send_message', messageData);
        setInput('');
    };

    const filteredChats = chats.filter(c => {
        const otherParticipant = c.participants.find(p => p._id !== user._id);
        const nameToSearch = otherParticipant ? otherParticipant.name : (c.guestId ? `Guest ${c.guestId.slice(-4)}` : 'Unknown');
        return nameToSearch.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex h-[calc(100vh-180px)] glass-card-premium border border-white/5 rounded-[40px] overflow-hidden shadow-2xl animate-fade-in bg-slate-900/40">
            {/* Left Column: Chat List */}
            <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/20">
                <div className="p-8 border-b border-white/5 bg-slate-900/40">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">Support Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter nodes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-500/50 transition-all outline-none"
                        />
                    </div>
                    <button 
                        onClick={fetchAvailableUsers}
                        className="w-full mt-4 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-lg"
                    >
                        Initialize New Link
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-3 space-y-2 no-scrollbar">
                    {loading ? (
                        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div></div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center p-12 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 mx-auto">
                                <MessageCircle size={24} />
                            </div>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">No Active Channels</p>
                        </div>
                    ) : (
                        filteredChats.map(chat => {
                            const student = chat.participants.find(p => p._id !== user._id);
                            const isActive = selectedChat?._id === chat._id;
                            const displayName = (student && student.name) ? student.name : (chat.guestId ? `GUEST-${chat.guestId.slice(-4)}` : 'System Node');
                            
                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`w-full p-5 rounded-3xl flex items-center gap-4 transition-all group ${isActive ? 'bg-white/10 shadow-xl border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg border border-white/10 group-hover:scale-105 transition-transform ${isActive ? 'bg-accent-500' : 'bg-slate-800'}`}>
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-slate-900"></div>
                                    </div>
                                    <div className="flex-grow text-left overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className={`text-xs font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>{displayName}</h4>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-500 truncate lowercase">{chat.latestMessage?.content || 'Awaiting transmission...'}</p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Column: Chat Window */}
            <div className="flex-grow flex flex-col bg-slate-950/20">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-[20px] bg-white text-slate-950 flex items-center justify-center font-black text-xl shadow-2xl shadow-white/5">
                                    {selectedChat.participants.find(p => p._id !== user._id)?.name?.charAt(0) || 'G'}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                                        {selectedChat.participants.find(p => p._id !== user._id)?.name || (selectedChat.guestId ? `GUEST NODE ${selectedChat.guestId.slice(-4)}` : 'ACTIVE TRANSMISSION')}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Operational · Secure Link</p>
                                    </div>
                                </div>
                            </div>
                             <div className="flex gap-3">
                                <button 
                                    onClick={() => alert('Session log history is being compiled...')}
                                    title="Session Log" 
                                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <Clock size={18} />
                                </button>
                                <button 
                                    onClick={() => alert('Marking thread as resolved...')}
                                    title="Resolve Thread" 
                                    className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                    <CheckCircle size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-8 no-scrollbar bg-slate-950/40">
                            {messages.map((m, i) => {
                                const senderId = m.sender?._id || m.sender;
                                const isMe = senderId === user._id;
                                return (
                                    <div key={m._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[75%] space-y-2 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className={`p-5 rounded-[24px] text-sm font-medium shadow-2xl ${isMe ? 'bg-white text-slate-950 rounded-br-none' : 'bg-slate-800 text-slate-100 border border-white/5 rounded-bl-none'}`}>
                                                {m.content}
                                            </div>
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Chat Input */}
                        <div className="p-8 border-t border-white/5 bg-slate-900/40">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Transmit response node..."
                                    className="flex-grow px-8 py-5 bg-white/5 border border-white/10 rounded-[22px] text-sm font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="px-10 bg-white text-slate-950 rounded-[22px] flex items-center justify-center font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-30"
                                >
                                    <Send size={16} className="mr-3" /> Execute
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-accent-500/20 blur-[60px] rounded-full animate-pulse"></div>
                            <div className="relative w-28 h-28 bg-slate-900 rounded-[44px] shadow-2xl border border-white/10 flex items-center justify-center text-slate-700">
                                <MessageCircle size={56} className="text-accent-500/50" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Initialize Link</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-sm leading-relaxed">Select an active transmission node from the payload list to establish a secure support link.</p>
                    </div>
                )}
            </div>

            {/* User Selection Modal */}
            {showUserList && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowUserList(false)}></div>
                    <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[40px] shadow-3xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Select Transmission Node</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Initialize secure communication channel</p>
                            </div>
                            <button onClick={() => setShowUserList(false)} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-6 space-y-3 no-scrollbar">
                            {availableUsers.map(u => (
                                <button
                                    key={u._id}
                                    onClick={() => startNewChat(u._id)}
                                    className="w-full p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 flex items-center gap-4 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform">
                                        {u.name?.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight">{u.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{u.role}</p>
                                    </div>
                                    <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPanel;
