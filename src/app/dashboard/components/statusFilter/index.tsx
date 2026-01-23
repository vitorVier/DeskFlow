"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

export function StatusFilter() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentStatus = searchParams.get("status") || "TODOS";

    const options = [
        { value: "TODOS", label: "Todos os chamados", color: "bg-blue-500" },
        { value: "ABERTO", label: "Abertos", color: "bg-green-500" },
        { value: "FECHADO", label: "Fechados", color: "bg-red-500" },
    ];

    const activeOption = options.find(opt => opt.value === currentStatus) || options[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "TODOS") {
            params.delete("status");
        } else {
            params.set("status", value);
        }
        router.push(`/dashboard?${params.toString()}`);
        setIsOpen(false);
    }

    return (
        <div className="relative w-full sm:w-56" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 h-11 shadow-sm hover:border-gray-300 transition-all cursor-pointer group focus:ring-4 focus:ring-blue-500/10"
            >
                <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeOption.color} animate-pulse`}></span>
                    <span className="text-sm font-bold text-gray-700">{activeOption.label}</span>
                </div>
                <FiChevronDown 
                    size={18} 
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer
                                    ${currentStatus === option.value 
                                        ? "bg-blue-50 text-blue-700" 
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                <span className={`w-2 h-2 rounded-full ${option.color}`}></span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}