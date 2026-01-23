import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaClient from "@/lib/prisma";

//http://localhost:3000/api/ticket

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)

    if(!session || !session.user) return NextResponse.json({ error: "Unauthorized"}, { status: 401 })

    const { id } = await request.json();
    const findTicket = await prismaClient.ticket.findFirst({
        where: {
            id: id as string
        }
    })

    if(!findTicket) return NextResponse.json({ message: "Failed update ticket"}, { status: 400 })

    try{
        await prismaClient.ticket.update({
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
    const { customerId, name, description } = await request.json();

    if(!customerId || !name || !description) return NextResponse.json({ error: "Filed create new ticket!" }, { status: 400 })

    try {
        await prismaClient.ticket.create({
            data: {
                name: name,
                description: description,
                status: "ABERTO",
                customerId: customerId
            }
        })

        return NextResponse.json({ message: "Ticket registrado com sucesso!" })
    } catch(err) {
        return NextResponse.json({ error: "Filed create new ticket!" }, { status: 400 })
    }
}   