"use client"

import { CustomerProps } from "@/utils/customer.type";
import { TicketProps } from "@/utils/ticket.type";
import { FiCheckSquare, FiFile } from "react-icons/fi";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ModalContext } from "@/providers/modal";

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
            <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300">
                <td className="text-left pl-1">
                    {customer?.name}
                </td>

                <td className="text-left hidden sm:table-cell">
                    {ticket?.created_at?.toLocaleDateString("pt-br")}
                </td>

                <td className="text-left">
                    <span className={`font-medium px-2 py-1 rounded ${ticket.status === 'FECHADO' ? 'bg-red-500' : 'bg-green-500'}`}>{ticket.status}</span>
                </td>

                <td className="text-right pr-2">
                    <button className="cursor-pointer mr-3" onClick={handleOpenModal}>
                        <FiFile size={24} color="#3B82F6" />
                    </button>

                    <button className="mr-2 cursor-pointer" onClick={handleChangeStatus}>
                        <FiCheckSquare size={24} className="text-[#131313] hover:text-green-600 duration-200" />
                    </button>
                </td>
            </tr>
        </>
    )
}