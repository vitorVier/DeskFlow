"use client"

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CustomSelect } from "../select";
import type { SelectOption } from "../select";

export function StatusFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentStatus = searchParams.get("status") || "ABERTO";

    const options: SelectOption[] = [
        { value: "all", label: "Todos os chamados", color: "bg-slate-600" },
        { value: "ABERTO", label: "Abertos", color: "bg-blue-600" },
        { value: "EM ANDAMENTO", label: "Em Andamento", color: "bg-orange-500" },
        { value: "RESOLVIDO", label: "Resolvidos", color: "bg-emerald-600" },
    ];

    const handleSelect = useCallback((value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (value === "ABERTO") {
                params.delete("status");
            } else {
                params.set("status", value);
            }
            
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false
            });
        });
    }, [pathname, searchParams, router]);

    return (
        <CustomSelect 
            options={options} 
            currentValue={currentStatus} 
            onSelect={handleSelect} 
        />
    );
}