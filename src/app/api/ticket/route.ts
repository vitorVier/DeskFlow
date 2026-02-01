import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaClient from "@/lib/prisma";

//http://localhost:3000/api/ticket

// Rota para criar tickets e atualizar o status do mesmo
export async function PATCH(request: Request) { 
    // Proteção de rota
    const session = await getServerSession(authOptions);
    if(!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await request.json();
    const findTicket = await prismaClient.ticket.findFirst({
        where: { id: id as string }
    })

    if(!findTicket) return NextResponse.json({ message: "Failed update ticket"}, { status: 400 })

    try{
        await prismaClient.ticket.update({
            where: {
                id: id as string
            },
            data: {
                status: status
            }
        })

        return NextResponse.json({ message: "Chamado atualizado com sucesso!" })
    } catch (err) { return NextResponse.json({ message: "Failed update ticket"}, { status: 500 }) }
}

// Rota para criar um novo ticket e associá-lo a um cliente existente
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

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("id");
    if (!ticketId) return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });

    try {
        const ticket = await prismaClient.ticket.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        if (ticket.userId !== session.user.id) return NextResponse.json({ error: "You do not have permission to delete this ticket" }, { status: 403 });

        await prismaClient.ticket.delete({
            where: { id: ticketId }
        });

        return NextResponse.json({ message: "Ticket deleted successfully" });
    
    } catch(err) {
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
    }
}