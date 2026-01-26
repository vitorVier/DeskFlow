"use client"

import { api } from "@/lib/api"
import { CustomerProps } from "@/utils/customer.type"
import Link from "next/link";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiTrash2, FiUser } from "react-icons/fi";

export function CardCustomer({ customer }: { customer: CustomerProps }) {
    const router = useRouter();

    async function handleDeleteCustomer() {
        try{
            await api.delete("/api/customer", {
                params: {
                    id: customer.id
                }
            })

            toast.success("Cliente excluído com sucesso!")
            router.refresh();
        } catch(err) {
            toast('Verifique se o cliente possui tickets em aberto!');
            toast.error("Erro ao deletar cliente!")
            console.log(err)
        }
    } 

    return (
        <Link href={`/dashboard/customer/${customer.name}/tickets`}>
            <article className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 p-2 rounded-full">
                                <FiUser size={20} className="text-blue-600" />
                            </div>
                            
                            <h2 className="font-bold text-lg text-gray-800 truncate leading-tight">
                                {customer.name}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pl-1.5">
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <FiMail size={16} className="text-blue-400 shrink-0" />
                            <span className="truncate">{customer.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                            <FiPhone size={16} className="text-blue-400 shrink-0" />
                            <span>{customer.phone}</span>
                        </div>
                    </div>
                </div>

                <button 
                    className="absolute top-4 right-4 p-2 text-gray-300 bg-transparent rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                    onClick={handleDeleteCustomer}
                    title="Excluir cliente"
                > 
                    <FiTrash2 size={18} />
                </button>
            </article>
        </Link>
    )
}