import { jwtDecode } from "jwt-decode"
import { ReadCookie } from "../../components/ReadCookie"

const at: string | null  = ReadCookie('access_token')

export const userId: number = at ? Number(jwtDecode(at).sub) : 0

//TODO NOT SURE ABOUT THIS