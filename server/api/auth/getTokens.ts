import axios from "axios";
import Token from "../interfaces/Token";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { serviceCode } = body;
    try {
        let clientId = getCookie(event, 'clientId')?.toString();
        if (!clientId) { return { status: 'NO_CLIENT_ID' }; }
        const tokens = await axios.put('https://auth.sleaf.dev/api/getToken', {
            serviceCode: serviceCode,
            clientId: clientId
        }).catch((error) => {
            return error.response;
        });
        const tokensData: Token = tokens.data.token;
        if (tokensData) { setCookie(event, 'token', JSON.stringify(tokensData)); }
        return { status: 'OK', clientId: '' };
    } catch (error) {
        return { status: 'ERR', clientId: '' };
    }
});

