import { Container } from "@/components/container";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prisma"
import { CustomerSelect } from "../components/customerSelect";

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
            <main className="mt-9 mb-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-white px-4 py-1 rounded bg-gray-900">Voltar</Link>
                    <h1 className="text-3xl font-bold">Novo Ticket</h1>
                </div>
            </main>

            <form className="flex flex-col mt-6" action={handleRegisterTicket}>
                <label className="mb-1 font-medium text-lg">Nome do Ticket</label>
                <input 
                    type="text"
                    name="name"
                    placeholder="Digite o nome do chamado..."
                    required
                    className="w-full border-2 rounded-md px-2 mb-2 h-11 border-[#e2e8f0] focus:outline-blue-500"
                />

                <label className="mb-1 font-medium text-lg">Descrição</label>
                <textarea
                    placeholder="Descreva o problema..."
                    name="description"
                    required
                    className="w-full border-2 border-[#e2e8f0] rounded-md px-2 mb-2 h-24 resize-none focus:outline-blue-500"
                ></textarea>

                {customers.length !== 0 && (
                    <CustomerSelect customers={customers} />
                )}

                {customers.length === 0 && (
                    <h1 className="text-gray-600 mt-3 pl-1">Você ainda não tem clientes cadastrados! <Link href="/dashboard/customer/new" className="text-blue-700 hover:text-blue-500 hover:font-medium hover:underline">Cadastrar cliente</Link></h1>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white bont-bold px-2 h-11 rounded-md my-4 cursor-pointer hover:brightness-110 duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={customers.length === 0}
                >
                    Cadastrar
                </button>
            </form>
        </Container>
    )
}