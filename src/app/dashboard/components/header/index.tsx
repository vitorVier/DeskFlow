"use client"

import { Container } from "@/components/container";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
    const pathname = usePathname();

    // Classes base para os links
    const baseStyle = "flex-1 sm:flex-none text-center px-6 py-2 rounded-lg transition-all duration-200 font-medium";
    
    // Estilo para quando a aba está ATIVA
    const activeStyle = "bg-blue-600 text-white shadow-md shadow-blue-200";
    
    // Estilo para quando a aba está INATIVA
    const inactiveStyle = "text-gray-600 hover:bg-blue-50 hover:text-blue-600";

    return (
        <Container>
            <nav className="w-full my-4 bg-white border border-gray-100 p-2 rounded-xl flex gap-2 shadow-sm mb-6">
                <Link 
                    href="/dashboard" 
                    className={`${baseStyle} ${pathname === "/dashboard" ? activeStyle : inactiveStyle}`}
                >
                    Chamados
                </Link>

                <Link 
                    href="/dashboard/customer" 
                    className={`${baseStyle} ${pathname.startsWith("/dashboard/customer") ? activeStyle : inactiveStyle}`}
                >
                    Clientes
                </Link>
            </nav>
        </Container>
    )
}