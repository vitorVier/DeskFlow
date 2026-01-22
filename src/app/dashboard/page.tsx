import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TicketItem } from "./components/ticket";
import prismaClient from "@/lib/prisma"

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    const tickets = await prismaClient.ticket.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            customer: true
        }
    })

    const isOpen = await prismaClient.ticket.findMany({
        where: {
            userId: session.user.id,
            status: "ABERTO"
        },
        include: {
            customer: true
        }
    })

    return(
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-3xl font-bold">Tickets</h1>

                    <Link href="/dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">Novo ticket</Link>
                </div>

                <table className="min-w-full mt-5">
                    <thead>
                        <tr className="text-left">
                            <th className="font-medium pl-1">CLIENTE</th>
                            <th className="font-medium hidden sm:block">DATA CADASTRO</th>
                            <th className="font-medium">STATUS</th>
                            <th className="text-right font-medium pr-2">#</th>
                        </tr>
                    </thead>

                    <tbody>
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
                    <h1 className="px-2 text-gray-600 pl-1 mt-3 md:px-0">Nenhum ticket aberto foi encontrado!</h1>
                )}
            </main>
        </Container>
    )
}