"use client"
import { group } from "console";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiRefreshCcw } from "react-icons/fi";

export function ButtonRefresh() {
    const router = useRouter();

    function refresh() {
        router.refresh()
        toast.success(`Lista de Tickets atualizada`);
    }
    
    return (
        <button 
            onClick={refresh}
            className={`
                relative flex items-center justify-center p-2.5 rounded-xl
                bg-white/80 backdrop-blur-md border border-gray-200/60
                text-slate-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]
                hover:text-blue-600 hover:border-blue-200 hover:bg-white
                transition-all duration-300 active:scale-90 disabled:opacity-50
                group overflow-hidden cursor-pointer
            `}
            title="Atualizar chamados"
        >

            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <FiRefreshCcw 
                size={22} 
                className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" 
            />
        </button>
    )
}