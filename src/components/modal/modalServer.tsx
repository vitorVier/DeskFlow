"use server"

import prismaClient from "@/lib/prisma";

export async function getTicketComments(ticketId: string) {
  if (!ticketId) return [];

  const comments = await prismaClient.ticketComment.findMany({
    where: { ticketId: ticketId },
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: { name: true }
      }
    }
  });

  return comments.map(c => ({
    id: c.id,
    progressText: c.message,
    date: c.created_at,
    author: c.user?.name || "Sistema"
  }));
}