"use client"
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
    // onSearch: (value: string) => void;
    placeholder?: string;
}

export function SearchInput({ placeholder = 'Buscar tickets...' }: SearchInputProps) {
    const [value, setValue] = useState('');

    // Debounce effect - aguarda 500ms após o usuário parar de digitar
    useEffect(() => {
        const timer = setTimeout(() => {
            // onSearch(value);
        }, 500);

        return () => clearTimeout(timer);
    }, [value, /* onSearch */]);

    return (
        <div className="relative flex-1 sm:flex-none sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
        </div>
    );
}