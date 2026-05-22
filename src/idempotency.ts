import { randomUUID } from 'node:crypto';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Идемпотентные endpoints публичного API V1 BOTIX. */
const IDEMPOTENT_PATHS: Array<RegExp> = [
    /\/public\/v1\/messages\b/,
    /\/public\/v1\/scenarios\/\d+\/run\b/,
];

/**
 * Подключает axios-перехватчик, который автоматически генерирует UUID v4
 * и кладёт его в заголовок `Idempotency-Key` для тех мутирующих запросов,
 * где этот заголовок поддерживается серверной стороной.
 *
 * Если пользователь сам прислал `Idempotency-Key` — он не перетирается.
 *
 * Возвращает функцию-снимок, которая снимает перехватчик. Удобно для тестов
 * и для случая отключения idempotency через `ClientOptions`.
 */
export function installIdempotencyInterceptor(axios: AxiosInstance): () => void {
    const id = axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const method = (config.method ?? 'get').toUpperCase();
        if (!MUTATING_METHODS.has(method)) return config;

        const url = config.url ?? '';
        if (!IDEMPOTENT_PATHS.some((re) => re.test(url))) return config;

        const headers = config.headers;
        if (hasIdempotencyKey(headers)) return config;

        if (typeof (headers as { set?: unknown }).set === 'function') {
            (headers as { set: (n: string, v: string) => void }).set('Idempotency-Key', randomUUID());
        } else {
            (headers as unknown as Record<string, string>)['Idempotency-Key'] = randomUUID();
        }
        return config;
    });
    return () => axios.interceptors.request.eject(id);
}

function hasIdempotencyKey(headers: unknown): boolean {
    if (!headers) return false;
    const candidates = ['Idempotency-Key', 'idempotency-key', 'IDEMPOTENCY-KEY'];

    const h = headers as Record<string, unknown> & {
        get?: (name: string) => unknown;
        has?: (name: string) => boolean;
    };
    if (typeof h.has === 'function') {
        return candidates.some((c) => h.has!(c));
    }
    if (typeof h.get === 'function') {
        return candidates.some((c) => h.get!(c) != null);
    }
    return candidates.some((c) => h[c] != null);
}
