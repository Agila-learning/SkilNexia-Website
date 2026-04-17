import React, { useState } from 'react';
import { Save, Globe, Shield, Bell, CheckCircle, Database, Smartphone, Palette } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'Skilnexia',
        contactEmail: 'support@skilnexia.com',
        maintenanceMode: false,
        enableRegistration: true,
        primaryColor: '#0f172a'
    });

    const handleSave = () => {
        alert("Settings saved successfully!");
    };

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-1 tracking-tight uppercase">Core Protocol</h1>
                    <p className="text-slate-400 font-medium">Configure platform-wide environment variables and system preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-8 py-4 bg-white text-slate-950 rounded-[22px] font-black flex items-center gap-3 hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 uppercase text-[10px] tracking-widest"
                >
                    <Save size={18} /> Deploy Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card-premium border border-white/5 rounded-[40px] bg-slate-900/40 p-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                            <Globe className="text-accent-500" /> General Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Site Identity</label>
                                <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Support Node Email</label>
                                <input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 transition-all shadow-inner" />
                            </div>
                            <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/5">
                                <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="w-6 h-6 rounded-lg border-white/10 bg-slate-950 text-accent-500 focus:ring-accent-500/20" />
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Maintenance Protocol</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1">Disable public access during updates</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/5">
                                <input type="checkbox" checked={settings.enableRegistration} onChange={e => setSettings({ ...settings, enableRegistration: e.target.checked })} className="w-6 h-6 rounded-lg border-white/10 bg-slate-950 text-accent-500 focus:ring-accent-500/20" />
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Registration Gate</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1">Toggle user registration on/off</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card-premium border border-white/5 rounded-[40px] bg-slate-900/40 p-10 relative overflow-hidden shadow-2xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                            <Shield className="text-emerald-500" /> Security Node
                        </h3>
                        <div className="space-y-6">
                            <div className="p-8 rounded-[32px] border border-white/5 bg-white/5 flex items-center justify-between group">
                                <div>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-tight italic group-hover:text-white transition-colors">Multi-Factor Authentication (Coming Soon)</p>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mt-1">Force staff to use 2FA for access</p>
                                </div>
                                <button disabled className="px-6 py-2 bg-white/5 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">Locked</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card-premium border border-white/5 rounded-[40px] bg-slate-900/40 p-10 relative overflow-hidden shadow-2xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                            <Palette className="text-purple-500" /> Visual Identity
                        </h3>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Primary Brand Vector</label>
                                <div className="flex gap-6 items-center">
                                    <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} className="w-16 h-16 rounded-2xl border-none cursor-pointer bg-slate-950 p-2" />
                                    <span className="text-xs font-black font-mono text-slate-400 uppercase tracking-widest">{settings.primaryColor}</span>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Asset Synchronization</p>
                                <div className="p-10 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-accent-500/50 transition-all cursor-pointer group">
                                    <Database className="text-slate-700 mb-4 group-hover:text-accent-500 transition-colors" size={32} />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Upload SVG Payload</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card-premium border border-white/5 rounded-[40px] bg-slate-900/40 p-10 relative overflow-hidden shadow-2xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                            <NotificationIcon className="text-amber-500" /> Network Status
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Revenue Gateway', status: 'Online', color: 'text-emerald-500' },
                                { label: 'Signal Provider', status: 'Sync', color: 'text-emerald-500' },
                                { label: 'Relay Server', status: 'Online', color: 'text-emerald-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationIcon = Bell;

export default AdminSettings;
