"use client";

import { useState, useRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import { useLanguage } from "@/app/context/language-context";
import {
    Sprout,
    CloudRain,
    Bug,
    Thermometer,
    MapPin,
    Calendar,
    Camera,
    Upload,
    AlertCircle,
    CheckCircle2,
    CalendarDays
} from "lucide-react";

export default function ReportPage() {
    const { t } = useLanguage();
    /* -------------------- STATE -------------------- */
    const [crop, setCrop] = useState("Potatoes");
    const [growth, setGrowth] = useState("seedling");
    const [sowingDate, setSowingDate] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    const [rainfall, setRainfall] = useState("");
    const [pesticides, setPesticides] = useState("");
    const [temperature, setTemperature] = useState("");

    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");

    const [detectDisease, setDetectDisease] = useState(false);
    const [cropImg, setCropImg] = useState<File | null>(null);

    const [detectSoil, setDetectSoil] = useState(false);
    const [soilImg, setSoilImg] = useState<File | null>(null);

    const [detecting, setDetecting] = useState(false);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const soilFileInputRef = useRef<HTMLInputElement>(null);
    const soilCameraInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            Item: crop,
            average_rain_fall_mm_per_year: Number(rainfall),
            pesticides_tonnes: Number(pesticides),
            avg_temp: Number(temperature),
            lat: Number(lat),
            lon: Number(lon),
            growth,
            sowing_date: sowingDate,
            current_date: currentDate,
            storage_availability: "No",
            disease_detect: detectDisease,
            crop_img: cropImg ? cropImg.name : "graph.png", // Fallback as in backend example
            soil_img: soilImg ? soilImg.name : "https://www.eurokidsindia.com/blog/wp-content/uploads/2023/11/different-types-of-soils-and-their-charachterstics-870x570.jpg"
        };

        try {
            setLoading(true);

            const res = await fetch("http://127.0.0.1:5000/analyse/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to generate report");

            const data = await res.json();
            console.log("REPORT RESPONSE:", data);

            // Save to localStorage so results page can pick it up
            localStorage.setItem("cropAnalysisResult", JSON.stringify(data.result));

            // Redirect to results page
            window.location.href = "/results";

        } catch (err) {
            console.error("REPORT ERROR:", err);
            alert("Error generating report. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude.toFixed(5));
                setLon(pos.coords.longitude.toFixed(5));
                setDetecting(false);
            },
            () => {
                alert("Unable to detect location");
                setDetecting(false);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center px-4 pt-40 pb-20">
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

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white/90 p-8 md:p-12 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">

                {/* Heading Section */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-[#008000] mb-3 flex items-center gap-3">
                        <CheckCircle2 className="w-10 h-10" />
                        {t("knowCropHealth")}
                    </h1>
                    <p className="text-black font-medium max-w-2xl">
                        Provide accurate crop and environmental details to generate precise
                        recommendations and reports.
                    </p>
                </div>

                {/* FORM GRID */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                    {/* LEFT COLUMN */}
                    <div className="space-y-6">
                        {/* Crop Name */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <Sprout className="w-4 h-4 text-green-600" />
                                {t("cropName")}
                            </Label>
                            <select
                                name="Item"
                                id="Item"
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                                className="mt-1 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2.5 text-sm text-black font-medium focus:border-black focus:ring-0 transition-all outline-none"
                            >
                                {[
                                    "Potatoes",
                                    "Plantains and others",
                                    "Sweet potatoes",
                                    "Cassava",
                                    "Yams",
                                    "Maize",
                                    "Sorghum",
                                    "Rice, paddy",
                                    "Wheat",
                                    "Soybeans",
                                ].map((crop) => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                        </div>

                        {/* Growth Stage */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <Sprout className="w-4 h-4 text-green-600 rotate-45" />
                                {t("growthStage")}
                            </Label>
                            <select
                                name="growth"
                                id="growth"
                                value={growth}
                                onChange={(e) => setGrowth(e.target.value)}
                                className="mt-1 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2.5 text-sm text-black font-medium focus:border-black focus:ring-0 transition-all outline-none"
                            >
                                <option>Seedling</option>
                                <option>Vegetative</option>
                                <option>Flowering</option>
                                <option>Fruiting</option>
                                <option>Harvest</option>
                            </select>
                        </div>

                        {/* Sowing Date */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                {t("sowingDate")}
                            </Label>
                            <Input
                                type="date"
                                name="sowing_date"
                                id="sowing_date"
                                value={sowingDate}
                                onChange={(e) => setSowingDate(e.target.value)}
                                className="mt-1 bg-white border-2 border-gray-200 text-black font-medium"
                            />
                        </div>

                        {/* Current Date */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-green-600" />
                                {t("currentDate")}
                            </Label>
                            <Input
                                type="date"
                                name="current_date"
                                id="current_date"
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
                                className="mt-1 bg-white border-2 border-gray-200 text-black font-medium"
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        {/* Rainfall */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <CloudRain className="w-4 h-4 text-blue-500" />
                                {t("rainfall")}
                            </Label>
                            <Input
                                type="number"
                                name="average_rain_fall_mm_per_year"
                                id="rainfall"
                                value={rainfall}
                                onChange={(e) => setRainfall(e.target.value)}
                                placeholder="e.g. 1485"
                                className="mt-1 bg-white border-2 border-gray-200 text-black font-medium"
                            />
                        </div>

                        {/* Pesticides */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <Bug className="w-4 h-4 text-red-500" />
                                {t("pesticides")}
                            </Label>
                            <Input
                                type="number"
                                name="pesticides_tonnes"
                                id="pesticides"
                                value={pesticides}
                                onChange={(e) => setPesticides(e.target.value)}
                                placeholder="e.g. 121"
                                className="mt-1 bg-white border-2 border-gray-200 text-black font-medium"
                            />
                        </div>

                        {/* Temperature */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-orange-500" />
                                {t("temperature")}
                            </Label>
                            <Input
                                type="number"
                                name="avg_temp"
                                id="avg_temp"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                                placeholder="e.g. 16.37"
                                className="mt-1 bg-white border-2 border-gray-200 text-black font-medium"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <Label className="text-black font-bold mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-600" />
                                {t("location")}
                            </Label>
                            <div className="mt-1 flex gap-2">
                                <Input
                                    placeholder="Latitude"
                                    value={lat}
                                    name="lat"
                                    id="lat"
                                    readOnly
                                    className="bg-gray-50 border-2 border-gray-200 text-black font-mono"
                                />
                                <Input
                                    placeholder="Longitude"
                                    value={lon}
                                    name="lon"
                                    id="lon"
                                    readOnly
                                    className="bg-gray-50 border-2 border-gray-200 text-black font-mono"
                                />
                                <button
                                    type="button"
                                    id="detect_location_btn"
                                    onClick={detectLocation}
                                    className="px-6 rounded-md bg-black text-white text-xs font-bold uppercase hover:bg-gray-800 transition-all active:scale-95"
                                >
                                    {detecting ? "..." : t("detect")}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FULL WIDTH — ANALYSIS BUTTONS SECTION */}
                    <div className="md:col-span-2 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Disease Detect Button */}
                        <div>
                            <button
                                type="button"
                                id="detect_disease_btn"
                                onClick={() => setDetectDisease(!detectDisease)}
                                className={`w-full py-3 rounded-xl border-2 border-black font-bold uppercase flex items-center justify-center gap-3 transition-all ${detectDisease
                                    ? "bg-red-500 text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                    : "bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:bg-yellow-300"
                                    }`}
                            >
                                {detectDisease ? <AlertCircle /> : <Bug />}
                                {t("detectDisease")}
                            </button>

                            {detectDisease && (
                                <div className="mt-4 border-2 border-dashed border-gray-400 rounded-2xl p-6 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-gray-800 font-bold mb-4 text-sm">Crop disease image</p>
                                        <div className="flex gap-4 flex-wrap justify-center w-full">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:bg-gray-50 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none min-w-[120px]"
                                            >
                                                <Upload className="w-6 h-6 text-blue-600" />
                                                <span className="font-bold uppercase text-[10px]">Gallery</span>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => setCropImg(e.target.files?.[0] || null)}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => cameraInputRef.current?.click()}
                                                className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:bg-gray-50 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none min-w-[120px]"
                                            >
                                                <Camera className="w-6 h-6 text-green-600" />
                                                <span className="font-bold uppercase text-[10px]">Camera</span>
                                                <input
                                                    type="file"
                                                    ref={cameraInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={(e) => setCropImg(e.target.files?.[0] || null)}
                                                />
                                            </button>
                                        </div>
                                        {cropImg && (
                                            <p className="mt-3 text-[10px] font-black text-green-700 bg-green-100 px-2 py-1 rounded">
                                                SELECTED: {cropImg.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Soil Analysis Button */}
                        <div>
                            <button
                                type="button"
                                id="detect_soil_btn"
                                onClick={() => setDetectSoil(!detectSoil)}
                                className={`w-full py-3 rounded-xl border-2 border-black font-bold uppercase flex items-center justify-center gap-3 transition-all ${detectSoil
                                    ? "bg-[#8B4513] text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                    : "bg-[#D2B48C] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:bg-[#C2A47C]"
                                    }`}
                            >
                                {detectSoil ? <CheckCircle2 className="w-5 h-5" /> : <Sprout className="w-5 h-5" />}
                                Add Soil Image
                            </button>

                            {detectSoil && (
                                <div className="mt-4 border-2 border-dashed border-gray-400 rounded-2xl p-6 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-gray-800 font-bold mb-4 text-sm">Clear soil image</p>
                                        <div className="flex gap-4 flex-wrap justify-center w-full">
                                            <button
                                                type="button"
                                                onClick={() => soilFileInputRef.current?.click()}
                                                className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:bg-gray-50 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none min-w-[120px]"
                                            >
                                                <Upload className="w-6 h-6 text-blue-600" />
                                                <span className="font-bold uppercase text-[10px]">Gallery</span>
                                                <input
                                                    type="file"
                                                    ref={soilFileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => setSoilImg(e.target.files?.[0] || null)}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => soilCameraInputRef.current?.click()}
                                                className="flex flex-col items-center gap-2 p-4 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:bg-gray-50 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none min-w-[120px]"
                                            >
                                                <Camera className="w-6 h-6 text-green-600" />
                                                <span className="font-bold uppercase text-[10px]">Camera</span>
                                                <input
                                                    type="file"
                                                    ref={soilCameraInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={(e) => setSoilImg(e.target.files?.[0] || null)}
                                                />
                                            </button>
                                        </div>
                                        {soilImg && (
                                            <p className="mt-3 text-[10px] font-black text-green-700 bg-green-100 px-2 py-1 rounded">
                                                SELECTED: {soilImg.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="md:col-span-2 mt-12 flex justify-center">
                        <button
                            type="submit"
                            id="generate_report_btn"
                            className="
                px-12 py-4
                rounded-xl
                border-2 border-black
                uppercase
                bg-green-700 text-white
                text-lg font-black
                transition-all duration-150
                shadow-[4px_4px_0px_0px_rgba(0,0,0),8px_8px_0px_0px_rgba(0,0,0)]
                hover:bg-green-600
                active:translate-x-[4px]
                active:translate-y-[4px]
                active:shadow-none
              "
                        >
                            {loading ? "Generating..." : t("generateReport")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
