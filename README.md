# Bart AI — версия для Vercel

Это не GitHub Pages-проект: браузерная часть + защищённые серверные функции `/api/*`. Для чата нужен Vercel (или другой хостинг с serverless functions). На GitHub Pages запрос `/api/chat` не заработает, потому что Pages не запускает Node.js-функции.

## Уже подключено в коде
- Firebase Web SDK с конфигурацией проекта `bart-9bc5e`.
- Firebase email/password, письмо подтверждения email, вход по телефону/SMS и reCAPTCHA (если включены способы входа в Firebase Console).
- Firestore история чатов и Realtime Database presence.
- Groq chat API через серверный `/api/chat`; ключ хранится только в серверных переменных Vercel.
- Анализ изображений при выборе доступной vision-модели Groq и обработка текстовых файлов.

## Запуск
1. Загрузите файлы репозитория на GitHub.
2. Импортируйте репозиторий в Vercel как Vite-проект.
3. Vercel → Settings → Environment Variables: добавьте `GROQ_API_KEY` (НОВЫЙ ключ после отзыва старого) и `GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct`.
4. Redeploy.
5. Firebase Console → Authentication → Sign-in method: включите Email/Password и Phone. В Authentication → Settings → Authorized domains добавьте домен Vercel.
6. Создайте Firestore Database и примените `firestore.rules`. Для Realtime Database примените `database.rules.json`.

Firebase web config не является секретом доступа сам по себе; безопасность данных обеспечивают Authentication и правила базы. Не помещайте ключи Groq, Alibaba или другие серверные API-ключи в `src.js`, GitHub или публичный `.env`.

## Чего пока нет
- GitHub Pages не подходит для AI API. Используйте Vercel.
- Image generation и web search не подключены: переданный идентификатор SambaNova — это ID модели/ресурса, а не подтверждённый API-ключ и endpoint генерации изображений. Для Alibaba AccessKey нужно проверить, какой именно API-продукт и endpoint включён. Код не должен притворяться, что генерация работает.
- PDF/DOCX: полноценное извлечение текста пока не реализовано.

## Ключи безопасности
Поскольку ранее отправленные Groq, Alibaba и imgbb ключи были раскрыты в переписке, отзовите/пересоздайте их в кабинетах провайдеров. Вставляйте новые значения только в Vercel Environment Variables.
