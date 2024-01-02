/**
 * Function that check if a cookie set in parameter's function exists and send back it's value, if it does not exist, send null instead.
 * @param name
 */
export function getCookieValue(name: string) : string | null
{
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match)
    {
        return match[2];
    }
    return null;
}

