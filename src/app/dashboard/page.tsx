import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TicketItem } from "./components/ticket";
import prismaClient from "@/lib/prisma"
import { FaTasks } from "react-icons/fa";
import { ButtonRefresh } from "./components/buttonRefresh";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    const tickets = await prismaClient.ticket.findMany({
        where: {
            customer: {
                userId: session.user.id
            }
        },
        include: {
            customer: true
        },
        orderBy: {
            created_at: "desc"
        }
    })

    const isOpen = await prismaClient.ticket.findMany({
        where: {
            userId: session.user.id,
            status: "ABERTO",
            customer: {
                userId: session.user.id
            }
        },
        include: {
            customer: true
        },
        orderBy: {
            created_at: "desc"
        }
    })

    return(
        <Container>
            <main className="mt-9 mb-2 max-w-7xl mx-auto px-2">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 pl-2">
                        <FaTasks size={32} className="text-blue-600" />
                        <h1 className="text-3xl font-extrabold text-gray-800">Chamados</h1>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <ButtonRefresh />

                        <Link 
                            href="/dashboard/new" 
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition-all shadow-md active:scale-95"
                        >
                            Novo ticket
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider pl-6 py-4 text-left">CLIENTE</th>
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell py-4 text-left">DATA CADASTRO</th>
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider py-4 text-left">STATUS</th>
                                <th className="font-bold text-gray-400 text-xs uppercase tracking-wider pr-6 py-4 text-right">AÇÕES</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {tickets.map( ticket => (
                                <TicketItem 
                                    key={ticket.id} 
                                    customer={ticket.customer} 
                                    ticket={ticket} 
                                />
                            ))}
                        </tbody>
                    </table>

                    {tickets.length === 0 && (
                        <div className="py-10 text-center">
                            <h1 className="text-gray-400 font-medium">Nenhum ticket aberto foi encontrado!</h1>
                        </div>
                    )}
                </div>
            </main>
        </Container>
    )
}