import axios, { type AxiosInstance } from 'axios';

import { Configuration } from './generated/configuration';
import {
    ChannelsApi,
    ChatsApi,
    ContactsApi,
    MessagesApi,
    ScenariosApi,
    SystemApi,
    WebhooksApi,
} from './generated/api';

import { installIdempotencyInterceptor } from './idempotency';
import { verifyWebhook } from './webhook';

import { ChannelsResource } from './resources/channels';
import { ChatsResource } from './resources/chats';
import { ContactsResource } from './resources/contacts';
import { MeResource } from './resources/me';
import { MessagesResource } from './resources/messages';
import { ScenariosResource } from './resources/scenarios';
import { WebhooksResource } from './resources/webhooks';

export const DEFAULT_BASE_URL = 'https://api.botix.pro';

export interface ClientOptions {
    /** Альтернативная базовая URL — для разработки или enterprise-инсталляции. */
    baseUrl?: string;
    /** Тайм-аут запроса в миллисекундах. По умолчанию 30 000. */
    timeout?: number;
    /** Свой axios-инстанс — для интеграции с существующими перехватчиками. */
    axiosInstance?: AxiosInstance;
    /** Отключить авто-генерацию заголовка `Idempotency-Key`. По умолчанию `false`. */
    disableIdempotency?: boolean;
    /** Пользовательский префикс User-Agent для трассировки в логах сервера. */
    userAgent?: string;
}

export class BotixClient {
    readonly contacts: ContactsResource;
    readonly messages: MessagesResource;
    readonly chats: ChatsResource;
    readonly scenarios: ScenariosResource;
    readonly channels: ChannelsResource;
    readonly webhooks: WebhooksResource;
    readonly me: MeResource;

    /** Базовая URL, к которой идут запросы. */
    readonly baseUrl: string;
    /** Inner axios-инстанс. Доступен для продвинутых сценариев (свои interceptors). */
    readonly axios: AxiosInstance;

    private readonly removeIdempotency: () => void;

    constructor(apiKey: string, options: ClientOptions = {}) {
        if (typeof apiKey !== 'string' || apiKey.length === 0) {
            throw new TypeError('BotixClient: apiKey должен быть непустой строкой');
        }

        this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');

        this.axios = options.axiosInstance ?? axios.create({
            timeout: options.timeout ?? 30_000,
        });

        const userAgent = options.userAgent ?? 'BOTIX-SDK-Node/1.1.0';
        this.axios.interceptors.request.use((config) => {
            const headers = config.headers as { set?: (n: string, v: string) => void } & Record<string, unknown>;
            if (headers && typeof headers.set === 'function') {
                headers.set('User-Agent', userAgent);
            } else if (headers) {
                headers['User-Agent'] = userAgent;
            }
            return config;
        });

        const configuration = new Configuration({
            accessToken: apiKey,
            basePath: this.baseUrl,
        });

        const apiArgs = [configuration, this.baseUrl, this.axios] as const;

        this.contacts = new ContactsResource(new ContactsApi(...apiArgs));
        this.messages = new MessagesResource(new MessagesApi(...apiArgs));
        this.chats = new ChatsResource(new ChatsApi(...apiArgs));
        this.scenarios = new ScenariosResource(new ScenariosApi(...apiArgs));
        this.channels = new ChannelsResource(new ChannelsApi(...apiArgs));
        this.webhooks = new WebhooksResource(new WebhooksApi(...apiArgs));
        this.me = new MeResource(new SystemApi(...apiArgs));

        this.removeIdempotency = options.disableIdempotency
            ? () => {}
            : installIdempotencyInterceptor(this.axios);
    }

    /**
     * Снимает все установленные клиентом interceptors с axios-инстанса.
     * Нужен только если разработчик передал свой `axiosInstance` и хочет
     * вернуть его в исходное состояние.
     */
    dispose(): void {
        this.removeIdempotency();
    }

    /**
     * Проверка HMAC-SHA256 подписи входящего webhook.
     * Делегирует в standalone-функцию {@link verifyWebhook}.
     */
    verifyWebhook(
        rawPayload: Buffer | string,
        signature: string,
        secret: string,
    ): boolean {
        return verifyWebhook(rawPayload, signature, secret);
    }

    /** То же, что и метод инстанса — для удобства без создания клиента. */
    static verifyWebhook(
        rawPayload: Buffer | string,
        signature: string,
        secret: string,
    ): boolean {
        return verifyWebhook(rawPayload, signature, secret);
    }
}
