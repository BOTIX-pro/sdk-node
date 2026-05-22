import type {
    ContactWritable,
    DefaultApi,
    DefaultApiPublicV1ContactsGetRequest,
} from '../generated/api';

export class ContactsResource {
    constructor(private readonly api: DefaultApi) {}

    list(params: DefaultApiPublicV1ContactsGetRequest = {}) {
        return this.api.publicV1ContactsGet(params);
    }

    get(id: number) {
        return this.api.publicV1ContactsIdGet({ id });
    }

    create(body: ContactWritable) {
        return this.api.publicV1ContactsPost({ contactWritable: body });
    }

    update(id: number, body: ContactWritable) {
        return this.api.publicV1ContactsIdPut({ id, contactWritable: body });
    }

    delete(id: number) {
        return this.api.publicV1ContactsIdDelete({ id });
    }

    addTag(id: number, tag: string) {
        return this.api.publicV1ContactsIdTagsPost({
            id,
            publicV1ContactsIdTagsPostRequest: { tag },
        });
    }

    removeTag(id: number, tag: string) {
        return this.api.publicV1ContactsIdTagsTagDelete({ id, tag });
    }
}
