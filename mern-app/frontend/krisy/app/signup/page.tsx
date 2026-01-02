"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import { useLanguage } from "@/app/context/language-context";

export default function SignupPage() {
    const { t } = useLanguage();
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleDetectLocation = async () => {
        setLoadingLocation(true);
        try {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Reverse geocoding using OpenStreetMap Nominatim API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    const address = data.display_name || `${latitude}, ${longitude}`;
                    setLocation(address);
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to fetch location. Please enter manually.");
                    setLoadingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } catch (error) {
            console.error("Error:", error);
            setLoadingLocation(false);
        }
    };

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
            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0),8px_8px_0px_0px_rgba(0,0,0)]">

                {/* Heading */}
                <h2 className="text-2xl font-black text-center text-[#008000] uppercase tracking-tight">
                    {t("signup")}
                </h2>

                {/* Role Selector */}
                <div className="mt-8">
                    <Label htmlFor="role" className="font-bold text-black border-2 border-transparent">Choose your role</Label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="
              mt-1 w-full rounded-md border-2 border-gray-200
              bg-white px-3 py-2.5 text-sm text-black font-medium
              focus:border-black focus:ring-0 transition-all outline-none
            "
                    >
                        <option value="">Select Your role</option>
                        <option value="farmer">🧑🏻‍🌾 Farmer</option>
                        <option value="ngo">🌎 NGO</option>
                    </select>
                </div>

                {/* Dynamic Form */}
                {role && (
                    <form className="mt-6 space-y-5 transition-all duration-300">

                        {/* Common Fields */}
                        <div>
                            <Label htmlFor="name" className="font-bold text-black">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="mt-1 bg-white border-gray-300"
                            />
                        </div>

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
                                placeholder="Create a password"
                                className="mt-1 bg-white border-gray-300"
                            />
                        </div>

                        {/* NGO-only Fields */}
                        {role === "ngo" && (
                            <>
                                <div>
                                    <Label htmlFor="address" className="font-bold text-black">Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        placeholder="Organization address"
                                        className="mt-1 bg-white border-gray-300"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location" className="font-bold text-black">{t("location")}</Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            id="location"
                                            type="text"
                                            placeholder="Auto-detected location"
                                            className="bg-white flex-1 border-gray-300"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            disabled={loadingLocation}
                                            className="
                                                px-4 py-2 rounded-md
                                                bg-black text-white font-bold text-xs uppercase
                                                hover:bg-gray-800 transition
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                flex items-center gap-2 whitespace-nowrap
                                            "
                                        >
                                            {loadingLocation ? "..." : t("detect")}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="contact" className="font-bold text-black">Contact Number</Label>
                                    <Input
                                        id="contact"
                                        type="tel"
                                        placeholder="Phone number"
                                        className="mt-1 bg-white border-gray-300"
                                    />
                                </div>
                            </>
                        )}

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
                            {t("signup")}
                        </button>
                    </form>
                )}

                {/* Footer */}
                <p className="mt-8 text-center text-sm font-medium text-gray-800">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-green-700 font-black hover:underline underline-offset-4"
                    >
                        {t("login")}
                    </a>
                </p>
            </div>
        </div>
    );
}
