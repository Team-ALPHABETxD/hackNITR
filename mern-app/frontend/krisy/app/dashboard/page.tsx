"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/context/language-context";
import { Sprout, Calendar, AlertTriangle, ArrowRight, Sun, Droplets, CheckCircle2 } from "lucide-react";

interface Advice {
    date: string;
    message: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    ngo?: string;
}

export default function DashboardPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [advices, setAdvices] = useState<Advice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            router.push("/login");
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error(e);
            router.push("/login");
            return;
        }

        // Fetch Advices
        const fetchAdvices = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/users/advices", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    // Advices seem to be embedded in 'data' key based on userRoutes.js: res.status(200).json({ data: advices })
                    setAdvices(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch advices", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvices();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-xl font-bold uppercase">
                Loading Dashboard...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="relative min-h-screen flex flex-col items-center px-4 pt-32 pb-20">
            {/* Background Image with Blur */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/farmer2.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-800 px-4 py-1 rounded-full text-green-800 font-black text-xs uppercase mb-4 shadow-[2px_2px_0px_0px_rgba(0,128,0,1)]">
                            <Sprout className="w-4 h-4" />
                            <span>Farmer Dashboard</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#008000] uppercase tracking-tight">
                            Welcome, {user.name}!
                        </h1>
                        <p className="text-black font-bold mt-2 text-lg">
                            Here is your daily farming summary.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/reports")}
                        className="
                            px-8 py-4
                            rounded-xl
                            border-4 border-black
                            uppercase
                            bg-black text-white
                            text-lg font-black
                            transition-all duration-150
                            shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]
                            hover:shadow-none
                            hover:translate-x-1
                            hover:translate-y-1
                            active:scale-95
                            flex items-center gap-3
                        "
                    >
                        Start New Analysis
                        <ArrowRight className="w-5 h-5 text-green-400" />
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Quick Stats / Actions */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                <Sun className="w-8 h-8 text-green-700" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-1">Today's Weather</h3>
                            <p className="text-sm font-bold text-gray-500">Checking local data...</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                <Droplets className="w-8 h-8 text-blue-700" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-1">Soil Status</h3>
                            <p className="text-sm font-bold text-gray-500">Optimum Moisture</p>
                        </div>
                    </div>

                    {/* RIGHT: Daily Advisory Feed */}
                    <div className="lg:col-span-2">
                        <div className="bg-white min-h-[500px] p-8 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-100 pb-4">
                                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-3xl font-black uppercase tracking-tight">Daily Advisory Report</h2>
                            </div>

                            {advices.length === 0 ? (
                                <div className="text-center py-20 opacity-50">
                                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                    <p className="font-bold text-xl">No new advisories for today.</p>
                                    <p className="text-sm">Check back later or run a new analysis.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {advices.slice().reverse().map((advice, idx) => (
                                        <div key={idx} className="p-6 bg-yellow-50 rounded-xl border-2 border-black shadow-sm flex gap-4">
                                            <div className="shrink-0 pt-1">
                                                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                                                    {new Date(advice.date).getDate()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(advice.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 leading-relaxed">
                                                    {advice.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
