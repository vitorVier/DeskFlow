"use client"

import { api } from "@/lib/api"
import { CustomerProps } from "@/utils/customer.type"
import Link from "next/link";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiTrash2, FiChevronRight, FiMapPin } from "react-icons/fi";

export function CardCustomer({ customer }: { customer: CustomerProps }) {
    const router = useRouter();

    async function handleDeleteCustomer() {
        try {
            await api.delete("/api/customer", { params: { id: customer.id } });
            toast.success("Cliente removido");
            router.refresh();
        } catch(err) {
            toast.error("Erro ao deletar: verifique tickets abertos.");
        }
    } 

    return (
        <article className="group relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300">
            
            <button 
                className="absolute top-3 right-3 p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200"
                onClick={handleDeleteCustomer}
            > 
                <FiTrash2 size={16} className="cursor-pointer"/>
            </button>

            <Link href={`/dashboard/customer/${customer.name}/tickets`} className="block">
                <div className="flex flex-col gap-3">
                    {/* Header do Card */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {(() => {
                                const names = customer.name.trim().split(/\s+/);
                                const firstInitial = names[0]?.[0] || "";
                                const lastInitial = names.length > 1 ? names[names.length - 1][0] : names[0]?.[1] || "";
                                return (firstInitial + lastInitial).toUpperCase();
                            })()}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-gray-800 truncate text-base group-hover:text-blue-600 transition-colors">
                                {customer.name}
                            </h2>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Cliente Ativo</p>
                        </div>
                    </div>

                    {/* Infos de Contato */}
                    <div className="space-y-1.5 mt-1">
                        <div className="flex items-center gap-2.5 text-gray-500 text-[13px]">
                            <FiMail size={14} className="text-gray-300 shrink-0" />
                            <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-500 text-[13px]">
                            <FiPhone size={14} className="text-gray-300 shrink-0" />
                            <span>{customer.phone}</span>
                        </div>
                        { customer.address && (
                            <div className="flex items-center gap-2.5 text-gray-500 text-[13px]">
                                <FiMapPin size={14} className="text-gray-300 shrink-0" />
                                <span>{customer.address}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer do Card */}
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-blue-600">
                        <span className="text-xs font-bold">Acessar tickets</span>
                        <FiChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>
        </article>
    )
}