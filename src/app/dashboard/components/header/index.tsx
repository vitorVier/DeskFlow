"use client"

import { Container } from "@/components/container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiTag, FiUsers } from "react-icons/fi"; // Ícones discretos ajudam na elegância

export function DashboardHeader() {
    const pathname = usePathname();

    // Estilo base: Texto menor, tracking mais aberto para elegância e transição suave
    const baseStyle = "relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 font-medium text-[13px] sm:text-sm";
    
    // Estilo Ativo: Texto em destaque com um fundo sutil (não muito pesado)
    const activeStyle = "bg-blue-600 text-white shadow-lg shadow-blue-500/30";
    
    // Estilo Inativo: Cinza suave que reage ao hover
    const inactiveStyle = "text-gray-400 hover:text-gray-700 hover:bg-gray-100/50";

    return (
        <Container>
            {/* Nav: Fundo levemente translúcido e bordas bem arredondadas */}
            <nav className="w-full my-4 bg-white/60 backdrop-blur-md border border-gray-200/50 p-1.5 rounded-2xl flex gap-1.5 shadow-sm mb-8">
                <Link 
                    href="/dashboard" 
                    className={`${baseStyle} ${pathname === "/dashboard" ? activeStyle : inactiveStyle}`}
                >
                    <FiTag className={`${pathname === "/dashboard" ? "text-white" : "text-gray-400"} w-4 h-4`} />
                    <span>Chamados</span>
                </Link>

                <Link 
                    href="/dashboard/customer" 
                    className={`${baseStyle} ${pathname.startsWith("/dashboard/customer") ? activeStyle : inactiveStyle}`}
                >
                    <FiUsers className={`${pathname.startsWith("/dashboard/customer") ? "text-white" : "text-gray-400"} w-4 h-4`} />
                    <span>Clientes</span>
                </Link>
            </nav>
        </Container>
    )
}