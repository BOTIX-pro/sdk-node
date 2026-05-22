import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Проверяет HMAC-SHA256 подпись webhook-доставки BOTIX.
 *
 * Порядок проверки:
 * 1. Считается `hmacSha256(rawPayload, secret)` в hex.
 * 2. Сравнение с присланным `signature` через `crypto.timingSafeEqual`
 *    (защита от timing-атак).
 *
 * @param rawPayload — необработанное тело запроса (Buffer/string), ровно
 *                    как пришло на endpoint. Любое перекодирование рушит подпись.
 * @param signature  — значение заголовка `X-Botix-Signature` (hex, 64 символа).
 * @param secret     — секрет подписки, который BOTIX показал один раз при создании.
 */
export function verifyWebhook(
    rawPayload: Buffer | string,
    signature: string,
    secret: string,
): boolean {
    if (typeof signature !== 'string' || signature.length === 0) return false;
    if (typeof secret !== 'string' || secret.length === 0) return false;

    const body = Buffer.isBuffer(rawPayload) ? rawPayload : Buffer.from(rawPayload, 'utf8');
    const expected = createHmac('sha256', secret).update(body).digest('hex');

    const expectedBuf = Buffer.from(expected, 'utf8');
    const providedBuf = Buffer.from(signature, 'utf8');
    if (expectedBuf.length !== providedBuf.length) return false;

    return timingSafeEqual(expectedBuf, providedBuf);
}
