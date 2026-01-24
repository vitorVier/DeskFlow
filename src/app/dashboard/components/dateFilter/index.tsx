"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CustomSelect, SelectOption } from "../select";

export type DateFilterValue = 'all' | 'today' | 'week' | 'month';

interface DateFilterProps {
    value: DateFilterValue;
    icon?: React.ReactNode;
    // onChange: (value: DateFilterValue) => void;
}

const options: SelectOption[] = [
    { value: "all", label: "Todo o período"},
    { value: "today", label: "Hoje"},
    { value: "week", label: "Essa semana"},
    { value: "month", label: "Esse mês"},
    { value: "year", label: "Esse ano"},
];

export function DateFilter({ value, /*onChange*/ icon }: DateFilterProps) {
    const searchParams = useSearchParams();
    const currentOption = searchParams.get("date") || "all";
    const router = useRouter();

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
            currentValue={currentOption} 
            onSelect={handleSelect}
            icon={icon}
        />
    );
}