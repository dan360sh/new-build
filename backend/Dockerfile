# Устанавливаем базовый образ Node.js
FROM node:lts-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем остальные файлы приложения в рабочую директорию
COPY . .

# Открываем порт, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложени
CMD ["node", "dist/index.js"]