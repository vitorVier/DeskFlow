"use client"

import { ModalContext } from "@/providers/modal";
import { useSession } from "next-auth/react";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { IoClose, IoPaperPlaneOutline } from "react-icons/io5";
import { InputClientData } from "./components/inputClientData";
import { FiClock } from "react-icons/fi";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { getTicketComments } from "./modalServer";
import { StatusFilter } from "@/app/dashboard/components/statusFilter";

interface TicketNote {
    id: string;
    progressText: string;
    date: Date;
    author: string;
}

export function ModalTicket() {
    const { data: session } = useSession();
    const { handleModalVisible, ticket } = useContext(ModalContext);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Estado para o texto do novo andamento
    const [noteText, setNoteText] = useState("");
    const [ isLoading, setIsLoading ] = useState(false)
    
    // Estado para a lista de andamentos (Simulação)
    const [notes, setNotes] = useState<TicketNote[]>([]);

    useEffect(() => {
        async function loadComments() {
            if (ticket?.ticket.id) {
                try {
                    // Busca andamentos no servidor
                    const dbNotes = await getTicketComments(ticket.ticket.id);
                    setNotes(dbNotes);
                } catch (error) {
                    console.error("Erro ao carregar comentários", error);
                    toast.error("Falha ao carregar histórico");
                }
            }
        }
        loadComments();
    }, [ticket]);

    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current?.contains(e.target as Node)) {
            handleModalVisible();
        }
    }

    // Função para adicionar novo andamento ao ticket
    async function handleAddNote() {
        if (noteText.trim() === "") return;
        setIsLoading(true);

        // Adiciona o andamento ao banco de dados (apenas se houver texto)
        try {
            const response = await api.patch(`/api/ticket/${ticket?.ticket.id}/progress`, {
                note: noteText,
            });

            const data = response.data;

            const newNote: TicketNote = {
                id: data.id,
                progressText: data.message,
                date: new Date(data.created_at),
                author: data.user?.name || session?.user?.name || "Sistema"
            };

            setNotes((prev) => [newNote, ...prev]); // Adiciona no topo da lista
            setNoteText(""); // Limpa o campo de texto
            toast.success("Andamento registrado!");

        } catch(err: any){
            toast.error(err?.response?.data?.message || "Erro ao adicionar andamento!");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm pt-20 flex items-center justify-center px-2 sm:px-4"
            onClick={handleModalClick}
        >
            <div
                ref={modalRef}
                className="bg-white shadow-2xl w-full max-w-2xl md:max-w-[90vw] lg:max-w-7xl max-h-[90vh] rounded-xl overflow-hidden transform transition-all flex flex-col"
            >
                <div className="relative p-6 md:p-8 bg-white border-b border-gray-100 shrink-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                Protocolo #{ticket?.ticket.id?.slice(-6)}
                            </div>
                            
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                                {ticket?.ticket.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                        {ticket?.ticket.userId ? session?.user?.name?.[0] : ticket?.customer?.name?.[0]}
                                    </div>
                                    <span className="font-medium">
                                        {ticket?.ticket.userId ? session?.user?.name : ticket?.customer?.name}
                                    </span>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-gray-300 hidden md:block"></div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <FiClock className="text-gray-400" />
                                    <span>Criado em {new Date(ticket?.ticket.created_at || "").toLocaleDateString("pt-br")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-center">
                            {/* O StatusFilter aqui assume o papel de badge interativo */}
                            <div className="scale-105 origin-right">
                                <StatusFilter />
                            </div>
                            
                            <button
                                className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 transition-all duration-200 cursor-pointer group"
                                onClick={handleModalVisible}
                                title="Fechar"
                            >
                                <IoClose size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- CONTEÚDO COM SCROLL --- */}
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar scroll-smooth">
                    {/* Bloco 2: Dados do Cliente */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Informações do Cliente</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Nome Completo</span>
                                <p className="text-gray-800 font-semibold truncate">{ticket?.customer?.name || "Não informado"}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Contato</span>
                                <p className="text-gray-800 font-semibold">{ticket?.customer?.phone || "Não informado"}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">E-mail</span>
                                <p className="text-gray-800 font-semibold truncate">{ticket?.customer?.email || "Não informado"}</p>
                            </div>
                            
                            <div className="md:col-span-3 bg-blue-50/40 p-4 rounded-xl border border-blue-100/50 flex items-start gap-3">
                                <div className="mt-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">Endereço de Atendimento</span>
                                    <p className="text-gray-700 font-medium text-sm md:text-base">{ticket?.customer?.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                   {/* Bloco 3: ANDAMENTOS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Linha do Tempo</h2>
                            </div>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold">
                                {notes.length} ATUALIZAÇÕES
                            </span>
                        </div>

                        {/* Input de Novo Andamento */}
                        {ticket?.ticket.status !== "RESOLVIDO" && (
                            <div className="bg-white rounded-2xl border-2 border-blue-50 p-2 shadow-sm focus-within:border-blue-200 transition-all">
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Escreva uma atualização..."
                                    className="w-full min-h-25 p-4 text-gray-700 placeholder:text-gray-300 bg-transparent resize-none focus:outline-none text-sm md:text-base"
                                ></textarea>
                                <div className="flex justify-end p-2 border-t border-gray-50">
                                    <button
                                        onClick={handleAddNote}
                                        disabled={isLoading || !noteText.trim()}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95 cursor-pointer"
                                    >
                                        {isLoading ? "Salvando..." : "Publicar"}
                                        <IoPaperPlaneOutline size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lista de Andamentos com Design de Timeline */}
                        <div className="relative pl-4 ml-2 space-y-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {notes.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 text-sm italic">Aguardando primeira atualização...</p>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <div key={note.id} className="relative">
                                        {/* Indicador de Ponto na Timeline */}
                                        <div className="absolute -left-5.25 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-500 ring-4 ring-blue-50"></div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-gray-900">{note.author}</span>
                                                <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                                    {note.date.toLocaleDateString("pt-br")} às {note.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-600 text-sm md:text-base leading-relaxed">
                                                {note.progressText}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* --- FOOTER --- */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                    <button
                        onClick={handleModalVisible}
                        className="w-full sm:w-auto px-8 py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-red-500 transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                    >
                        Fechar Detalhes
                    </button>
                </div>
            </div>
        </section>
    )
}