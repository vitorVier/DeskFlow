"use client"

import { ModalContext } from "@/providers/modal";
import { useSession } from "next-auth/react";
import { MouseEvent, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import { IoClose, IoPaperPlaneOutline } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { getTicketComments } from "./modalServer";
import { StatusFilter } from "@/app/dashboard/components/statusFilter";
import { CustomSelect, SelectOption } from "@/app/dashboard/components/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

    // Carrega os andamentos quando o componente é montado ou atualizado
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

    // Status Filter Lógica
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentStatus = searchParams.get("status") || "all";

    const options: SelectOption[] = [
        { value: "ABERTO", label: "Aberto", color: "bg-blue-600" },
        { value: "EM ANDAMENTO", label: "Em Andamento", color: "bg-orange-500" },
        { value: "RESOLVIDO", label: "Resolvido", color: "bg-emerald-600" },
    ];

    const handleSelect = useCallback((value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (value === "all") {
                params.delete("status");
            } else {
                params.set("status", value);
            }
            
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false
            });
        });
    }, [pathname, searchParams, router]);

    return (
        <section
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
            onClick={handleModalClick}
        >
            <div
                ref={modalRef}
                className="bg-white shadow-2xl w-full sm:max-w-4xl md:max-w-5xl mt-16 h-[92vh] sm:h-auto sm:max-h-[85vh] rounded-t-2xl sm:rounded-xl overflow-hidden transform transition-all flex flex-col"
            >
                {/* --- HEADER --- */}
                <div className="relative p-5 md:p-6 bg-white border-b border-gray-100 shrink-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 hidden sm:block"></div>

                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                    Protocolo #{ticket?.ticket.id?.slice(-6)}
                                </div>
                                <h1 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight leading-tight break-words">
                                    {ticket?.ticket.name}
                                </h1>
                            </div>
                            
                            {/* Botão fechar sempre visível no topo direito */}
                            <button
                                className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg border border-gray-100 transition-all cursor-pointer group shrink-0"
                                onClick={handleModalVisible}
                            >
                                <IoClose size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-600 border border-gray-200">
                                        {ticket?.ticket.userId ? session?.user?.name?.[0] : ticket?.customer?.name?.[0]}
                                    </div>
                                    <span className="font-medium">
                                        {ticket?.ticket.userId ? session?.user?.name : ticket?.customer?.name}
                                    </span>
                                </div>
                                <div className="h-3 w-[1px] bg-gray-200 hidden md:block"></div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <FiClock size={12} />
                                    <span>{new Date(ticket?.ticket.created_at || "").toLocaleDateString("pt-br")}</span>
                                </div>
                            </div>

                            <div className="scale-95 md:scale-90 origin-left md:origin-right">
                                <CustomSelect 
                                    options={options} 
                                    currentValue={currentStatus} 
                                    onSelect={handleSelect} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTEÚDO --- */}
                <div className="p-5 md:p-6 space-y-6 overflow-y-auto custom-scrollbar scroll-smooth bg-gray-50/30">
                    
                    {/* Bloco: Dados do Cliente */}
                    <div className="space-y-3">
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <div className="h-3 w-0.5 bg-blue-500"></div> Informações do Cliente
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Nome</span>
                                <p className="text-gray-800 font-semibold text-sm truncate">{ticket?.customer?.name || "---"}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Contato</span>
                                <p className="text-gray-800 font-semibold text-sm">{ticket?.customer?.phone || "---"}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">E-mail</span>
                                <p className="text-gray-800 font-semibold text-sm truncate">{ticket?.customer?.email || "---"}</p>
                            </div>
                            
                            <div className="sm:col-span-2 lg:col-span-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-start gap-2">
                                <div className="flex-1">
                                    <span className="text-[9px] font-bold text-blue-500 uppercase">Endereço de Atendimento</span>
                                    <p className="text-gray-600 font-medium text-xs md:text-sm">{ticket?.customer?.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloco: Andamentos */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                <div className="h-3 w-0.5 bg-orange-500"></div> Linha do Tempo
                            </h2>
                            <span className="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded font-bold uppercase">
                                {notes.length} Notas
                            </span>
                        </div>

                        {ticket?.ticket.status !== "RESOLVIDO" && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Adicionar nota interna..."
                                    className="w-full min-h-[100px] p-3 text-gray-700 placeholder:text-gray-300 bg-transparent resize-none focus:outline-none text-sm"
                                ></textarea>
                                <div className="flex justify-end p-2 bg-gray-50/50 border-t border-gray-50 rounded-b-xl">
                                    <button
                                        onClick={handleAddNote}
                                        disabled={isLoading || !noteText.trim()}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                                    >
                                        {isLoading ? "..." : "Enviar Nota"}
                                        <IoPaperPlaneOutline size={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="relative pl-4 ml-1.5 space-y-6 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                            {notes.map((note) => (
                                <div key={note.id} className="relative">
                                    <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-300"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="text-xs font-bold text-gray-700">{note.author}</span>
                                            <span className="text-[10px] text-gray-400">
                                                {note.date.toLocaleDateString("pt-br")} às {note.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-gray-600 text-sm leading-relaxed">
                                            {note.progressText}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <span className="text-[10px] text-gray-400 font-medium order-2 sm:order-1">Dashboard v2.0</span>
                    <button
                        onClick={handleModalVisible}
                        className="w-full sm:w-auto px-8 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all cursor-pointer shadow-sm active:scale-95 order-1 sm:order-2"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </section>
    )
}