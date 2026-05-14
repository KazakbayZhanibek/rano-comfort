import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { reviewId, type } = await request.json()

    const review = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: type === 'helpful'
        ? { helpful:    { increment: 1 } }
        : { notHelpful: { increment: 1 } },
    })

    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
