import { randomInt, randomUUID } from "node:crypto";
import { encodeBase64 } from '~/utilities/base64.utils';

export default defineEventHandler(async (event) => {
    try {
        let clientId = getCookie(event, 'clientId')?.toString();
        if (clientId === undefined || (clientId.length || 0) < 20) {
            clientId = randomUUID().toString() + new Date() + randomInt(9999);
        }
        const encodedId = encodeBase64(clientId);
        setCookie(event, 'clientId', encodedId)
        return { status: 'OK', clientId: encodedId };
    } catch (error) {
        console.log('Error on getting clientId', error);
        return { status: 'ERR', clientId: '' };
    }
});

