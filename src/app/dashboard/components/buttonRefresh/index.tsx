"use client"
import { useRouter } from "next/navigation";
import { FiRefreshCcw } from "react-icons/fi";

export function ButtonRefresh() {
    const router = useRouter();
    
    return (
        <button 
            onClick={() => router.refresh()}
            className="flex items-center justify-center p-2.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-gray-50 hover:border-gray-300 shadow-2xs hover:shadow-sm transition-all active:scale-90 group cursor-pointer"
            title="Atualizar chamados"
        >
            <FiRefreshCcw 
                size={22} 
                className="group-hover:rotate-180 transition-transform duration-500 ease-in-out" 
            />
        </button>
    )
}