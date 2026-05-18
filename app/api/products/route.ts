export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const search       = searchParams.get('search')
    const bestseller   = searchParams.get('bestseller')
    const sort         = searchParams.get('sort') || 'newest'

    let where: any = {}

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug }
    }

    if (search) {
      where.OR = [
        { name:        { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (bestseller === 'true') {
      where.isBestseller = true
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc')  orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'popular')    orderBy = { isBestseller: 'desc' }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, price, oldPrice, volume, stock, images, isBestseller, isNew, isEco, categoryId } = body

    const product = await prisma.product.create({
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product create error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}