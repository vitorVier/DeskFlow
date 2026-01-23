import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismaClient from "@/lib/prisma";
import toast from "react-hot-toast";

// http://localhost:3000/api/customer

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get("email");

    if(!customerEmail || customerEmail === "") return NextResponse.json({ error: "Customer not found!"}, { status: 400 })

    try {
        const customer = await prismaClient.customer.findFirst({
            where: {
                email: customerEmail
            }
        })

        return NextResponse.json(customer)

    } catch(err) {
        return NextResponse.json({ error: "Customer not found!"}, { status: 400 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    
    if(!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 })
    }

    const { name, email, phone, address, userId } = await request.json()

    const findCustomer = await prismaClient.customer.findFirst({
        where: {
            email: email as string
        }
    })

    if(findCustomer) return NextResponse.json({ message: "Failed update ticket"}, { status: 400 })

    try {
        await prismaClient.customer.create({
            data: {
                name,
                phone,
                email,
                address: address ? address: "",
                userId
            }
        })

        return NextResponse.json({ message: "Cliente cadastrado com sucesso!"})
    } catch(err) {
        return NextResponse.json({ error: "Failed create new customer" }, { status: 400 })
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    
    if(!session || !session.user) {
        return NextResponse.json({ error: "Unauthozired" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id")

    // Caso não houver userId, barra a requisição
    if(!userId) return NextResponse.json({ error: "Failed delete customer" }, { status: 400 })

    const findTickets = await prismaClient.ticket.findFirst({
        where: {
            customerId: userId
        }
    })

    if(findTickets) {
        return alert(NextResponse.json({ error: "Impossível deletar. O cliente tem um chamado em aberto!" }, { status: 400 }))
    }

    try {
        await prismaClient.customer.delete({
            where: {
                id: userId as string
            }
        })

        return NextResponse.json({ message: "Cliente deletado com sucesso!" })
    } catch(err) {
        return NextResponse.json({ error: "Failed delete customer" }, { status: 400 })
    }
}