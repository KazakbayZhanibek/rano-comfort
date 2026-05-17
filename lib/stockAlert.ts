export async function sendStockAlert(product: {
  id: number
  name: string
  stock: number
  category: string
}) {
  const token  = process.env.TELEGRAM_STOCK_BOT_TOKEN
  const chatId = process.env.TELEGRAM_STOCK_CHAT_ID

  if (!token || !chatId) return

  const emoji = product.stock === 0 ? '🔴' : '🟡'
  const status = product.stock === 0 ? 'Закончился!' : `Осталось ${product.stock} шт.`

  const message = `
${emoji} *Низкий остаток товара*

📦 *${product.name}*
🏷️ Категория: ${product.category}
📊 Остаток: *${status}*

🔗 [Пополнить остаток](https://rano-comfort.vercel.app/admin/products/${product.id}/edit)
  `.trim()

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    chatId,
        text:       message,
        parse_mode: 'Markdown',
      }),
    })
  } catch (error) {
    console.error('Stock alert error:', error)
  }
}