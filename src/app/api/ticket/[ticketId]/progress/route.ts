import { authOptions } from "@/lib/auth"
import prismaClient from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

interface ParamsProps {
    params: Promise<{
        ticketId: string;
    }>
}

// Rota para criar andamentos de um ticket existente
export async function PATCH(request: Request, { params }: ParamsProps) {
    const session = await getServerSession(authOptions);
    const { ticketId } = await params;
    const { note, status } = await request.json();
    
    if(!session || !session.user) return NextResponse.json({ error: "Unauthorized"}, { status: 401 })

    if(!note) return NextResponse.json({ message: "Andamento é obrigatório!" }, { status: 400 })
    if(!ticketId) return NextResponse.json({ message: "Ticket é obrigatório!" }, { status: 400 })
    if(status === "resolved") return NextResponse.json({ message: "O ticket já foi encerrado!" }, { status: 400 })

    try {
        const newProgress = await prismaClient.$transaction(async (tx) => {
            const progress = await prismaClient.ticketComment.create({
                data: {
                    message: note,
                    ticketId: ticketId,
                    userId: session.user.id,
                },
                include: { user: { select: { name: true} } }
            })

            return progress;
        })

        return NextResponse.json(newProgress)

    } catch(err) {
        NextResponse.json({ error: "Failed to create ticket progress!" }, { status: 500 })
    }
}

// Rota para obter os andamentos de um ticket existente
export async function GET(request: Request, { params }: ParamsProps) {
    const session = await getServerSession(authOptions);
    const { ticketId } = await params;

    if(!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized"}, { status: 401 })
    }

    try {
        const comments = await prismaClient.ticketComment.findMany({
            where: { ticketId: ticketId },
            orderBy: { created_at: "desc" }, // Do mais novo para o mais antigo
            include: {
                user: { select: { name: true } }
            }
        });

        return NextResponse.json(comments);
        
    } catch(err) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }
}