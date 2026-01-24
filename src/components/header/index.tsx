"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayout, FiLoader, FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";

export function Header() {
    const { status, data } = useSession();
    const pathname = usePathname();

    async function handleLogin() {
        await signIn();
    }

    async function handleLogOut() {
        await signOut();
    }

    const isActive = (path: string) => {
        if (path === "/dashboard") {
            // Ativa apenas se estiver no dashboard e NÃO estiver em clientes
            return pathname === "/dashboard" || pathname.startsWith("/dashboard/new");
        }
        return pathname.startsWith(path);
    };

    return (
        <header className="w-full flex items-center bg-white h-20 shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="w-full flex items-center justify-between max-w-7xl mx-auto px-4">
                
                <Link href="/">
                    <h1 className="font-extrabold text-2xl tracking-tight transition-all duration-300 hover:opacity-80">
                        <span className="text-blue-600">DEV</span>
                        <span className="text-gray-800">CONTROLE</span>
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    {status === "loading" && (
                        <FiLoader size={24} className="animate-spin text-gray-400"/>
                    )}

                    {status === "unauthenticated" && (
                        <button 
                            onClick={handleLogin} 
                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-all border border-gray-200 cursor-pointer font-medium"
                        >
                            <FiLock size={20} />
                            <span>Acessar</span>
                        </button>
                    )}

                    {status === "authenticated" && (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link 
                                href="/dashboard"
                                className={`p-2.5 rounded-xl transition-all border ${
                                    isActive("/dashboard")
                                    ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm" 
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-500 border-transparent"
                                }`}
                                title="Ir para o Painel"
                            >
                                <FiLayout size={24} />
                            </Link>

                            <Link 
                                href="/dashboard/customer"
                                className={`p-2.5 rounded-xl transition-all border ${
                                    isActive("/dashboard/customer")
                                    ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm" 
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-500 border-transparent"
                                }`}
                                title="Meus Clientes"
                            >
                                <FiUser size={24} />
                            </Link>

                            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

                            <button 
                                onClick={handleLogOut}
                                className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer group border border-transparent hover:border-red-100"
                                title="Sair do sistema"
                            >
                                <FiLogOut size={24} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}