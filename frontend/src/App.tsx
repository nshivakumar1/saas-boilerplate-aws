import { useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import { motion } from 'framer-motion';
import { Mail, Lock, Key, ArrowRight, Loader2 } from 'lucide-react';

const AuthPage = () => {
    const { login, signup, confirmSignup, error, clearError, isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    const [isConfirming, setIsConfirming] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isConfirming) {
                await confirmSignup(email, code);
                setIsConfirming(false);
                setIsLogin(true);
                alert('Account confirmed! You can now login.');
            } else if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
                setIsConfirming(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="mesh-gradient-bg" />

            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 mx-4"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {isConfirming ? 'Verify Account' : (isLogin ? 'Welcome Back' : 'Create Account')}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {isConfirming ? 'Enter the code sent to your email' : (isLogin ? 'Enter your details to access your account' : 'Start your journey with us today')}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isConfirming && (
                        <>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {isConfirming && (
                        <div className="relative">
                            <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Verification Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="glass-button w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                {isConfirming ? 'Verify' : (isLogin ? 'Sign In' : 'Sign Up')}
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>

                {!isConfirming && (
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setIsLogin(!isLogin); clearError(); }}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<AuthPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
