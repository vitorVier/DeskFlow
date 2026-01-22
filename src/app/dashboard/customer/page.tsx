import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CardCustomer } from "./components/card";
import prismaClient from "@/lib/prisma"
import { FiUserPlus, FiUsers } from "react-icons/fi";

export default async function Customer() {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    const customers = await prismaClient.customer.findMany({
        where: {
            userId: session.user.id
        }
    })

    return (
        <Container>
            <main className="mt-9 mb-8 max-w-7xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3 pl-2">
                        <FiUsers size={32} className="text-blue-600" />
                        <h1 className="text-3xl font-extrabold text-gray-800">Meus Clientes</h1>
                    </div>

                    <Link 
                        href="/dashboard/customer/new" 
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-white font-semibold transition-all shadow-md shadow-blue-200 active:scale-95 flex items-center gap-2"
                    >
                        <FiUserPlus size={20} />
                        Novo Cliente
                    </Link>
                </div>

                {customers.length === 0 && (
                    <section className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <FiUsers size={48} className="text-gray-300" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-700">Nenhum cliente por aqui...</h2>
                        <p className="text-gray-500 mb-6">Comece cadastrando seu primeiro cliente para gerenciar tickets.</p>
                        
                        <Link 
                            href="/dashboard/customer/new" 
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                        >
                            Cadastrar agora →
                        </Link>
                    </section>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map(customer => (
                        <CardCustomer 
                            key={customer.id} 
                            customer={customer}
                        />
                    ))}
                </section>
                </main>
        </Container>
    )
}