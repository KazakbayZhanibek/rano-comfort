# 🎨 Инструкция добавления логотипа на сайт

## ✅ Что я уже добавил:

1. ✅ **Метаданные в layout.tsx** — Open Graph теги для Google, Facebook, Twitter
2. ✅ **manifest.json** — для PWA приложения (установка на главный экран)
3. ✅ **robots.txt** — для поисковых роботов SEO

## 📝 Что осталось сделать:

### Шаг 1: Скачай логотип в разных размерах

Используй онлайн-инструмент для конвертации изображения:
- **https://convertio.co/ru/** или **https://cloudconvert.com/**

Нужны эти файлы в папке **`public/`**:

| Файл | Размер | Назначение |
|------|--------|-----------|
| `logo.png` | 1200x1200 px | Соцсети (Open Graph) |
| `apple-touch-icon.png` | 180x180 px | iOS (при добавлении на главный экран) |
| `icon-192x192.png` | 192x192 px | Android PWA |
| `icon-512x512.png` | 512x512 px | Android PWA (большой размер) |
| `favicon.ico` | 32x32 px | Вкладка браузера |

### Шаг 2: Конвертация в favicon.ico

Используй **https://icoconvert.com/** или **https://convertio.co/**:
1. Загрузи логотип как PNG
2. Выбери формат ICO
3. Размер: **32x32 px**
4. Скачай как **favicon.ico**

### Шаг 3: Загрузи все файлы в проект

```
public/
├── logo.png                 ← Для соцсетей
├── favicon.ico              ← Для вкладки браузера ⭐
├── apple-touch-icon.png     ← Для iOS
├── icon-192x192.png         ← Для Android
├── icon-512x512.png         ← Для Android
├── manifest.json            ✅ (уже создан)
└── robots.txt               ✅ (уже создан)
```

### Шаг 4: Проверка

После загрузки файлов:
1. Перезагрузи сайт
2. В браузере вкладка должна показать твой логотип (favicon) ⭐
3. При поделении ссылки в Facebook/WhatsApp — будет видно твой логотип

---

## 🔗 Где будет видно логотип:

✅ **Вкладка браузера** — favicon.ico
✅ **Google результаты поиска** — logo.png (Open Graph)
✅ **Facebook, Instagram, Twitter** — logo.png при поделении ссылки
✅ **iOS Safari** — apple-touch-icon.png
✅ **Android Chrome** — icon-192x192.png или icon-512x512.png
✅ **Telegram, WhatsApp** — logo.png

---

## ⚡ Быстрый способ (если нет времени):

1. Открой **https://icoconvert.com/**
2. Загрузи твой PNG логотип
3. Скачай как **favicon.ico** (32x32)
4. Загрузи в **public/favicon.ico**
5. Всё! Иконка вкладки будет видна сразу

Остальные файлы можно добавить позже.
