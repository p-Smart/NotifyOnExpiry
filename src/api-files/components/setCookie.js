import { serialize } from 'cookie';


const setCookie = (res, key, value) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400,
        path: '/',
        sameSite: 'strict',
    };
    const cookie = serialize(key, value, cookieOptions);
    return res.setHeader('Set-Cookie', cookie);
}

export default setCookie