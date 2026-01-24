"use client"

import { ModalContext } from "@/providers/modal";
import { useSession } from "next-auth/react";
import { MouseEvent, useContext, useRef } from "react";
import { IoClose } from "react-icons/io5";

export function ModalTicket() {
    const { data: session } = useSession();
    const { handleModalVisible, ticket } = useContext(ModalContext)
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current?.contains(e.target as Node)) {
            handleModalVisible();
        }
    }

    return (
        <section 
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center px-2 sm:px-4" 
            onClick={handleModalClick}
        >
            <div 
                ref={modalRef} 
                className="bg-white shadow-2xl w-full max-w-2xl md:max-w-[90vw] lg:max-w-7xl rounded-xl overflow-hidden transform transition-all flex flex-col"
            >
                <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 border-b border-gray-100">
                    <h1 className="font-bold text-lg md:text-2xl text-gray-800 truncate">
                        Detalhes do Ticket {ticket?.ticket.id}
                    </h1>
                    <button 
                        className="p-2 bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 rounded-full transition-colors cursor-pointer" 
                        onClick={handleModalVisible}
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Assunto</span>
                            <p className="text-gray-700 font-medium text-base md:text-lg pr-1">{ticket?.ticket.name}</p>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Autor</span>
                            <p className="text-gray-700 font-medium text-base md:text-lg">
                                {ticket?.ticket.userId ? (
                                    session?.user?.name
                                ) : (
                                    ticket?.customer?.name
                                )}        
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Descrição</span>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                            {ticket?.ticket.description}
                        </p>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex grow border-t border-gray-200"></div>
                        <span className="flex shrink mx-4 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Dados do Cliente</span>
                        <div className="flex grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase">Nome</span>
                            <p className="text-gray-800 font-semibold text-sm md:text-base">{ticket?.customer?.name}</p>
                        </div>
                        
                        <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase">Telefone</span>
                            <p className="text-gray-800 font-semibold text-sm md:text-base">{ticket?.customer?.phone}</p>
                        </div>

                        <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase">E-mail</span>
                            <p className="text-gray-800 font-semibold text-sm md:text-base break-all">{ticket?.customer?.email}</p>
                        </div>

                        <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100 sm:col-span-2">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase">Endereço</span>
                            <p className="text-gray-800 font-semibold text-sm md:text-base">{ticket?.customer?.address}</p>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixo na base */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={handleModalVisible}
                        className="w-full sm:w-auto px-8 py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-red-500 transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </section>
    )
}