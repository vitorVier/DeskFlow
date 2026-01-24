"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CustomSelect, SelectOption } from "../select";
import { RxCalendar } from "react-icons/rx";

export type DateFilterValue = 'all' | 'today' | 'week' | 'month' | 'year';

export function DateFilter() {
    const searchParams = useSearchParams();
    const currentDate = searchParams.get("date") || "all";
    const router = useRouter();

    const options = [
        { value: "all", label: "Período Total", color: "bg-gray-400" },
        { value: "today", label: "Hoje", color: "bg-blue-500" },
        { value: "week", label: "Esta Semana", color: "bg-purple-500" },
        { value: "month", label: "Este Mês", color: "bg-orange-500" },
        { value: "year", label: "Este Ano", color: "bg-yellow-500" },
    ];

    function handleSelect(value: string) {
        const params = new URLSearchParams(searchParams.toString());
            
        if (value === "all") {
            params.delete("date");
        } else {
            params.set("date", value);
        }
        
        router.push(`/dashboard?${params.toString()}`);
    }

    return (
        <CustomSelect 
            options={options} 
            currentValue={currentDate} 
            onSelect={handleSelect}
            icon={<RxCalendar size={22} className="text-blue-600" />}
        />
    );
}