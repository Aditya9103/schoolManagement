import React, { useState } from 'react';
import { MapPin, Globe2, Building2, School, ChevronDown, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CITIES = [
    { name: 'Noida (NCR)', state: 'Uttar Pradesh', school: 'Greenwood International School', students: '1,245', status: 'Active', x: '45%', y: '32%', isHero: true },
    { name: 'Delhi', state: 'Delhi', school: 'Maple Leaf School', students: '2,100', status: 'Active', x: '42%', y: '30%' },
    { name: 'Jaipur', state: 'Rajasthan', school: 'Sunrise Public School', students: '980', status: 'Active', x: '35%', y: '36%' },
    { name: 'Mumbai', state: 'Maharashtra', school: 'Heritage School', students: '2,300', status: 'Active', x: '29%', y: '58%' },
    { name: 'Pune', state: 'Maharashtra', school: 'Bright Minds Academy', students: '780', status: 'Active', x: '33%', y: '61%' },
    { name: 'Bengaluru', state: 'Karnataka', school: 'Riverdale School', students: '1,560', status: 'Active', x: '42%', y: '78%' },
    { name: 'Hyderabad', state: 'Telangana', school: 'ST Josephs Academy', students: '1,890', status: 'Active', x: '47%', y: '63%' },
    { name: 'Chennai', state: 'Tamil Nadu', school: 'Modern Academy', students: '1,420', status: 'Active', x: '49%', y: '80%' },
];

export default function SchoolsMapIndia() {
    const navigate = useNavigate();
    const [selectedPin, setSelectedPin] = useState(CITIES[0]);

    return (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Header matching Image 1 */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">Schools Across Locations</h3>
                    <p className="text-[11px] text-slate-700 font-semibold font-medium">Pan India presence</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer">
                        <span>India</span>
                        <ChevronDown size={12} className="text-slate-600 font-medium" />
                    </div>
                    <button className="p-1 rounded-lg border border-slate-200 text-slate-600 font-medium hover:text-slate-700">
                        <Maximize2 size={13} />
                    </button>
                </div>
            </div>

            {/* Map & Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1">
                {/* Left Side: Summary Badges */}
                <div className="md:col-span-4 space-y-2.5">
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                        <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                            <School size={15} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900">156</p>
                            <p className="text-[10px] text-slate-700 font-semibold font-medium">Total Schools</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                        <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                            <Globe2 size={15} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900">4</p>
                            <p className="text-[10px] text-slate-700 font-semibold font-medium">Countries</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                        <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                            <Building2 size={15} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900">18</p>
                            <p className="text-[10px] text-slate-700 font-semibold font-medium">States (India)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                        <div className="h-8 w-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                            <MapPin size={15} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900">92</p>
                            <p className="text-[10px] text-slate-700 font-semibold font-medium">Cities</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual Map with Interactive Pins */}
                <div className="md:col-span-8 relative h-72 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 border border-slate-100 flex items-center justify-center overflow-hidden">
                    {/* SVG India Map Silhouette */}
                    <svg
                        viewBox="0 0 400 450"
                        className="w-full h-full max-h-64 object-contain text-blue-200/50"
                        fill="currentColor"
                        stroke="#93C5FD"
                        strokeWidth="1.2"
                    >
                        {/* Stylized geometric polygon representing India geography */}
                        <path d="M 180,30 L 210,50 L 225,80 L 250,90 L 230,120 L 270,135 L 320,130 L 350,150 L 340,180 L 290,195 L 260,180 L 240,210 L 250,260 L 230,310 L 200,360 L 190,410 L 180,370 L 150,310 L 140,270 L 130,220 L 110,210 L 90,180 L 120,150 L 140,110 L 170,80 Z" />
                    </svg>

                    {/* City Pins */}
                    {CITIES.map((city) => {
                        const isSelected = selectedPin?.name === city.name;
                        return (
                            <div
                                key={city.name}
                                onClick={() => setSelectedPin(city)}
                                className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
                                style={{ left: city.x, top: city.y }}
                            >
                                <div className="relative">
                                    <div
                                        className={`h-3 w-3 rounded-full border-2 border-white shadow-md transition-transform ${
                                            isSelected
                                                ? 'bg-blue-600 scale-150 ring-4 ring-blue-400/40'
                                                : 'bg-blue-500 hover:scale-125'
                                        }`}
                                    />
                                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 whitespace-nowrap bg-white/90 px-1 py-0.2 rounded shadow-2xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                        {city.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Active Tooltip matching Image 1: Greenwood International School */}
                    {selectedPin && (
                        <div
                            className="absolute z-20 bg-white rounded-2xl p-3 shadow-xl border border-blue-200/80 max-w-[200px] text-left animate-in fade-in zoom-in-95 duration-150"
                            style={{
                                left: `calc(${selectedPin.x} + 12px)`,
                                top: `calc(${selectedPin.y} - 30px)`,
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="h-5 w-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[9px]">
                                    GIS
                                </div>
                                <h4 className="text-[11px] font-bold text-slate-900 leading-tight truncate">
                                    {selectedPin.school}
                                </h4>
                            </div>
                            <p className="text-[9px] text-slate-700 font-semibold">
                                {selectedPin.name}, {selectedPin.state}
                            </p>
                            <div className="mt-1.5 flex items-center justify-between text-[9px]">
                                <span className="font-semibold text-slate-700">
                                    {selectedPin.students} Students
                                </span>
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    {selectedPin.status}
                                </span>
                            </div>
                            <button
                                onClick={() => navigate('/super-admin/schools')}
                                className="mt-2 text-[9px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                            >
                                View Details →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Legend matching Image 1 */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-[10px] font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Active School</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Upcoming</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>Inactive</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>New This Month</span>
                </div>
            </div>
        </div>
    );
}
