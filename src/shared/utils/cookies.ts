export const cookie = {
    set: (
        name: string,
        value: string,
        days?: number,
        path = '/',
        domain = '.youtube.com'
    ) => {
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
            value
        )}; path=${path}`;
        if (domain) {
            cookieStr += `; domain=${domain}`;
        }
        if (typeof days === 'number') {
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            cookieStr += `; expires=${expires}`;
        }
        document.cookie = cookieStr;
    },

    get: (name: string): string | null =>
        document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
            ?.split('=')[1] || null,

    remove: (name: string, path = '/') => {
        document.cookie = `${encodeURIComponent(
            name
        )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    },
};
