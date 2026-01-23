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
            <tr className="border-b border-gray-100 last:border-b-0 bg-white hover:bg-blue-50/30 transition-all duration-300 group">
                <td className="text-left pl-4 py-4">
                    <span className="font-semibold text-gray-700 block sm:inline">
                        {customer?.name}
                    </span>
                </td>

                <td className="text-left hidden sm:table-cell py-4 text-gray-500 text-sm">
                    {ticket?.created_at?.toLocaleDateString("pt-br")}
                </td>

                <td className="text-left py-4">
                    <span 
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                            ticket.status === 'FECHADO' 
                            ? 'bg-red-100 text-red-600 border-red-200' 
                            : 'bg-green-100 text-green-600 border-green-200'
                        }`}
                    >
                        {ticket.status}
                    </span>
                </td>

                <td className="text-right pr-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors duration-200 cursor-pointer" 
                            onClick={handleOpenModal}
                            title="Ver detalhes"
                        >
                            <FiFile size={20} />
                        </button>

                        <button 
                            className="p-2 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600 transition-all duration-200 cursor-pointer" 
                            onClick={handleChangeStatus}
                            title="Mudar status"
                        >
                            <FiCheckSquare size={20} />
                        </button>
                    </div>
                </td>
            </tr>
        </>
    )
}