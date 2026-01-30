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
                {/* --- HEADER --- */}
                <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 border-b border-gray-100 shrink-0">
                    <h1 className="font-bold text-lg md:text-2xl text-gray-800 truncate">
                        Detalhes do Ticket <span className="text-blue-600">#{ticket?.ticket.id?.slice(-6)}</span>
                    </h1>
                    <button
                        className="p-2 bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 rounded-full transition-colors cursor-pointer"
                        onClick={handleModalVisible}
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                {/* --- CONTEÚDO COM SCROLL --- */}
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar scroll-smooth">

                    {/* Bloco 1: Informações Básicas */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Assunto</span>
                            <p className="text-gray-700 font-medium text-base md:text-lg">{ticket?.ticket.name}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Autor</span>
                            <p className="text-gray-700 font-medium text-base md:text-lg pr-1">
                                {ticket?.ticket.userId ? session?.user?.name : ticket?.customer?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">Descrição</span>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                            {ticket?.ticket.description}
                        </p>
                    </div>

                    {/* Bloco 2: Dados do Cliente */}
                    <div className="relative flex py-2 items-center">
                        <div className="flex grow border-t border-gray-200"></div>
                        <span className="flex shrink mx-4 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Dados do Cliente</span>
                        <div className="flex grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <InputClientData label="Nome" value={ticket?.customer?.name || "Não informado"} />
                        <InputClientData label="Telefone" value={ticket?.customer?.phone || "Não informado"} />
                        <InputClientData label="E-mail" value={ticket?.customer?.email || "Não informado"} />
                        <div className="bg-blue-50/30 p-3 rounded-lg border border-blue-100 sm:col-span-2">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase">Endereço</span>
                            <p className="text-gray-800 font-semibold text-sm md:text-base">{ticket?.customer?.address}</p>
                        </div>
                    </div>

                    {/* Bloco 3: ANDAMENTOS (NOVA SEÇÃO) */}
                    <div className="relative flex py-2 items-center mt-6">
                        <div className="flex grow border-t border-gray-200"></div>
                        <span className="flex shrink mx-4 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Andamentos</span>
                        <div className="flex grow border-t border-gray-200"></div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {/* Input de Novo Andamento */}
                        {ticket?.ticket.status !== "RESOLVIDO" && (
                            <div className="flex flex-col gap-2 mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase">Novo Andamento</label>
                                <div className="relative">
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Descreva a atualização deste ticket..."
                                        className="w-full min-h-20 p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y"
                                    ></textarea>
                                    <button
                                        onClick={handleAddNote}
                                        className="absolute bottom-3 right-3 p-2 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-sm active:scale-95"
                                        title="Salvar andamento"
                                    >
                                        <IoPaperPlaneOutline size={18} className="mr-0.5 ml-px mt-px"/>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lista de Andamentos Anteriores */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Histórico</label>
                            
                            {notes.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm italic py-4">Nenhum andamento registrado.</p>
                            ) : (
                                notes.map((note) => (
                                    <div key={note.id} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-xs text-blue-600">{note.author}</span>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                    <FiClock size={10} />
                                                    <span>{note.date.toLocaleDateString()} às {note.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-snug">{note.progressText}</p>
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