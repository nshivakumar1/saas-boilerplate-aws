import { useState } from 'react';
import { generateText, reportIncident } from '../services/api';
import { LogOut, Bot, AlertTriangle, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </div>
);

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [incidentTitle, setIncidentTitle] = useState('');
    const [incidentDesc, setIncidentDesc] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const res = await generateText(prompt);
            setResult(res.response || 'No response');
        } catch (e) {
            setResult('Error generating text');
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async () => {
        try {
            await reportIncident(incidentTitle, incidentDesc, 1);
            alert('Incident Reported!');
            setIncidentTitle('');
            setIncidentDesc('');
        } catch (e) {
            alert('Error reporting incident');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">S</div>
                    <span className="text-xl font-bold tracking-tight">SaasStarter</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={Bot} label="AI Assistant" />
                    <SidebarItem icon={AlertTriangle} label="Incidents" />
                    <SidebarItem icon={Settings} label="Settings" />
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">Pro Plan</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto relative">
                <div className="mesh-gradient-bg opacity-30" />

                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {user?.username}</h1>
                        <p className="text-gray-400">Here's what's happening today.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AI Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 rounded-2xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Gemini AI Assistant</h2>
                                <p className="text-sm text-gray-400">Powered by Google Gemini</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                className="glass-input w-full p-4 rounded-xl min-h-[120px] resize-none"
                                placeholder="Ask me anything..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="glass-button px-6 py-2 rounded-lg text-white font-medium"
                                >
                                    {loading ? 'Thinking...' : 'Generate Response'}
                                </button>
                            </div>
                        </div>

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <p className="text-gray-200 leading-relaxed">{result}</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Incident Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-6 rounded-2xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Report Incident</h2>
                                <p className="text-sm text-gray-400">Create ticket in Linear & Notify Slack</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="glass-input w-full p-3 rounded-lg"
                                    placeholder="Brief summary of the issue"
                                    value={incidentTitle}
                                    onChange={(e) => setIncidentTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    className="glass-input w-full p-3 rounded-lg resize-none"
                                    rows={4}
                                    placeholder="Detailed description..."
                                    value={incidentDesc}
                                    onChange={(e) => setIncidentDesc(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleReport}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Submit Incident Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
