"use client"

import { CustomerProps } from "@/utils/customer.type";
import { TicketProps } from "@/utils/ticket.type";
import { FiCheckSquare, FiFile } from "react-icons/fi";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ModalContext } from "@/providers/modal";
import toast from "react-hot-toast";

interface TicketItemProps {
    ticket: TicketProps;
    customer: CustomerProps | null;
}

export function TicketItem({ customer, ticket }: TicketItemProps) {
    const router = useRouter();
    const { handleModalVisible, setDetailTicket } = useContext(ModalContext)

    async function handleChangeStatus() {
        try {
            await api.patch("/api/ticket", {
                id: ticket.id
            })
            
        } catch(err){
            console.log(err)
        }

        toast.success("Ticket encerrado com sucesso!")
        router.refresh()
    }

    function handleOpenModal() {
        handleModalVisible(),
        setDetailTicket({
            customer: customer,
            ticket: ticket
        })
    }

    return (
        <>
            <tr
                onClick={handleOpenModal}
                className="border-b border-gray-50 last:border-b-0 bg-white hover:bg-blue-50/20 transition-all duration-300 group cursor-pointer"
            >
                <td className="pl-6 py-4">
                    <div className="flex items-center gap-3 max-w-37.5 sm:max-w-xs">
                        {/* Avatar mantido */}
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-100">
                            {customer?.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>

                        {/* Container do Nome com Rolagem Automática */}
                        <div className="relative flex-1 overflow-hidden whitespace-nowrap group/name">
                            <span className="inline-block font-bold text-gray-700 text-sm group-hover/name:animate-marquee transition-colors">
                                {customer?.name}
                            </span>
                            
                            {/* Gradiente sutil para indicar que tem mais texto (opcional) */}
                            <div className="absolute right-0 top-0 h-full w-4 bg-linear-to-l from-white group-hover:from-transparent transition-all"></div>
                        </div>
                    </div>
                </td>

                <td className="hidden md:table-cell py-4 text-gray-400 text-[13px] font-medium">
                    {ticket?.created_at?.toLocaleDateString("pt-br")}
                </td>

                <td className="py-4">
                    <span 
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            ticket.status === 'ABERTO' 
                            ? 'bg-blue-100 text-blue-700 border-blue-200' 
                            : ticket.status === 'EM ATENDIMENTO'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200' // Para o RESOLVIDO
                        }`}
                    >
                        {ticket.status}
                    </span>
                </td>

                <td className="pr-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors duration-200">
                            <FiFile size={18} />
                        </button>
                        <button className="cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600 transition-all duration-200">
                            <FiCheckSquare size={18} />
                        </button>
                    </div>
                </td>
            </tr>
        </>
    )
}