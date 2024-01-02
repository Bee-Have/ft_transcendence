/**
 * Function that check if a cookie set in parameter's function exists and send back its value, if it does not exist, send null instead.
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

/**
 * Remove a cookie by its name given as function's parameter if it exists. returns nothing.
 * @param name
 */
export function deleteCookie(name: string)
{
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match)
    {
        document.cookie = name + "=; SameSite=strict; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    }
}