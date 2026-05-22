# Migration guide — BOTIX SDK for Node.js

Этот документ описывает миграцию между мажорными версиями npm-пакета `@botix/sdk`.

На текущий момент опубликована только версия **1.0.0** — миграции не требуются. Установите пакет и используйте по [README](README.md):

```bash
npm install @botix/sdk
# или
yarn add @botix/sdk
# или
pnpm add @botix/sdk
```

## Будущие миграции

При выпуске версии **2.0.0** здесь появится раздел `## 1.x → 2.x` с пошаговой схемой:

- список breaking changes (удалённые / переименованные классы, методы, типы);
- diff конфигурации клиента (`Botix.Client` — конструктор, опции таймаута, fetch-адаптер);
- обновление TypeScript-типов и enum-литералов;
- замена устаревших импортов (ESM/CJS-варианты);
- инструкция по работе старых и новых вызовов параллельно в период деприкации.

## Как мы выпускаем мажорные обновления

- Семантическое версионирование SemVer 2.0.0 — breaking changes только в мажорной версии.
- Анонс мажора — за **минимум 12 месяцев** до отключения предыдущей.
- Уведомления приходят через [/changelog](https://developers.botix.pro/changelog) и заголовок `X-API-Deprecation` в ответах текущей мажорной версии API.
- Версия SDK выпускается независимо от мажора API, но обычно совпадает по номеру: SDK `1.x.y` работает с API `v1`.

Подробнее — [политика версионирования API](https://developers.botix.pro/versioning).

## Поддержка

- Документация SDK: [README.md](README.md), [examples/](examples/)
- Issue tracker: [github.com/BOTIX-pro/sdk-node/issues](https://github.com/BOTIX-pro/sdk-node/issues)
- Контакт: `info@botix.pro`
