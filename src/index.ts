/**
 * @botix/sdk — официальный Node.js клиент для публичного API BOTIX.
 *
 * Документация: https://developers.botix.pro
 * Маркетинговая страница: https://botix.pro/developers
 * Репозиторий: https://github.com/BOTIX-pro/sdk-node
 */

export { BotixClient, DEFAULT_BASE_URL } from './client';
export type { ClientOptions } from './client';
export { verifyWebhook } from './webhook';

export * from './generated/api';
export { Configuration } from './generated/configuration';
export type { ConfigurationParameters } from './generated/configuration';

/** Текущая версия SDK. Совпадает с `package.json.version`. */
export const version = '1.0.0';
