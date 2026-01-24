"use client"

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface SelectOption {
    value: string;
    label: string;
    color?: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    currentValue: string;
    onSelect: (value: string) => void;
    className?: string;
    icon?: React.ReactNode;
}

export function CustomSelect({ options, currentValue, onSelect, icon, className = "w-full sm:w-56" }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeOption = options.find(opt => opt.value === currentValue) || options[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 h-11 shadow-sm hover:border-gray-300 transition-all cursor-pointer group focus:ring-4 focus:ring-blue-500/10 ${icon ? 'pl-6.5' : 'pl-4'}`}
            >
                {icon && (
                    <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                        {icon}
                    </div>
                )}
                
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
                                type="button"
                                key={option.value}
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer
                                    ${currentValue === option.value 
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