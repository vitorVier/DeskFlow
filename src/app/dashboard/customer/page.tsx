import { Container } from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CardCustomer } from "./components/card";
import prismaClient from "@/lib/prisma"
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { SearchInput } from "../components/search";

export default async function Customer({searchParams,
} : {
    searchParams: Promise<{ [ key: string ]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    const whereCondition: any = {
        AND: [
            { userId: session.user.id }
        ]
    };

    const { search } = await searchParams;

    if (search) {
        whereCondition.AND.push({
            OR: [
                { name: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
                { phone: { contains: search as string, mode: 'insensitive' } },
                { address: { contains: search as string, mode: 'insensitive' } },
            ]
        });
    }

    const customers = await prismaClient.customer.findMany({
        where: whereCondition,
        orderBy: { created_at: 'asc' }
    })

    return (
        <Container>
            <main className="mt-6 mb-8 max-w-7xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            
                            {/* Container Principal */}
                            <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
                                <div className="absolute inset-0.75 rounded-[13px] bg-linear-to-br from-gray-50 to-white border border-white"></div>
                                <FiUsers size={20} className="relative text-blue-600 drop-shadow-[0_2px_2px_rgba(37,99,235,0.15)]" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
                                Meus Clientes
                            </h1>
                            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">
                                Gerenciamento de base
                            </p>
                        </div>
                    </div>

                    <Link 
                        href="/dashboard/customer/new" 
                        className="group bg-gray-900 hover:bg-blue-600 px-6 py-2.5 rounded-2xl text-white text-[13px] font-bold transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-blue-200 active:scale-95 flex items-center gap-2"
                    >
                        <FiUserPlus size={16} className="group-hover:rotate-12 transition-transform" />
                        Novo Cliente
                    </Link>
                </div>

                <div className="mb-8">
                    <SearchInput placeholder="Buscar por nome, email ou telefone..."/>
                </div>

                {customers.length === 0 && (
                    <section className="bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center">
                        <FiUsers size={40} className="text-gray-300 mb-3" />
                        <h2 className="text-lg font-semibold text-gray-700">Nenhum cliente encontrado</h2>
                        <p className="text-sm text-gray-500 mb-4">Sua lista está vazia no momento.</p>
                        <Link href="/dashboard/customer/new" className="text-blue-600 text-sm font-bold hover:underline">
                            Cadastrar agora →
                        </Link>
                    </section>
                )}

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map(customer => (
                        <CardCustomer key={customer.id} customer={customer} />
                    ))}
                </section>
            </main>
        </Container>
    )
}