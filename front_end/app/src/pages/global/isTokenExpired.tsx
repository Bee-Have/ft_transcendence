import { jwtDecode } from 'jwt-decode'

function isTokenExpired(token: string): boolean {

	try {
		const decoded = jwtDecode(token)

		if (decoded?.exp && decoded.exp * 1000 < Date.now())
			return true
		return false
	}
	catch(error) {
		return true
	}
}
 
export default isTokenExpired