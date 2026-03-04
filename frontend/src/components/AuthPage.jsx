import React, { useState } from 'react';

const AuthPage = ({ onHome, initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [showPassword, setShowPassword] = useState(false);

    // --- THE ORGANIC LOGIN VIEW (RESTORED) ---
    const LoginView = () => (
        <div className="min-h-screen w-full bg-[#0a0a1a] flex items-center justify-center font-sans overflow-hidden relative selection:bg-blue-100 selection:text-blue-900 animate-fade-in">
            {/* 1. LAYER: EVENT BACKGROUND */}
            <div className="fixed inset-0 z-0 bg-[#0a0a1a]">
                <img
                    src="/event-auth-bg.png"
                    alt="event management background"
                    className="w-full h-full object-cover scale-105 animate-subtle-zoom opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a]/80 via-transparent to-[#0a0a1a]/90"></div>
            </div>

            {/* 2. LAYER: CSS PARTICLES, LIGHTS & FLOATING CARDS */}
            <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden text-white/5 font-bold text-9xl select-none leading-none opacity-20">EVENTS</div>
            <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* New: Orbiting Slow Glows */}
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-slow-spin pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full blur-sm opacity-20"></div>
                    <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-purple-400 rounded-full blur-md opacity-20"></div>
                </div>

                {[...Array(40)].map((_, i) => (
                    <div key={i} className="absolute bg-white rounded-full opacity-0 animate-float-particle" style={{
                        width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px',
                        left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
                        animationDuration: Math.random() * 10 + 8 + 's', animationDelay: Math.random() * 8 + 's'
                    }} />
                ))}

                <div className="absolute bottom-1/4 right-[8%] w-56 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl animate-float-slower hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-white/50 text-[10px] font-bold uppercase tracking-widest">
                            <span>Live Event</span>
                            <span className="text-red-400 animate-pulse">● Live</span>
                        </div>
                        <span className="text-white text-sm font-bold">International Tech Summit</span>
                    </div>
                </div>
            </div>

            {/* 3. LAYER: THE ORGANIC WHITE SECTION */}
            <div className="absolute inset-0 z-10 flex items-center justify-start pointer-events-none px-6 lg:px-24">
                <div className="w-full max-w-[850px] h-[90vh] bg-white opacity-95 animate-blob-stable shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                    style={{ borderRadius: '35% 65% 62% 38% / 44% 48% 52% 56%', marginLeft: '-5%' }}>
                </div>
            </div>

            {/* 5. LAYER: ACTUAL CONTENT - Pushed right to be inside the white area */}
            <div className="relative z-40 w-full h-screen flex flex-col p-8 lg:p-14 max-w-[1700px] mx-auto">
                <header className="flex justify-between items-center w-full mb-2 lg:mb-6 pl-14 lg:pl-24 pr-4">
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] transform group-hover:rotate-[15deg] transition-transform duration-500">
                                <span className="text-white font-black text-xl leading-none select-none">E</span>
                                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className="text-slate-900 text-2xl tracking-tighter leading-none select-none">
                                <span className="font-extrabold">Event</span><span className="font-light text-slate-500">Manager</span>
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] pl-1 opacity-70">Professional Suite</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onHome} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all backdrop-blur-md">← Home</button>
                        <div className="flex items-center text-white text-sm font-bold gap-8 px-8 py-2 bg-black/10 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                            <button disabled className="text-blue-400 uppercase tracking-widest">Sign In</button>
                            <div className="h-4 w-[1px] bg-white/20"></div>
                            <button onClick={() => setIsLogin(false)} className="hover:text-blue-300 transition-colors opacity-70 hover:opacity-100 uppercase tracking-widest">Sign Up</button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex items-center px-14 lg:px-32">
                    <div className="w-full max-w-lg space-y-2 lg:ml-8">
                        <div className="animate-form-reveal" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-slate-400 text-3xl font-light mb-1">Welcome Back,</h3>
                        </div>
                        <div className="animate-form-reveal" style={{ animationDelay: '0.2s' }}>
                            <h1 className="text-slate-900 text-5xl lg:text-6xl font-black tracking-tighter mb-16 leading-tight">Manage your <span className="text-blue-600">Events</span></h1>
                        </div>

                        <form className="space-y-10 max-w-md w-full" onSubmit={(e) => e.preventDefault()}>
                            <div className="animate-form-reveal" style={{ animationDelay: '0.3s' }}>
                                <div className="space-y-3 group/input relative">
                                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] pl-1 group-focus-within/input:text-blue-600 transition-colors">
                                        <svg className="w-3 h-3 transform group-focus-within/input:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Email Portal
                                    </label>
                                    <div className="relative overflow-hidden rounded-2xl">
                                        <input type="email" placeholder="name@company.com" className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-base text-slate-700 placeholder:text-slate-300 font-medium" />
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 group-focus-within/input:w-full transition-all duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="animate-form-reveal" style={{ animationDelay: '0.4s' }}>
                                <div className="space-y-3 group/input relative">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] pl-1 group-focus-within/input:text-blue-600 transition-colors">
                                            <svg className="w-3 h-3 transform group-focus-within/input:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Security Key
                                        </label>
                                        <a href="#" className="text-[11px] font-bold text-slate-300 hover:text-blue-600 uppercase tracking-widest transition-colors hover:scale-105">Forgot?</a>
                                    </div>
                                    <div className="relative overflow-hidden rounded-2xl">
                                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-base text-slate-700 placeholder:text-slate-300 font-bold tracking-[0.2em] pr-14" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors bg-white/50 p-2 rounded-xl backdrop-blur-sm">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 group-focus-within/input:w-full transition-all duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="animate-form-reveal" style={{ animationDelay: '0.5s' }}>
                                <button className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[13px] py-4.5 px-16 rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-8px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.3em] overflow-hidden">
                                    <span className="relative z-10">Access Dashboard</span>
                                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            </div>
                        </form>

                        <div className="animate-form-reveal" style={{ animationDelay: '0.6s' }}>
                            <div className="pt-16 flex flex-col gap-8">
                                <div className="flex items-center gap-6">
                                    <span className="text-[11px] text-slate-400 font-bold italic tracking-wider">Connect via:</span>
                                    <div className="flex gap-8">
                                        {['google', 'twitter', 'facebook'].map((social, i) => (
                                            <button key={i} className="text-slate-900 opacity-40 hover:opacity-100 hover:scale-125 transition-all outline-none group/social">
                                                <svg className="w-5 h-5 group-hover/social:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                    {social === 'google' && <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.32 4.28-1.52 1.04-3.48 1.64-5.52 1.64-4.8 0-8.8-3.32-10.24-7.8-.32-.96-.52-1.96-.52-3s.2-2.04.52-3c1.44-4.48 5.44-7.8 10.24-7.8 2.52 0 4.84.92 6.6 2.48l2.56-2.56c-2.4-2.2-5.56-3.52-9.16-3.52-8.32 0-15.08 6.76-15.08 15.08s6.76 15.08 15.08 15.08c7.2 0 13.08-5.2 14.68-12.12.32-1.44.4-2.48.4-4.16h-15.08z" />}
                                                    {social === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
                                                    {social === 'facebook' && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />}
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[12px] text-slate-400 font-medium max-w-sm">By continuing, you agree to our <a href="#" className="text-blue-600 underline">Terms</a>. Need help? <a href="#" className="text-blue-600 font-bold hover:underline">Support</a></p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );

    // --- THE NEW REGISTRATION VIEW (MATCHING SCREENSHOT) ---
    const RegisterView = () => (
        <div className="min-h-screen w-full bg-[#0a192f] flex items-center justify-center font-sans p-4 relative overflow-hidden animate-fade-in">
            {/* Background Decorative */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" />

            {/* Back to Home & Portal Navigation (Top Right) */}
            <div className="fixed top-8 right-8 z-[100] flex gap-4 items-center">
                <button
                    onClick={() => setIsLogin(true)}
                    className="px-6 py-2.5 bg-black/20 backdrop-blur-2xl border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-xl hover:bg-blue-600/40 hover:border-blue-400/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Login
                </button>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <button
                    onClick={onHome}
                    className="px-6 py-2.5 bg-white/10 backdrop-blur-2xl border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <svg className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Home
                </button>
            </div>

            {/* Main Card (Matching Screenshot Step 410 exactly) */}
            <div className="relative w-full max-w-5xl h-[700px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex">
                {/* Left Info Panel (The Welcome Back part from screenshot) */}
                <div className="relative w-[45%] h-full overflow-hidden hidden lg:block">
                    <img src="/event-auth-bg.png" className="w-full h-full object-cover blur-[1px] scale-110" />
                    <div className="absolute inset-0 bg-[#1e40af]/90 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-sm font-light opacity-80 mb-10 max-w-[250px]">To keep connected with us please login with your personal info.</p>
                        <button onClick={() => setIsLogin(true)} className="px-14 py-3 border-2 border-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-blue-700 transition-all transform hover:scale-105">Sign In</button>
                    </div>
                </div>

                {/* Right Form Panel (The Create Account part from screenshot) */}
                <div className="flex-1 h-full flex flex-col items-center justify-center p-14 bg-white">
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Create Account</h1>

                    {/* Social Icons as per screenshot */}
                    <div className="flex gap-4 mb-8">
                        {[
                            { icon: 'f', color: 'text-blue-600' },
                            { icon: 'G', color: 'text-red-500' },
                            { icon: 'i', color: 'text-pink-500' },
                            { icon: 'in', color: 'text-blue-800' }
                        ].map((s, i) => (
                            <button key={i} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:scale-110 transition-all shadow-sm">
                                <span className={`font-black text-sm ${s.color}`}>{s.icon}</span>
                            </button>
                        ))}
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium mb-8">Or use your email for registration</span>

                    <form className="w-full space-y-4 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" placeholder="Full Name" className="w-full bg-[#f4f8f7] border-none py-4 px-6 rounded-[20px] outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/10 transition-all" />
                        <input type="email" placeholder="Email Address" className="w-full bg-[#f4f8f7] border-none py-4 px-6 rounded-[20px] outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/10 transition-all" />
                        <input type="password" placeholder="Password" className="w-full bg-[#f4f8f7] border-none py-4 px-6 rounded-[20px] outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/10 transition-all" />

                        <div className="pt-8 flex flex-col items-center">
                            <button className="px-16 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isLogin ? <LoginView /> : <RegisterView />}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes subtleZoom { 0% { transform: scale(1.1); } 50% { transform: scale(1.15); } 100% { transform: scale(1.1); } }
        @keyframes blobStable { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(5px, -5px) rotate(0.5deg); } }
        @keyframes formReveal { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes floatParticle { 0% { transform: translateY(0) translateX(0); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { transform: translateY(-100vh) translateX(50px); opacity: 0; } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-subtle-zoom { animation: subtleZoom 30s ease-in-out infinite; }
        .animate-blob-stable { animation: blobStable 15s ease-in-out infinite; }
        .animate-form-reveal { animation: formReveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-float-particle { animation: floatParticle linear infinite; }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes slowSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .animate-slow-spin { animation: slowSpin 60s linear infinite; }
      `}} />
        </>
    );
};

export default AuthPage;
