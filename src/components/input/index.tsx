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
                className="w-full border-2 rounded-md h-11 px-2 border-[#e2e8f0] focus:outline-blue-500"
            />

            { error && <p className="text-red-500 my-1">{error}</p> }
        </>
    )
}