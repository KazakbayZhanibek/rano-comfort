export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/addresses/[id] - Обновить адрес
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { label, fullAddress, city, street, building, apartment, isDefault } = body

    // Если это адрес по умолчанию, отключить все остальные
    if (isDefault) {
      const address = await prisma.address.findUnique({ where: { id } })
      if (address) {
        await prisma.address.updateMany({
          where: { userId: address.userId },
          data: { isDefault: false },
        })
      }
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        label,
        fullAddress,
        city,
        street,
        building,
        apartment,
        isDefault,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

// DELETE /api/addresses/[id] - Удалить адрес
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.address.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
