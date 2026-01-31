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
            <main className="mt-4 sm:mt-9 mb-2 max-w-7xl mx-auto px-2 sm:px-4">
        
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                    
                    <div className="flex items-center gap-2 pl-1">
                        <FaTasks className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                        
                        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
                            Meus Tickets
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-auto">
                            <SearchInput placeholder="Nome do cliente..." />
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <ButtonRefresh />
                            
                            {/* Botão mais compacto no mobile */}
                            <Link 
                                href="/dashboard/new"
                                className="bg-blue-600 hover:bg-blue-700 h-10 px-4 sm:px-6 rounded-lg text-white font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap text-sm sm:text-base flex items-center justify-center flex-1 sm:flex-none"
                            >
                                <IoMdAdd size={18} className="mr-1 sm:hidden" />
                                <span className="sm:hidden">Novo</span>
                                <span className="hidden sm:inline">Novo ticket</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtros compactos */}
                <section className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                    <div className="flex-1 min-w-30 sm:flex-none">
                        <StatusFilter />
                    </div>

                    <div className="flex-1 min-w-30 sm:flex-none">
                        <DateFilter />
                    </div>

                    {/* Contador menor */}
                    <div className="flex items-center justify-start gap-2 bg-white border border-gray-200 rounded-lg px-3 h-10 shadow-sm hover:border-gray-300 transition-all cursor-pointer ml-auto">
                        <IoTicketOutline size={18} className="text-blue-600" />
                        <p className="text-xs sm:text-sm text-gray-700">
                            <span className="font-bold">{tickets.length}</span> tickets
                        </p>
                    </div>
                </section>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                        <table className="w-full min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {/* Padding reduzido (py-3) e fonte menor (text-[11px]) */}
                                    <th className="font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider pl-4 py-3 text-left">
                                        CLIENTE
                                    </th>
                                    <th className="font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider hidden md:table-cell py-3 text-left">
                                        DATA
                                    </th>
                                    <th className="font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider py-3 text-left">
                                        STATUS
                                    </th>
                                    <th className="font-bold text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider pr-4 py-3 text-right">
                                        AÇÕES
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {tickets.map(ticket => (
                                    <TicketItem 
                                        key={ticket.id} 
                                        customer={ticket.customer} 
                                        ticket={ticket} 
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {tickets.length === 0 && (
                        <div className="py-12 text-center">
                            <h1 className="text-gray-400 font-medium text-sm">Nenhum ticket encontrado!</h1>
                        </div>
                    )}
                </div>
            </main>
        </Container>
    )
}