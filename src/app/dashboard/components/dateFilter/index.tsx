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
        { value: "all", label: "Período Total" },
        { value: "today", label: "Hoje"},
        { value: "week", label: "Esta Semana"},
        { value: "month", label: "Este Mês"},
        { value: "year", label: "Este Ano"},
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