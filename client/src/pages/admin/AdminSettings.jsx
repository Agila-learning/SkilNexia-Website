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
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight uppercase">System Settings</h1>
                    <p className="text-slate-500 font-medium">Configure platform-wide environment variables and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                            <Globe className="text-primary-600" /> General Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Site Name</label>
                                <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="form-input" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Support Email</label>
                                <input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} className="form-input" />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Maintenance Mode</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Disable public access during updates</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input type="checkbox" checked={settings.enableRegistration} onChange={e => setSettings({ ...settings, enableRegistration: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Allow New Signups</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Toggle user registration on/off</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                            <Shield className="text-emerald-600" /> Security & Auth
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-700 italic">Two-Factor Authentication (Coming Soon)</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Force staff to use 2FA for access</p>
                                </div>
                                <button disabled className="px-4 py-1.5 bg-slate-200 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Enable</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                            <Palette className="text-purple-600" /> Branding
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Brand Color</label>
                                <div className="flex gap-4 items-center">
                                    <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} className="w-12 h-12 rounded-xl border-none cursor-pointer" />
                                    <span className="text-xs font-bold font-mono text-slate-500 uppercase">{settings.primaryColor}</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logo Upload</p>
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <Database className="text-slate-300 mb-2 group-hover:text-primary-400 transition-colors" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Click to upload SVG logo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                            <NotificationIcon className="text-amber-500" /> Quick Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Payment Gateway</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">Live</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">SMS Provider</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Email Server</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationIcon = Bell;

export default AdminSettings;
