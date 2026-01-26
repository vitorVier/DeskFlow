"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CustomSelect } from "../select";
import { RxCalendar } from "react-icons/rx";

export type DateFilterValue = 'all' | 'today' | 'week' | 'month' | 'year';

export function DateFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const currentDate = searchParams.get("date") || "all";

    const options = [
        { value: "all", label: "Período Total" },
        { value: "today", label: "Hoje"},
        { value: "week", label: "Esta Semana"},
        { value: "month", label: "Este Mês"},
        { value: "year", label: "Este Ano"},
    ];

    const handleSelect = useCallback((value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
                
            if (value === "all") {
                params.delete("date");
            } else {
                params.set("date", value);
            }
            
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false
            });
        });
    }, [pathname, searchParams, router]);

    return (
        <CustomSelect 
            options={options} 
            currentValue={currentDate} 
            onSelect={handleSelect}
            icon={<RxCalendar size={22} className="text-blue-600" />}
        />
    );
}