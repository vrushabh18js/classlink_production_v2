import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, BookOpen, GraduationCap, ArrowRight, Zap, Globe, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Landing() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const features = [
    { icon: Sparkles, title: "Smart Seating", desc: "Automated distribution logic to ensure academic integrity during exams." },
    { icon: Globe, title: "Resource Hub", desc: "Real-time visibility into classroom availability and facility allocation." },
    { icon: Zap, title: "Swift Notifications", desc: "Direct priority communications from faculty to specific student batches." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 -right-48 w-full h-full bg-blue-50 rounded-full blur-3xl opacity-40 translate-y-[-50%]" />
      </div>

      <header className="fixed top-0 w-full z-50 px-8 h-20 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-brand-primary" />
            <span className="font-bold text-xl tracking-tight text-slate-800">ClassLink</span>
        </div>
        <div className="flex items-center gap-6">
           <button className="text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors">Documentation</button>
           <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">System Status</button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-8 pt-48 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-brand-primary border border-emerald-100 mb-8"
          >
             <Zap className="w-3 h-3 fill-emerald-500" />
             <span className="text-[10px] font-bold tracking-widest uppercase">Next-Gen Academic Infrastructure</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl font-extrabold tracking-tighter text-slate-900 mb-6"
          >
            ClassLink <br />
            <span className="text-brand-primary italic">for DYPCOEI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed"
          >
            Precision scheduling, automated examination logistics, and dynamic student communication. 
            Engineered for excellence in higher education administration.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
               <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-primary" /> System Access
               </h2>
               
               <form 
                 onSubmit={async (e) => {
                   e.preventDefault();
                   const formData = new FormData(e.currentTarget);
                   const username = formData.get("username") as string;
                   const password = formData.get("password") as string;
                   const success = await login(username, password);
                   if (!success) {
                      alert("Invalid credentials. Please try again.");
                   }
                 }}
                 className="space-y-4"
               >
                  <div className="space-y-1.5 text-left">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username / ID</label>
                     <input 
                       name="username"
                       type="text"
                       required
                       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none transition-all text-sm font-semibold"
                       placeholder="Admin, Roll No, or Abbreviation"
                     />
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                     <input 
                       name="password"
                       type="password"
                       required
                       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none transition-all text-sm font-semibold"
                       placeholder="············"
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-secondary transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4"
                  >
                    Authenticate Access <ArrowRight className="w-4 h-4" />
                  </button>
               </form>

               <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-3 gap-2">
                  <div className="text-center">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Admin</p>
                     <p className="text-[9px] text-slate-400 font-mono">admin/123</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Student</p>
                     <p className="text-[9px] text-slate-400 font-mono">1101/1101</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Faculty</p>
                     <p className="text-[9px] text-slate-400 font-mono">SNM/SNM</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
           {features.map((f, i) => (
             <motion.div 
               key={f.title}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 + i * 0.1 }}
               className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group"
             >
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <f.icon className="w-7 h-7 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {f.desc}
                </p>
             </motion.div>
           ))}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white/50 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Higher Education OS · 2026</p>
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
               <a href="#" className="hover:text-slate-600 transition-colors">Privacy Infrastructure</a>
               <a href="#" className="hover:text-slate-600 transition-colors">Security Audit</a>
               <a href="#" className="hover:text-slate-600 transition-colors">Academic Compliance</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
