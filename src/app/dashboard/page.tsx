import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TicketItem } from "./components/ticket";
import prismaClient from "@/lib/prisma"
import { FaTasks } from "react-icons/fa";
import { ButtonRefresh } from "./components/buttonRefresh";
import { StatusFilter } from "./components/statusFilter";
import { IoMdAdd } from "react-icons/io";
import { SearchInput } from "./components/search";
import { DateFilter } from "./components/dateFilter";
import { IoTicketOutline } from "react-icons/io5";
import { 
  startOfDay, endOfDay, 
  startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, 
  startOfYear, endOfYear 
} from "date-fns";

export default async function Dashboard({
    searchParams,
} : {
    searchParams: Promise<{ [ key: string ]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    const { status, date, search } = await searchParams;
    const today = new Date();

    const whereCondition: any = {
        AND: [
            {
                OR: [
                    { userId: session.user.id },
                    { userId: null }
                ]
            }
        ]
    };

    const dateIntervals: Record<string, { gte: Date; lte: Date }> = {
        today: { gte: startOfDay(today), lte: endOfDay(today) },
        week:  { gte: startOfWeek(today), lte: endOfWeek(today) },
        month: { gte: startOfMonth(today), lte: endOfMonth(today) },
        year:  { gte: startOfYear(today), lte: endOfYear(today) },
    };

    if (date && dateIntervals[date as string]) {
        whereCondition.AND.push({created_at: dateIntervals[date as string]});
    }

    if (search) {
        whereCondition.AND.push({
            OR: [
                { name: { contains: search as string, mode: 'insensitive' } },
                { customer: { name: { contains: search as string, mode: 'insensitive' } } }
            ]
        });
    }

    if (status === "ABERTO" || status === "EM ANDAMENTO" || status === "RESOLVIDO") whereCondition.AND.push({status: status});

    const tickets = await prismaClient.ticket.findMany({
        where: whereCondition,
        include: { customer: true },
        orderBy: { created_at: "desc" }
    });

    return(
        <Container>
            <main className="mt-6 mb-8 max-w-7xl mx-auto px-4">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                            
                            {/* Container Principal */}
                            <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="absolute inset-0.75 rounded-[13px] bg-linear-to-br from-gray-50 to-white border border-white"></div>
                                
                                <FaTasks size={20} className="relative text-blue-600 drop-shadow-[0_2px_2px_rgba(37,99,235,0.2)]" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
                                Central de Chamados
                            </h1>
                            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">
                                Gerencie o suporte em tempo real
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <SearchInput placeholder="Buscar chamado..." />
                        <ButtonRefresh />
                        <Link 
                            href="/dashboard/new"
                            className="group bg-gray-900 hover:bg-blue-600 px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-blue-200 active:scale-95 flex items-center gap-2"
                        >
                            <IoMdAdd size={18} className="group-hover:rotate-90 transition-transform" />
                            <span className="hidden sm:inline">Novo Ticket</span>
                            <span className="sm:hidden">Novo</span>
                        </Link>
                    </div>
                </div>

                {/* Seção de Filtros mais "Clean" */}
                <section className="flex flex-wrap items-center gap-3 mb-6">
                    <StatusFilter />
                    <DateFilter />
                    
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl ml-auto transition-all hover:border-gray-300">
                        <IoTicketOutline size={16} className="text-blue-500" />
                        <span className="text-[13px] font-bold text-gray-600">
                            {tickets.length} <span className="font-medium text-gray-400">Total</span>
                        </span>
                    </div>
                </section>

                {/* Tabela com cara de Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="font-bold text-gray-400 text-[11px] uppercase tracking-widest pl-6 py-4 text-left">Cliente</th>
                                    <th className="font-bold text-gray-400 text-[11px] uppercase tracking-widest py-4 text-left hidden md:table-cell">Abertura</th>
                                    <th className="font-bold text-gray-400 text-[11px] uppercase tracking-widest py-4 text-left">Status</th>
                                    <th className="font-bold text-gray-400 text-[11px] uppercase tracking-widest pr-6 py-4 text-right">Gerenciar</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {tickets.map(ticket => (
                                    <TicketItem key={ticket.id} customer={ticket.customer} ticket={ticket} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </Container>
    )
}