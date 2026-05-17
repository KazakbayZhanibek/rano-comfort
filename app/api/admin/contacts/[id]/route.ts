import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json()
  const contact = await prisma.contact.update({
    where: { id: Number(params.id) },
    data:  { status },
  })
  return NextResponse.json(contact)
}