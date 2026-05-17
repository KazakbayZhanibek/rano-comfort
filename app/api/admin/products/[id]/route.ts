export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendStockAlert } from '@/lib/stockAlert'

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value
  return token === process.env.ADMIN_SECRET
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: { category: true },
    })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { name, slug, description, price, oldPrice, volume, stock, images, isBestseller, isNew, isEco, categoryId } = body

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        name, slug, description,
        price:        parseFloat(price),
        oldPrice:     oldPrice ? parseFloat(oldPrice) : null,
        volume, stock,
        images:       JSON.stringify(images || []),
        isBestseller: isBestseller || false,
        isNew:        isNew        || false,
        isEco:        isEco        || false,
        categoryId,
      },
      include: { category: true },
    })

    if (product.stock <= 5) {
      sendStockAlert({
        id:       product.id,
        name:     product.name,
        stock:    product.stock,
        category: product.category.name,
      }).catch(console.error)
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    if (isNaN(id) || id <= 0) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })

    const productExists = await prisma.product.findUnique({ where: { id }, select: { id: true, name: true } })
    if (!productExists) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    await prisma.review.deleteMany({ where: { productId: id } })
    await prisma.wishlist.deleteMany({ where: { productId: id } })

    const product = await prisma.product.delete({
      where: { id },
      select: { id: true, name: true, slug: true },
    })

    return NextResponse.json({ success: true, message: `Товар "${product.name}" удалён`, product })
  } catch (error: any) {
    if (error?.code === 'P2003') return NextResponse.json({ error: 'Товар связан с другими данными' }, { status: 500 })
    if (error?.code === 'P2025') return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}