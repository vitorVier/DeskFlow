"use client"

import { useEffect, useRef, useTransition } from 'react';
import { FaSearch } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface SearchInputProps {
    placeholder?: string;
}

export function SearchInput({ placeholder = "Buscar..." }: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    
    // Usar ref ao invés de state para evitar re-renders desnecessários
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>("" as unknown as NodeJS.Timeout);
    
    // Sincronizar input com URL quando a página carregar ou URL mudar externamente
    useEffect(() => {
        const currentSearch = searchParams.get("search") || "";
        if (inputRef.current && inputRef.current.value !== currentSearch) {
            inputRef.current.value = currentSearch;
        }
    }, [searchParams]);

    const handleSearch = (value: string) => {
        // Limpar timeout anterior para evitar múltiplas requisições
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Debounce
        timeoutRef.current = setTimeout(() => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString());
                
                if (value.trim()) {
                    params.set("search", value.trim());
                } else {
                    params.delete("search");
                }

                // Usar replace ao invés de push para não poluir o histórico
                router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false // Evitar scroll ao topo
                });
            });
        }, 500);
    };

    // Cleanup do timeout quando componente desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="relative flex-1 sm:flex-none sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
                ref={inputRef}
                type="text"
                defaultValue={searchParams.get("search") || ""}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            />
            
            {/* Indicador de loading opcional */}
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}