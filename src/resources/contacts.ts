import type {
    ContactsApi,
    ContactsApiContactsListRequest,
    ContactsBulkCreateRequest,
    ContactsBulkUpdateRequest,
    ContactWritable,
} from '../generated/api';

export class ContactsResource {
    constructor(private readonly api: ContactsApi) {}

    list(params: ContactsApiContactsListRequest = {}) {
        return this.api.contactsList(params);
    }

    get(id: number) {
        return this.api.contactsGet({ id });
    }

    create(body: ContactWritable) {
        return this.api.contactsCreate({ contactWritable: body });
    }

    update(id: number, body: ContactWritable) {
        return this.api.contactsUpdate({ id, contactWritable: body });
    }

    delete(id: number) {
        return this.api.contactsDelete({ id });
    }

    addTag(id: number, tag: string) {
        return this.api.contactsAddTag({
            id,
            contactsAddTagRequest: { tag },
        });
    }

    removeTag(id: number, tag: string) {
        return this.api.contactsRemoveTag({ id, tag });
    }

    /**
     * Массовое создание контактов (до 100 за один запрос). Сервер допускает
     * частичный успех — в ответе для каждой записи возвращается `id` либо `error`.
     * Заголовок `Idempotency-Key` проставляется автоматически, если не передан явно.
     */
    bulkCreate(body: ContactsBulkCreateRequest, idempotencyKey?: string) {
        return this.api.contactsBulkCreate({
            contactsBulkCreateRequest: body,
            idempotencyKey,
        });
    }

    /**
     * Массовое обновление контактов (до 100 за один запрос). Каждый item — пара
     * `{ id, fields }`. Допустим частичный успех; формат ответа аналогичен
     * `bulkCreate`. Заголовок `Idempotency-Key` проставляется автоматически.
     */
    bulkUpdate(body: ContactsBulkUpdateRequest, idempotencyKey?: string) {
        return this.api.contactsBulkUpdate({
            contactsBulkUpdateRequest: body,
            idempotencyKey,
        });
    }
}
