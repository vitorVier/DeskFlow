"use client"

import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({ type, placeholder, name, register, error, rules }: InputProps) {
    return (
        <>
            <input 
                type={type}
                placeholder={placeholder}
                id={name}
                {...register(name, rules)}
                className={`
                    w-full border rounded-lg h-12 px-4 
                    border-gray-200 outline-none
                    placeholder:text-gray-400
                    transition-all duration-200
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
                `}
            />

            {error && (
                <p className="text-red-500 text-sm font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </>
    )
}