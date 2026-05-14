# 🔧 Инструкция по внедрению улучшений профиля

## 1️⃣ Обновить Prisma схему

Схема уже обновлена в файле [prisma/schema.prisma](prisma/schema.prisma)

Новые модели добавлены:
- `User` - основная модель пользователя
- `Address` - сохранённые адреса
- `LoyaltyPoints` - система лояльности
- `PasswordHistory` - история паролей

## 2️⃣ Создать миграцию

```bash
npx prisma migrate dev --name add_profile_features
```

Это создаст новую миграцию и применит её к БД.

## 3️⃣ API Endpoints готовы

Все API endpoints уже созданы:

### Адреса
- ✅ [app/api/addresses/route.ts](app/api/addresses/route.ts) - GET/POST
- ✅ [app/api/addresses/[id]/route.ts](app/api/addresses/[id]/route.ts) - PUT/DELETE

### Профиль
- ✅ [app/api/profile/route.ts](app/api/profile/route.ts) - GET/PUT
- ✅ [app/api/profile/avatar/route.ts](app/api/profile/avatar/route.ts) - GET/PUT

### Пароль
- ✅ [app/api/change-password/route.ts](app/api/change-password/route.ts) - POST

## 4️⃣ UI компонент готов

Полностью переработанный компонент профиля:
- ✅ [app/profile/page.tsx](app/profile/page.tsx)

### Включает:
- 6 вкладок (Обзор, Заказы, Адреса, Избранное, Пароль, Настройки)
- Адаптивный дизайн (мобильная + десктопная версия)
- Все новые функции с красивым UI
- Toast-уведомления

## 5️⃣ Дополнительные пакеты

Убедитесь, что установлены:
- `react-hot-toast` (уже в package.json) ✅
- `@heroicons/react` (уже в package.json) ✅
- `@prisma/client` (уже в package.json) ✅

Если нет, установите:
```bash
npm install react-hot-toast @heroicons/react @prisma/client
```

## 6️⃣ Запустить dev сервер

```bash
npm run dev
```

Откройте http://localhost:3000/profile

## 7️⃣ Тестирование

### Мобильная версия
- Откройте DevTools (F12)
- Переключитесь на мобильный вид (iPhone SE)
- Проверьте все вкладки и функции

### Десктопная версия
- Откройте нормально в браузере
- Проверьте боковую панель
- Протестируйте все взаимодействия

## 🎯 Функции для тестирования

### 1. Обзор
- [ ] Видны статистика и контактная информация
- [ ] Видны последние 2 заказа
- [ ] Корректно отображается уровень лояльности

### 2. Заказы
- [ ] Фильтры работают (Все, Новые, В пути, Доставлены)
- [ ] Таблица (десктоп) или карточки (мобильная) отображаются
- [ ] Кнопка "Чек" работает (показывает toast)
- [ ] Цветные статусы видны

### 3. Адреса
- [ ] Видны все адреса
- [ ] Адрес по умолчанию выделен
- [ ] Кнопка добавления адреса работает
- [ ] Форма добавления появляется
- [ ] Кнопка удаления работает (показывает toast)

### 4. Избранное
- [ ] Все товары отображаются
- [ ] Видны цена и объём

### 5. Пароль
- [ ] Кнопка "Изменить пароль" работает
- [ ] Форма появляется
- [ ] Отправка формы показывает toast

### 6. Настройки
- [ ] Выбор языка работает
- [ ] Чекбоксы уведомлений работают
- [ ] Кнопка "Удалить аккаунт" видна в опасной зоне

## 🐛 Возможные проблемы

### Ошибка: "Cannot find module 'react-hot-toast'"
```bash
npm install react-hot-toast
```

### Ошибка Prisma: "Prisma Client not found"
```bash
npx prisma generate
```

### БД не обновилась
```bash
npx prisma migrate deploy
```

### Нужно сбросить БД (будут удалены данные!)
```bash
npx prisma migrate reset
npx prisma db seed
```

## 📊 Примеры тестовых данных

Используются MOCK данные в компоненте:

```typescript
const MOCK_USER = {
  id: 1,
  name: 'Айгерим Сейткали',
  email: 'aigerim@mail.ru',
  phone: '+7 (777) 123-45-67',
  avatar: 'АС',
  joinDate: 'Март 2024',
}

const loyaltyPoints = {
  totalSpent: 11540,
  points: 1154,
  tier: 'silver',
}
```

## 🔌 Интеграция с реальными данными

Когда будете подключать реальные данные:

1. Замените MOCK_USER на `useEffect` с `fetch('/api/profile?userId=1')`
2. Замените MOCK_ADDRESSES на `useEffect` с `fetch('/api/addresses?userId=1')`
3. Замените MOCK_ORDERS на `useEffect` с реальной выборкой из БД
4. Замените функции обработчики на реальные API вызовы

Пример:
```typescript
const [user, setUser] = useState(null)

useEffect(() => {
  fetch('/api/profile?userId=1')
    .then(r => r.json())
    .then(data => setUser(data))
}, [])
```

## 📝 Следующие шаги

1. ✅ Запустить миграцию
2. ✅ Протестировать UI
3. ⏳ Подключить к реальной БД
4. ⏳ Добавить аутентификацию
5. ⏳ Интегрировать загрузку файлов для аватара
6. ⏳ Добавить валидацию на backend
7. ⏳ Протестировать безопасность

---

**Готово к запуску!** 🚀
