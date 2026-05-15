export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: parseInt(userId) },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const body = await request.json()
    const { userId, label, fullAddress, city, street, building, apartment, isDefault } = body

    if (!userId || !label || !fullAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: parseInt(userId) },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: parseInt(userId),
        label,
        fullAddress,
        city,
        street,
        building,
        apartment,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}