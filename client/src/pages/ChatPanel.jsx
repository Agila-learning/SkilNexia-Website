import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Search, Send, User, MessageCircle, Clock, CheckCircle, ChevronRight } from 'lucide-react';
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

    const socket = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Initialize Socket
        socket.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

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
        return otherParticipant?.name?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in font-sans">
            {/* Left Column: Chat List */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Support Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center p-8 text-slate-400 text-[10px] font-black uppercase tracking-widest">No active chats</div>
                    ) : (
                        filteredChats.map(chat => {
                            const student = chat.participants.find(p => p._id !== user._id);
                            const isActive = selectedChat?._id === chat._id;
                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all mb-1 ${isActive ? 'bg-white shadow-md border border-slate-100' : 'hover:bg-white'}`}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-600">
                                            {student?.name?.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-grow text-left overflow-hidden">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className="text-xs font-black text-slate-900 uppercase truncate">{student?.name}</h4>
                                            <span className="text-[9px] font-bold text-slate-400">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-500 truncate">{chat.latestMessage?.content || 'New conversation'}</p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Column: Chat Window */}
            <div className="flex-grow flex flex-col bg-white">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                                    {selectedChat.participants.find(p => p._id !== user._id)?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                        {selectedChat.participants.find(p => p._id !== user._id)?.name}
                                    </h3>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Student · Active now</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"><Clock size={18} /></button>
                                <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"><CheckCircle size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                            {messages.map((m, i) => {
                                const isMe = m.sender._id === user._id || m.sender === user._id;
                                return (
                                    <div key={m._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm ${isMe ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                                            {m.content}
                                            <p className={`text-[9px] mt-2 font-black uppercase tracking-tighter ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Chat Input */}
                        <div className="p-6 border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-grow px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-100 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="px-8 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black uppercase text-xs tracking-widest hover:bg-primary-900 transition-all disabled:opacity-50"
                                >
                                    Send Reply
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-slate-50/20">
                        <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl border border-slate-100 flex items-center justify-center text-slate-300 mb-8 animate-bounce">
                            <MessageCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Select a Conversation</h3>
                        <p className="text-slate-500 font-medium max-w-sm">Select a student from the sidebar to view their inquiries and provide real-time support.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPanel;
