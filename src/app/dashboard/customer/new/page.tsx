import { Container } from "@/components/container";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { NewCustomerForm } from "../components/form";
import { FiArrowLeft } from "react-icons/fi";

export default async function NewCustomer() {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    return (
        <Container>
            <main className="mt-9 mb-8 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <Link 
                        href="/dashboard/customer" 
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium group"
                    >
                        <FiArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </Link>

                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-extrabold text-gray-800">Novo Cliente</h1>
                    </div>
                </div>

                <section className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <p className="text-gray-500 text-center">Preencha as informações abaixo para cadastrar um novo cliente na sua base.</p>
                    </div>

                    <NewCustomerForm userId={session.user.id} />
                </section>
            </main>
        </Container>
    )
}