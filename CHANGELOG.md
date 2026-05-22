# Changelog

Все значимые изменения этого пакета документируются в данном файле.
Формат соответствует [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/),
версионирование — [Semantic Versioning](https://semver.org/lang/ru/).

## [1.1.0] — 2026-05-22

### Added
- 3 новых bulk endpoint: `contacts.bulkCreate`, `contacts.bulkUpdate`, `messages.bulkSend` (до 100 операций за запрос, частичный успех).
- Параметр `cursor` в 12 list-методах (cursor-based пагинация параллельно с существующим `page`).
- Поле `meta.next_cursor` в response list-методов.
- Описание заголовков `X-RateLimit-Limit/Remaining/Reset` (во всех ответах) и `Retry-After` (в 429).
- Автогенерация `Idempotency-Key` распространена на 3 новых bulk endpoint.

### Changed
- Регенерация на `openapi.yaml` v1.1.0.
- User-Agent по умолчанию: `BOTIX-SDK-Node/1.0.0` → `BOTIX-SDK-Node/1.1.0`.

## [1.0.0] — 2026-05-22

### Added
- Первый публичный релиз.
- Поддержка всех 21 endpoint Public API BOTIX V1 (контакты, сообщения, чаты, сценарии, каналы, webhooks, служебные).
- Класс `BotixClient` с инициализацией в одну строку (`new BotixClient(apiKey)`).
- Хелпер `verifyWebhook(rawPayload, signature, secret)` — HMAC-SHA256 + `timingSafeEqual`.
- Автогенерация заголовка `Idempotency-Key` для POST `/messages` и POST `/scenarios/{id}/run`.
- Полные TypeScript-типы из OpenAPI-спецификации.
- Поддержка ESM и CommonJS.
- Примеры использования в `examples/`.
- CI на матрице Node.js 18 / 20 / 22.
