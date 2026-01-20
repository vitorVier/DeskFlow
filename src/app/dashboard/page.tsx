import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TicketItem } from "./components/ticket";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    return(
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-3xl font-bold">Chamados</h1>

                    <Link href="/dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">Novo chamado</Link>
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
                        <TicketItem />
                        <TicketItem />
                        <TicketItem />
                    </tbody>
                </table>
            </main>
        </Container>
    )
}