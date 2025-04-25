import { encodeBase64 } from '~/utilities/base64.utils';

const domain = process.env.DOMAIN || 'http://localhost:4440';
const authDomain = process.env.AUTH_DOMAIN || 'https://auth.sleaf.dev/login';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { locale, theme, clientId } = body;
    try {
        return { status: 'OK', link: `${authDomain}?data=${encodeBase64(JSON.stringify({
            locale: locale,
            theme: theme,
            clientId: clientId,
            redirectUrl: `${domain}/login/`
        }))}` };
    } catch (error) {
        return { status: 'ERR', link: '' };
    }
});

