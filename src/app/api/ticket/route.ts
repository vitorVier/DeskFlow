import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaClient from "@/lib/prisma";

//http://localhost:3000/api/ticket
export async function PATCH(request: Request) { 
    const { id } = await request.json();
    const findTicket = await prismaClient.ticket.findFirst({
        where: {
            id: id as string
        }
    })

    if(!findTicket) return NextResponse.json({ message: "Failed update ticket"}, { status: 400 })

    try{
        const update = await prismaClient.ticket.update({
            where: {
                id: id as string
            },
            data: {
                status: "FECHADO"
            }
        })

        return NextResponse.json({ message: "Chamado atualizado com sucesso!" })
    } catch { return }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if(!session || !session.user) return NextResponse.json({ error: "Unauthorized"}, { status: 401 })

    const { customerId, name, description } = await request.json();

    if(!name || !description) return NextResponse.json({ error: "Nome e descrição são obrigatórios!" }, { status: 400 })
    if (!customerId) return NextResponse.json({ error: "É necessário selecionar um cliente!" }, { status: 400 });

    try {
        const customerExists = await prismaClient.customer.findUnique({
            where: { id: customerId }
        });

        if (!customerExists) return NextResponse.json({ error: "Cliente não encontrado!" }, { status: 404 });
        if (session?.user && customerExists.userId !== session.user.id) return NextResponse.json({ error: "Você não tem permissão para criar tickets para este cliente!" }, { status: 403 });

        const ticket = await prismaClient.ticket.create({
            data: {
                name: name,
                description: description,
                status: "ABERTO",
                customerId: customerId,
                userId: session?.user?.id || null // Se houver usuário logado
            }
        });

        return NextResponse.json({ message: "Ticket registrado com sucesso!", ticketId: ticket.id })
    } catch(err) {
        return NextResponse.json({ error: "Filed create new ticket!" }, { status: 500 })
    }
}   