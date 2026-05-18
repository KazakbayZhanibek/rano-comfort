import { prisma } from '@/lib/prisma'
import EditCategoryForm from './EditCategoryForm'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: Number(params.id) },
  })

  if (!category) notFound()

  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.75rem', fontWeight: 800,
        marginBottom: '2rem', color: 'var(--color-text)',
      }}>
        Редактировать категорию
      </h1>
      <EditCategoryForm category={category} />
    </div>
  )
}