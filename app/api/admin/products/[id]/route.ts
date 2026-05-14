import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminSession } from '@/lib/admin-auth'

// Функция для получения админ-сессии из cookies
function getAdminToken(request: NextRequest): string | null {
  return request.cookies.get('admin_session')?.value || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product get error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    console.log(`[DELETE] Запрос на удаление товара ID: ${id}`)

    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    console.log(`[DELETE] Начинаем удаление товара ID: ${id}`)

    // Проверяем, существует ли товар
    const productExists = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!productExists) {
      console.log(`[DELETE] Товар ID: ${id} не найден`)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log(`[DELETE] Найден товар: "${productExists.name}"`)

    // Удаляем все связанные данные
    console.log(`[DELETE] Удаляем отзывы для товара ${id}`)
    const deletedReviews = await prisma.review.deleteMany({
      where: { productId: id },
    })
    console.log(`[DELETE] Удалено отзывов: ${deletedReviews.count}`)

    console.log(`[DELETE] Удаляем желания для товара ${id}`)
    const deletedWishlist = await prisma.wishlist.deleteMany({
      where: { productId: id },
    })
    console.log(`[DELETE] Удалено из вишлиста: ${deletedWishlist.count}`)

    // Удаляем сам товар
    console.log(`[DELETE] Удаляем сам товар ${id}`)
    const product = await prisma.product.delete({
      where: { id },
      select: { id: true, name: true, slug: true },
    })

    console.log(`[DELETE] ✅ Товар успешно удалён:`, product)
    
    return NextResponse.json({
      success: true,
      message: `Товар "${product.name}" удалён`,
      product,
    })
  } catch (error: any) {
    console.error('[DELETE] ❌ Ошибка при удалении товара:', error)
    
    let errorMessage = 'Failed to delete product'
    let errorCode = 'UNKNOWN'

    if (error?.code === 'P2003') {
      errorMessage = 'Невозможно удалить: товар связан с другими данными'
      errorCode = 'FOREIGN_KEY_CONSTRAINT'
    } else if (error?.code === 'P2025') {
      errorMessage = 'Товар не найден'
      errorCode = 'NOT_FOUND'
    } else if (error?.message) {
      errorMessage = error.message
      errorCode = error.code || 'ERROR'
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}