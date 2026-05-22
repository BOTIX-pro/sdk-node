import type {
    ContactsApi,
    ContactsApiContactsListRequest,
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
}
