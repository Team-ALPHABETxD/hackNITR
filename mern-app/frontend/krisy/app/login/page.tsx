"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import { useLanguage } from "@/app/context/language-context";

export default function LoginPage() {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen flex items-start justify-center px-4 pt-44">
            {/* Background Image with Blur */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/farmer2.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
            </div>
            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0),8px_8px_0px_0px_rgba(0,0,0)]">

                {/* Heading */}
                <h2 className="text-2xl font-black text-center text-[#008000] uppercase tracking-tight">
                    {t("login")}
                </h2>

                <form className="mt-8 space-y-5 transition-all duration-300">
                    <div>
                        <Label htmlFor="email" className="font-bold text-black">{t("email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 bg-white border-gray-300"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" title="password" className="font-bold text-black">{t("password")}</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="mt-1 bg-white border-gray-300"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="
                            w-full mt-6
                            px-8 py-4
                            rounded-md
                            border-2 border-black
                            uppercase
                            bg-green-700 text-white
                            text-lg font-bold
                            transition-all duration-150
                            shadow-[4px_4px_0px_0px_rgba(0,0,0),8px_8px_0px_0px_rgba(0,0,0)]
                            hover:bg-green-600
                            active:translate-x-[4px]
                            active:translate-y-[4px]
                            active:shadow-none
                        "
                    >
                        {t("login")}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm font-medium text-gray-800">
                    Don&apos;t have an account?{" "}
                    <a
                        href="/signup"
                        className="text-green-700 font-black hover:underline underline-offset-4"
                    >
                        {t("signup")}
                    </a>
                </p>
            </div>
        </div>
    );
}
