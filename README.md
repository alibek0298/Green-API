# Тестовое задание на должность "Разработчик NodeJS"

В рамках выполнения тестового задания требуется разработать механизм асинхронной обработки HTTP запросов и опубликовать исходники проекта на Github для дальнейшего анализа и проверки. Время на выполнение задания: 3 дня.

## Требования:

1. Разработать механизм асинхронной обработки HTTP запросов
2. Использовать стек NodeJS, RabbitMQ
3. Оформить в виде репозитория на Github
4. Приложить инструкцию по локальному развертыванию проекта
5. Реализовать логирование для целей отладки и мониторинга
6. Разработать микросервис М1 для обработки входящих HTTP запросов
7. Разработать микросервис М2 для обработки заданий из RabbitMQ
8. Имитировать задержку обработки задания продолжительностью 5 секунд
9. На вход системы подавать числовой параметр, а в качестве ответа получать удвоенное значение переданного параметра. Например, при передаче числа 5 ожидается получить в ответ число 10.
10. Опубликовать разработанный сервис в Интернете для приема входящих POST запросов (желательно).

## Алгоритм работы:

1. Отправляем HTTP POST запрос на заданный URL.
2. Получаем HTTP запрос на уровне микросервиса М1.
3. Транслируем HTTP запрос в очередь RabbitMQ. Запрос трансформируется в задание.
4. Обрабатываем задание микросервисом М2 из очереди RabbitMQ в течение 5 секунд.
5. Помещаем результат обработки задания в RabbitMQ.
6. Возвращаем результат HTTP запроса как результат выполнения задания из RabbitMQ.

## Инструкция по развертыванию:

### Шаг 1: Запуск приложения

```bash
docker-compose up -d
```

### Шаг 2: Использование

```bash
http://localhost:3000
```
