"use client";

import { useSearchParams } from "next/navigation";
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

function handleSelect(value: string) {
    // onChange(value as DateFilterValue);
}

export function DateFilter({ value, /*onChange*/ icon }: DateFilterProps) {
    const searchParams = useSearchParams();
    const currentOption = searchParams.get("date") || "all";

    return (
        <CustomSelect 
            options={options} 
            currentValue={value} 
            onSelect={handleSelect}
            icon={icon}
        />
    );
}