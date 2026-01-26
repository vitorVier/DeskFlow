"use client"
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface SearchInputProps {
    placeholder?: string;
}

export function SearchInput( { placeholder = "Buscar..." }: SearchInputProps ) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    const [value, setValue] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            router.push(`${pathname}?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [value, router, searchParams]);

    return (
        <div className="relative flex-1 sm:flex-none sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            />
        </div>
    );
}