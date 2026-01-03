"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Cpu,
  CloudSun,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Leaf,
  MapPin,
  Users,
  Activity
} from "lucide-react";
import { BackgroundRippleEffect } from "@/app/components/ui/background-ripple-effect";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { CometCard } from "@/app/components/ui/comet-card";
import { useLanguage } from "@/app/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <main className="flex flex-col w-full overflow-x-hidden bg-[#f9fafb]">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20">
        <BackgroundRippleEffect />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-800 px-4 py-1 rounded-full text-green-800 font-black text-xs uppercase mb-6 shadow-[2px_2px_0px_0px_rgba(0,128,0,1)]">
                <Leaf className="w-4 h-4" />
                <span>Revolutionizing Farming</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-black text-[#008000] leading-none tracking-tighter">
                {t("heroTitle")}
              </h1>

              <div className="mt-8">
                <TextGenerateEffect
                  words={t("heroSubtitle")}
                  className="max-w-xl [&_span]:!text-2xl [&_span]:!text-[#4b6b3c] [&_span]:!font-bold [&_span]:!leading-relaxed"
                  duration={0.6}
                />
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/reports')}
                  className="
                                        px-8 py-5
                                        rounded-2xl
                                        border-4 border-black
                                        uppercase
                                        bg-[#008000] text-white
                                        text-xl font-black
                                        transition-all duration-150
                                        shadow-[8px_8px_0px_0px_rgba(0,0,0)]
                                        hover:shadow-none
                                        hover:translate-x-2
                                        hover:translate-y-2
                                        active:scale-95
                                        flex items-center gap-3
                                    "
                >
                  {t("getRecommendation")}
                  <ArrowRight className="w-6 h-6" />
                </button>

                <button className="px-8 py-5 rounded-2xl border-4 border-black bg-white text-black text-xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                  WATCH DEMO
                </button>
              </div>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="flex justify-center lg:justify-end relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

              <div className="w-full max-w-[420px]">
                <CometCard className="w-full aspect-square">
                  <div className="relative w-full h-full overflow-hidden rounded-3xl border-4 border-black group">
                    <Image
                      src="/farmer.png"
                      alt="Farmer using technology"
                      width={420}
                      height={420}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-black text-2xl uppercase italic">Empowering 40,000+</p>
                      <p className="font-bold opacity-80">Rural entrepreneurs globally</p>
                    </div>
                  </div>
                </CometCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 bg-white border-y-8 border-black relative overflow-hidden">
        {/* Background Leaf SVGs */}
        <div className="absolute top-10 left-10 text-green-100 opacity-20 -rotate-12">
          <Leaf className="w-64 h-64" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-100 opacity-20 rotate-45">
          <Leaf className="w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-black uppercase tracking-tighter mb-4 italic">
              {t("featuresTitle")}
            </h2>
            <div className="h-4 w-64 bg-green-500 mx-auto border-2 border-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Cpu, title: t("aiAnalysis"), desc: t("aiAnalysisDesc"), color: 'bg-blue-100' },
              { icon: CloudSun, title: t("weatherTracking"), desc: t("weatherTrackingDesc"), color: 'bg-orange-100' },
              { icon: TrendingUp, title: t("marketStrategy"), desc: t("marketStrategyDesc"), color: 'bg-emerald-100' },
              { icon: ShieldAlert, title: t("diseaseDetection"), desc: t("diseaseDetectionDesc"), color: 'bg-red-100' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className={`border-4 border-black p-8 rounded-3xl ${feature.color} shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0)] transition-all flex flex-col items-start h-full`}
              >
                <div className="bg-white border-2 border-black p-4 rounded-2xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                  <feature.icon className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-black text-black mb-4 uppercase leading-tight">{feature.title}</h3>
                <p className="text-gray-900 font-bold leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 bg-[#eef6df]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-black text-black leading-none uppercase tracking-tighter">
                {t("howItWorksTitle")}
              </h2>
            </div>
            <div className="text-2xl font-black text-green-800 bg-white border-4 border-black px-8 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0)] italic uppercase">
              Simply 3 Steps
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connecting Line (hidden on mobile) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-2 bg-black -translate-y-1/2 z-0"></div>

            {[
              { step: "01", title: t("step1Title"), desc: t("step1Desc") },
              { step: "02", title: t("step2Title"), desc: t("step2Desc") },
              { step: "03", title: t("step3Title"), desc: t("step3Desc") },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10">
                <div className="bg-white border-4 border-black p-10 rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0)] flex flex-col items-center text-center group hover:bg-green-600 hover:text-white transition-colors duration-300">
                  <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-4xl font-black mb-8 border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] group-hover:bg-white group-hover:text-black group-hover:border-black transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">{step.title}</h3>
                  <p className="font-bold opacity-80 leading-relaxed text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="py-32 px-6 bg-black text-white overflow-hidden relative">
        {/* Decorative dots */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12 italic">
                {t("impactTitle")}
              </h2>
              <p className="text-2xl font-bold text-gray-400 max-w-lg mb-12">
                We're bridging the gap between traditional wisdom and cutting-edge technology to ensure food security for all.
              </p>
              <div className="flex gap-4">
                <div className="p-4 bg-green-500 rounded-2xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <Activity className="w-8 h-8 text-black" />
                </div>
                <div className="p-4 bg-yellow-500 rounded-2xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <Users className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8">
              {[
                { val: t("impact1Val"), label: t("impact1Label"), icon: Users },
                { val: t("impact2Val"), label: t("impact2Label"), icon: Activity },
                { val: t("impact3Val"), label: t("impact3Label"), icon: MapPin },
              ].map((stat, idx) => (
                <div key={idx} className="border-4 border-white p-8 rounded-3xl bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex items-center gap-6">
                  <div className="bg-white p-4 rounded-2xl">
                    <stat.icon className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <p className="text-5xl font-black text-green-400 tracking-tighter">{stat.val}</p>
                    <p className="text-xl font-black uppercase text-white/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-40 px-6 bg-white flex flex-col items-center text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl border-8 border-black p-16 rounded-[60px] bg-green-50 shadow-[20px_20px_0px_0px_rgba(0,0,0)]"
        >
          <h2 className="text-5xl md:text-7xl font-black text-black uppercase leading-none mb-8 tracking-tighter">
            READY TO OPTIMIZE YOUR HARVEST?
          </h2>
          <p className="text-2xl font-bold text-gray-700 mb-12 max-w-2xl mx-auto">
            Join thousands of smart farmers using AI to increase their yield and secure their financial future.
          </p>
          <button className="bg-black text-white px-12 py-6 rounded-3xl text-3xl font-black uppercase shadow-[10px_10px_0px_0px_rgba(34,197,94,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all active:scale-95 flex items-center gap-4 mx-auto">
            START YOUR FREE ANALYSIS
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </button>
          <p className="mt-8 text-sm font-black text-black/40 uppercase tracking-widest italic">
            No credit card required • Available in 8+ Local Languages
          </p>
        </motion.div>
      </section>
    </main>
  );
}
