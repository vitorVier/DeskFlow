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

    const currentStatus = searchParams.get("status") || "TODOS";

    const options: SelectOption[] = [
        { value: "TODOS", label: "Todos os chamados", color: "bg-blue-500" },
        { value: "ABERTO", label: "Abertos", color: "bg-green-500" },
        { value: "FECHADO", label: "Fechados", color: "bg-red-500" },
    ];

    const handleSelect = useCallback((value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (value === "TODOS") {
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