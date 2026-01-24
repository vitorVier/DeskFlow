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
import { RxCalendar } from "react-icons/rx";
import { IoTicketOutline } from "react-icons/io5";

export default async function Dashboard({
    searchParams,
} : {
    searchParams: Promise<{ [ key: string ]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);
    const { status } = await searchParams;

    if(!session || !session.user) {
        redirect('/')
    }

    const whereCondition: any = {
        OR: [
            { userId: session.user.id },
            { userId: null } // Inclui os tickets criados por usuários não logados
        ]
    };

    if (status === "ABERTO" || status === "FECHADO") {
        whereCondition.status = status;
    }

    const tickets = await prismaClient.ticket.findMany({
        where: whereCondition,
        include: {
            customer: true
        },
        orderBy: {
            created_at: "desc"
        }
    })

    const isOpenCount = await prismaClient.ticket.count({
        where: {
            userId: session.user.id,
            status: "ABERTO"
        }
    });

    return(
        <Container>
            <main className="mt-4 sm:mt-9 mb-2 max-w-7xl mx-auto px-2 sm:px-4">
        
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    
                    <div className="flex items-center gap-3 pl-2">
                        <FaTasks size={32} className="text-blue-600" />
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                            Meus Tickets
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <SearchInput placeholder="Buscar tickets..." />
                        
                        <div className="flex items-center gap-2">
                            <ButtonRefresh />
                            
                            <Link 
                                href="/dashboard/new"
                                className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2.5 rounded-lg text-white font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap text-sm sm:text-base"
                            >
                                <span className="md:hidden font-medium"><IoMdAdd size={20} color="#FFF" /></span>
                                <span className="hidden md:inline">Novo ticket</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <section className="flex gap-3 mb-6">
                    <div className="flex-1 sm:flex-none">
                        <StatusFilter />
                    </div>

                    <div className="flex items-center sm:flex-none">
                        <DateFilter value="all" icon={
                            <RxCalendar size={22} className="text-blue-600 z-10" />
                        } />
                    </div>

                    <div className={`flex items-center justify-start gap-2 bg-white border border-gray-200 rounded-xl px-4 h-11 shadow-sm hover:border-gray-300 transition-all cursor-pointer group focus:ring-4 focus:ring-blue-500/10`}>
                        <IoTicketOutline size={22} className="text-blue-600" />
                        <p className="pr-2"><span className="font-medium">{tickets.length}</span> tickets</p>
                    </div>
                    
                </section>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                    <table className="min-w-150 w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider pl-6 py-4 text-left">
                                    CLIENTE
                                </th>
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell py-4 text-left">
                                    DATA CADASTRO
                                </th>
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider py-4 text-left">
                                    STATUS
                                </th>
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider pr-6 py-4 text-right">
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

                    {tickets.length === 0 && (
                        <div className="py-12 text-center">
                            <h1 className="text-gray-400 font-medium">Nenhum ticket encontrado!</h1>
                        </div>
                    )}
                </div>
            </main>
        </Container>
    )
}