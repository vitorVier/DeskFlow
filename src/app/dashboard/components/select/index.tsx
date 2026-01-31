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

export function CustomSelect({ options, currentValue, onSelect, icon, className = "w-full sm:w-48" }: CustomSelectProps) {
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
                className={`flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg h-10 shadow-sm hover:border-gray-300 transition-all cursor-pointer group focus:ring-2 focus:ring-blue-500/10 ${icon ? 'pl-9 pr-3' : 'px-3'}`}
            >
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                
                <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden mr-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${activeOption.color} animate-pulse`}></span>
                   
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-hide block w-full text-left">
                        {activeOption.label}
                    </span>
                </div>
                
                <FiChevronDown 
                    size={16} 
                    className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {options.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    flex items-center gap-2 w-full px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer
                                    ${currentValue === option.value 
                                        ? "bg-blue-50 text-blue-700" 
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${option.color}`}></span>
                                <span className="truncate text-left">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}