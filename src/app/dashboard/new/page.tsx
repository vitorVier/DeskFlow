import { Container } from "@/components/container";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prisma"
import { CustomerSelect } from "../components/customerSelect";
import { FiAlertCircle, FiArrowLeft, FiSave } from "react-icons/fi";
import { ButtonSubmit } from "../components/buttonSubmit";

export default async function NewTicket() {
    const session = await getServerSession(authOptions);

    if(!session || !session.user) {
        redirect('/')
    }

    const customers = await prismaClient.customer.findMany({
        where: {
            userId: session.user.id
        }
    })

    const options = customers.map(customer => ({
        value: customer.id,
        label: customer.name
    }));

    async function handleRegisterTicket(formData: FormData) {
        "use server"

        const name = formData.get("name")
        const description = formData.get("description")
        const customerId = formData.get("customer")

        if(!name || !description || !customerId) return;

        await prismaClient.ticket.create({
            data: {
                name: name as string,
                description: description as string,
                customerId: customerId as string,
                status: "ABERTO",
                userId: session?.user.id
            }
        })

        redirect("/dashboard")
    }

    return (
        <Container>
            <main className="mt-9 mb-8 max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-between gap-3 mb-8">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium group"
                    >
                        <FiArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </Link>

                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-extrabold text-gray-800">Novo Ticket</h1>
                    </div>
                </div>

                <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <form className="flex flex-col gap-6" action={handleRegisterTicket}>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-gray-700 text-lg">Nome do Ticket</label>
                            <input 
                                type="text"
                                name="name"
                                placeholder="Digite o nome do chamado..."
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 h-12 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-gray-700 text-lg">Descrição</label>
                            <textarea
                                placeholder="Descreva o problema detalhadamente..."
                                name="description"
                                required
                                className="w-full border border-gray-200 rounded-lg p-4 h-32 resize-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            ></textarea>
                        </div>

                        {customers.length !== 0 ? (
                            <div className="flex flex-col gap-2">
                                <CustomerSelect customers={customers} />
                            </div>
                        ) : (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                                <FiAlertCircle className="text-blue-500 mt-1" size={20} />
                                <div className="text-sm text-blue-800">
                                    <p className="font-bold">Nenhum cliente encontrado!</p>
                                    <p>Você precisa cadastrar um cliente antes de abrir um ticket. 
                                        <Link href="/dashboard/customer/new" className="font-bold underline ml-1 hover:text-blue-600">
                                            Cadastrar cliente agora
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}

                        <ButtonSubmit 
                            name={'ticket'}
                            action={handleRegisterTicket}
                        />
                    </form>
                </section>
            </main>
        </Container>
    )
}