import { randomInt, randomUUID } from "node:crypto";

export default defineEventHandler(async (event) => {
    try {
        let clientId = getCookie(event, 'clientId')?.toString();
        if (clientId && (clientId?.length || 0) < 20) {
            clientId = randomUUID().toString() + new Date() + randomInt(9999);
            setCookie(event, 'clientId', clientId)
        }
        return { status: 'OK', clientId: clientId || '' };
    } catch (error) {
        return { status: 'ERR', clientId: '' };
    }
});

