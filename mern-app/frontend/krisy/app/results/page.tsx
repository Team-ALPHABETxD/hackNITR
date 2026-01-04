"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Wind, Thermometer, Droplets, Gauge, Sun, Globe, AlertTriangle, Lightbulb, Download, CheckCircle2, Sprout } from "lucide-react"
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
    Bar,
    BarChart,
    ResponsiveContainer,
    Cell
} from "recharts"
import Image from "next/image"
import { useLanguage } from "@/app/context/language-context"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/app/components/ui/chart"

// Example JSON Data provided by user
const exampleData = {
    "weather_details": {
        "summary": "Tomorrow and the next day will experience warm temperatures with highs around 37°C. Expect moderate winds with speeds of up to 20km/h. The UV index will be moderate at 6, so don't forget to apply sunscreen.",
        "forecasts": {
            "daily": {
                "time": ["2025-12-27", "2025-12-28", "2025-12-29", "2025-12-30", "2025-12-31", "2026-01-01", "2026-01-02"],
                "temperature_2m_max": [37.4, 37.4, 37.1, 37.4, 38.5, 38.5, 37.5],
                "wind_speed_10m_max": [14.6, 14.7, 19.1, 18.6, 19.3, 20.2, 21.4],
                "relative_humidity_2m_max": [59, 54, 56, 53, 51, 47, 45],
                "surface_pressure_mean": [972.0, 972.2, 973.4, 973.7, 973.3, 972.0, 972.6],
                "pressure_msl_mean": [1010.6, 1010.8, 1012.0, 1012.4, 1011.9, 1010.6, 1011.3],
                "apparent_temperature_max": [36.0, 35.8, 34.2, 34.6, 35.6, 35.0, 33.7],
                "uv_index_max": [5.65, 6.15, 6.2, 6.25, 6.25, 6.35, 5.9],
                "daylight_duration": [41260.59, 41265.94, 41272.12, 41279.12, 41286.95, 41295.59, 41305.06]
            }
        }
    },
    "predicted_yeild": 70544.9765625,
    "disease_details": {
        "NA": false,
        "name": "Late Blight",
        "reason": "Warm temperatures and high humidity",
        "status": "May occur in future",
        "spoilage_risk": "High",
        "days_to_spoil": 45,
        "confidence": 8.2
    },
    "rev_strat_details": {
        "rev_stats": [
            { "name": "Sell", "rev": 2400.0, "exp": 1200.0 },
            { "name": "Disease Control", "rev": 0.0, "exp": 800.0 },
            { "name": "Store", "rev": 0.0, "exp": 600.0 }
        ]
    },
    "plan": {
        "decision": "Sell",
        "reason": "The crop is currently in the flowering stage and the weather forecast for the next 7 days shows warm temperatures with highs around 37°C, which is suitable for the crop. Additionally, the disease analysis shows a low risk of disease occurrence. Therefore, it is recommended to sell the crop to maximize revenue."
    },
    "soil_details": {
        "is_soil": true,
        "N": 400,
        "P": 220,
        "K": 600,
        "pH": 6.8,
        "unit": "mg/kg",
        "confidence": 0.75,
        "notes": "The soil exhibits a very dark, rich color and fine texture, strongly indicating high organic matter content, which correlates with good nitrogen levels and overall soil fertility. The apparent moisture also suggests a healthy environment."
    }
}

export default function ResultsPage() {
    const { t } = useLanguage();
    const [analysisData, setAnalysisData] = React.useState<any>(exampleData);
    const [loading, setLoading] = React.useState(true);
    const reportRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const storedData = localStorage.getItem("cropAnalysisResult");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setAnalysisData(parsed);
                console.log("Loaded data from localStorage:", parsed);
            } catch (err) {
                console.error("Failed to parse stored data:", err);
            }
        }
        setLoading(false);
    }, []);

    // Format weather data inside component to ensure reactivity to language changes
    const weatherChartData = React.useMemo(() => {
        if (!analysisData?.weather_details?.forecasts?.daily) return [];
        return analysisData.weather_details.forecasts.daily.time.map((time: string, i: number) => ({
            date: new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            temp: analysisData.weather_details.forecasts.daily.temperature_2m_max[i],
            wind: analysisData.weather_details.forecasts.daily.wind_speed_10m_max[i],
            humidity: analysisData.weather_details.forecasts.daily.relative_humidity_2m_max[i],
            surface_pressure: analysisData.weather_details.forecasts.daily.surface_pressure_mean[i],
            msl_pressure: analysisData.weather_details.forecasts.daily.pressure_msl_mean[i],
            apparent_temp: analysisData.weather_details.forecasts.daily.apparent_temperature_max[i],
            uv: analysisData.weather_details.forecasts.daily.uv_index_max[i],
            daylight: analysisData.weather_details.forecasts.daily.daylight_duration[i],
        }));
    }, [analysisData, t]);

    // Config for Graph 1: Essentials
    const essentialsConfig = {
        temp: { label: t("maxTemp"), color: "#ef4444" },
        wind: { label: t("windSpeed"), color: "#3b82f6" },
        humidity: { label: t("humidityPercent"), color: "#22c55e" },
        apparent_temp: { label: t("apparentTemp"), color: "#ec4899" },
        uv: { label: t("uvIndex"), color: "#eab308" },
    } satisfies ChartConfig

    // Config for Graph 2: Pressure
    const pressureConfig = {
        surface_pressure: { label: t("surfacePressure"), color: "#f59e0b" },
        msl_pressure: { label: t("mslPressure"), color: "#8b5cf6" },
    } satisfies ChartConfig

    // Config for Graph 3: Daylight
    const daylightConfig = {
        daylight: { label: t("daylight"), color: "#06b6d4" },
    } satisfies ChartConfig

    const revChartConfig = {
        rev: { label: "Revenue", color: "#22c55e" },
        exp: { label: "Expense", color: "#ef4444" },
    } satisfies ChartConfig

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        try {
            // Scroll to top to ensure clean capture
            window.scrollTo(0, 0);

            // Wait a small moment for charts to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: true, // Enable logging for debugging
                backgroundColor: "#ffffff",
                windowWidth: reportRef.current.scrollWidth,
                windowHeight: reportRef.current.scrollHeight
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;

            let finalImageWidth = pdfWidth;
            let finalImageHeight = pdfWidth / ratio;

            // If image is taller than page, we might need multiple pages or scale down
            // For now, let's scale to fit width and add one page
            pdf.addImage(imgData, 'JPEG', 0, 0, finalImageWidth, finalImageHeight);
            pdf.save(`Krisy_Report_${new Date().toLocaleDateString()}.pdf`);

        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert("Could not generate PDF. Please try again.");
        }
    };

    // Map business names to translation keys
    const getStrategyLabel = (name: string) => {
        if (name === "Sell") return t("sell");
        if (name === "Store") return t("store");
        if (name === "Disease Control") return t("diseaseControl");
        return name;
    }

    // Format revenue stats for bar chart with translated names
    const revChartData = React.useMemo(() => {
        if (!analysisData?.rev_strat_details?.rev_stats) return [];
        return analysisData.rev_strat_details.rev_stats.map((stat: any) => ({
            name: getStrategyLabel(stat.name),
            rev: stat.rev,
            exp: stat.exp,
        }));
    }, [analysisData, t]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-black font-bold">Loading analysis...</div>;
    }

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
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-6xl space-y-8"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-[#008000] uppercase tracking-tight drop-shadow-sm">
                            {t("analysisHeading")}
                        </h1>
                        <p className="text-black font-bold mt-2 text-lg">
                            {t("analysisSubheading")}
                        </p>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        {t("downloadReport")}
                    </button>
                </div>

                <div ref={reportRef} className="p-4 bg-transparent space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Verdict / Plan Section */}
                        <Card className="lg:col-span-2 border-4 border-black hover:shadow-[12px_12px_0px_0px_rgba(0,0,0)] transition-all bg-white relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-green-700/10">
                                <CheckCircle2 className="w-32 h-32" />
                            </div>
                            <CardHeader className="bg-green-50 border-b-2 border-black rounded-t-xl relative z-10">
                                <CardTitle className="flex items-center gap-3 text-green-800">
                                    <Lightbulb className="w-8 h-8" />
                                    {t("finalVerdict")}: {getStrategyLabel(analysisData?.plan?.decision || "Sell")}

                                </CardTitle>
                                <CardDescription className="text-green-900 font-bold">
                                    Comprehensive action plan for your crop
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 relative z-10">
                                <p className="text-lg md:text-xl font-black leading-relaxed text-gray-900 italic">
                                    "{analysisData?.plan?.reason || ""}"
                                </p>

                                {/* Disease Warning Space */}
                                {analysisData?.disease_details && !analysisData.disease_details.NA && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="mt-6 p-6 rounded-xl border-2 border-black bg-red-50 space-y-3 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]"
                                    >
                                        <div className="flex items-center gap-2 text-red-700 font-black uppercase">
                                            <AlertTriangle className="w-6 h-6" />
                                            {t("potentialThreat")}: {analysisData?.disease_details?.name || t("lateBlight")}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-700">
                                            <div>{t("riskLevel")}: <span className="text-red-600 uppercase">{analysisData?.disease_details?.spoilage_risk || t("high")}</span></div>
                                            <div>{t("confidence")}: {analysisData?.disease_details?.confidence ? Math.round(analysisData.disease_details.confidence * 10) : 0}%</div>
                                            <div className="col-span-2 mt-2 pt-2 border-t border-red-200">
                                                <p className="text-black mb-2 uppercase text-xs font-black">{t("recoverySteps")}:</p>
                                                <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium">
                                                    <li>{t("step1")}</li>
                                                    <li>{t("step2")}</li>
                                                    <li>{t("step3")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Yield Highlight */}
                        <Card className="bg-green-700 border-4 border-black text-white flex flex-col justify-center items-center p-8 text-center space-y-4 shadow-[12px_12px_0px_0px_rgba(0,0,0)]">
                            <Globe className="w-16 h-16 text-yellow-400 rotate-12" />
                            <CardTitle className="text-2xl text-white font-black uppercase tracking-widest">{t("predictedYield")}</CardTitle>
                            <div className="text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                                {analysisData?.predicted_yeild?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 0}
                            </div>
                            <div className="text-xl font-black uppercase tracking-widest text-[#eef6df] bg-green-800 px-4 py-1 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] mt-2">
                                HG / HA
                            </div>
                            <p className="text-xs font-bold opacity-80 pt-6 border-t border-green-600/50 uppercase tracking-tighter mt-4">
                                Estimations based on current sowing date and environmental trends.
                            </p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Graph 1 - Weather Essentials */}
                        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-white h-fit">
                            <CardHeader className="bg-red-50 border-b-2 border-black rounded-t-xl">
                                <CardTitle className="flex items-center gap-2">
                                    <Thermometer className="w-5 h-5 text-red-600" />
                                    {t("weatherTrends")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ChartContainer config={essentialsConfig} className="h-[250px] w-full">
                                    <LineChart data={weatherChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                            tickLine={false}
                                            tick={{ fill: "#000", fontWeight: "900", fontSize: 10 }}
                                        />
                                        <YAxis hide />
                                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                        {Object.keys(essentialsConfig).map((key) => (
                                            <Line
                                                key={key}
                                                type="basis"
                                                dataKey={key}
                                                stroke={(essentialsConfig as any)[key].color}
                                                strokeWidth={4}
                                                dot={false}
                                                activeDot={{ r: 6, stroke: "#000", strokeWidth: 2 }}
                                            />
                                        ))}
                                        <ChartLegend content={<ChartLegendContent />} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Graph 2 - Pressure */}
                        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-white h-fit">
                            <CardHeader className="bg-purple-50 border-b-2 border-black rounded-t-xl">
                                <CardTitle className="flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-purple-600" />
                                    {t("mslPressure")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ChartContainer config={pressureConfig} className="h-[250px] w-full">
                                    <LineChart data={weatherChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                            tickLine={false}
                                            tick={{ fill: "#000", fontWeight: "900", fontSize: 10 }}
                                        />
                                        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                        {Object.keys(pressureConfig).map((key) => (
                                            <Line
                                                key={key}
                                                type="basis"
                                                dataKey={key}
                                                stroke={(pressureConfig as any)[key].color}
                                                strokeWidth={4}
                                                dot={false}
                                                activeDot={{ r: 6, stroke: "#000", strokeWidth: 2 }}
                                            />
                                        ))}
                                        <ChartLegend content={<ChartLegendContent />} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Graph 3 - Daylight */}
                        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-white h-fit">
                            <CardHeader className="bg-cyan-50 border-b-2 border-black rounded-t-xl">
                                <CardTitle className="flex items-center gap-2">
                                    <Sun className="w-5 h-5 text-cyan-600" />
                                    {t("daylight")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ChartContainer config={daylightConfig} className="h-[250px] w-full">
                                    <LineChart data={weatherChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                            tickLine={false}
                                            tick={{ fill: "#000", fontWeight: "900", fontSize: 10 }}
                                        />
                                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                        <Line
                                            type="basis"
                                            dataKey="daylight"
                                            stroke={daylightConfig.daylight.color}
                                            strokeWidth={4}
                                            dot={false}
                                            activeDot={{ r: 6, stroke: "#000", strokeWidth: 2 }}
                                        />
                                        <ChartLegend content={<ChartLegendContent />} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Full Width Revenue Strategy Comparison */}
                    <Card className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0)] bg-white w-full">
                        <CardHeader className="bg-yellow-50 border-b-2 border-black rounded-t-xl">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-yellow-600" />
                                {t("revStrategy")}
                            </CardTitle>
                            <CardDescription className="text-yellow-900 font-bold uppercase text-xs">Financial breakdown per decision path</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ChartContainer config={revChartConfig} className="h-[400px] w-full">
                                <BarChart data={revChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                        tickLine={false}
                                        tick={{ fill: "#000", fontWeight: "900", fontSize: 12 }}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                                    <Bar dataKey="rev" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2}>
                                        {revChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-rev-${index}`}
                                                fill={entry.rev >= entry.exp ? "#22c55e" : "#ef4444"}
                                            />
                                        ))}
                                    </Bar>
                                    <Bar dataKey="exp" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2}>
                                        {revChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-exp-${index}`}
                                                fill={entry.exp > entry.rev ? "#22c55e" : "#ef4444"}
                                            />
                                        ))}
                                    </Bar>
                                    <ChartLegend content={<ChartLegendContent />} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="bg-black text-[10px] font-black text-white uppercase rounded-b-lg py-2 flex justify-center">
                            The higher bar in each category is highlighted in Green.
                        </CardFooter>
                    </Card>

                    {/* Soil Status Section */}
                    {analysisData.soil_details && (
                        <Card className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0)] bg-white w-full overflow-hidden">
                            <CardHeader className="bg-[#8B4513]/10 border-b-2 border-black rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                                    <Sprout className="w-6 h-6" />
                                    {t("soilStatus")}
                                </CardTitle>
                                <CardDescription className="text-[#8B4513] font-bold uppercase text-xs">Nutrient analysis and soil health indicators</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="p-6 border-2 border-black bg-blue-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0)] flex flex-col items-center justify-center space-y-2">
                                        <span className="text-sm font-black text-blue-800 uppercase tracking-widest">Nitrogen (N)</span>
                                        <span className="text-4xl font-black text-black">{analysisData?.soil_details?.N || 0}</span>
                                        <span className="text-xs font-bold text-blue-600">{analysisData?.soil_details?.unit}</span>
                                    </div>
                                    <div className="p-6 border-2 border-black bg-red-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0)] flex flex-col items-center justify-center space-y-2">
                                        <span className="text-sm font-black text-red-800 uppercase tracking-widest">Phosphorus (P)</span>
                                        <span className="text-4xl font-black text-black">{analysisData?.soil_details?.P || 0}</span>
                                        <span className="text-xs font-bold text-red-600">{analysisData?.soil_details?.unit}</span>
                                    </div>
                                    <div className="p-6 border-2 border-black bg-purple-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0)] flex flex-col items-center justify-center space-y-2">
                                        <span className="text-sm font-black text-purple-800 uppercase tracking-widest">Potassium (K)</span>
                                        <span className="text-4xl font-black text-black">{analysisData?.soil_details?.K || 0}</span>
                                        <span className="text-xs font-bold text-purple-600">{analysisData?.soil_details?.unit}</span>
                                    </div>
                                    <div className="p-6 border-2 border-black bg-green-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0)] flex flex-col items-center justify-center space-y-2">
                                        <span className="text-sm font-black text-green-800 uppercase tracking-widest">pH Level</span>
                                        <span className="text-4xl font-black text-black">{analysisData?.soil_details?.pH || 0}</span>
                                        <span className="text-xs font-bold text-green-600">Acidity Ratio</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 border-2 border-black bg-orange-50 rounded-xl">
                                    <h4 className="flex items-center gap-2 text-orange-900 font-black uppercase text-sm mb-3">
                                        <Lightbulb className="w-5 h-5" />
                                        Expert Soil Notes
                                    </h4>
                                    <p className="text-gray-900 font-bold italic leading-relaxed">
                                        "{analysisData?.soil_details?.notes || ""}"
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="text-[10px] font-black uppercase bg-orange-200 px-2 py-1 rounded border border-orange-300">
                                            Analysis Confidence: {analysisData?.soil_details?.confidence ? Math.round(analysisData.soil_details.confidence * 100) : 0}%
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </motion.div>
        </div>
    )
}