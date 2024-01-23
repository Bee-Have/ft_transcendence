import { jwtDecode } from "jwt-decode"
import { ReadCookie } from "../../components/ReadCookie"

let at: string | null  = ReadCookie('access_token')

export function resetUserId () {
	at  = ReadCookie('access_token')

	userId = at ? Number(jwtDecode(at).sub) : 0
} 

export let userId: number = at ? Number(jwtDecode(at).sub) : 0

//TODO NOT SURE ABOUT THIS