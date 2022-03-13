import axios from "axios";
import { fSettings } from "../fSettings";

// const apiUrl = "https://gonz9training.com/api/clients";
const apiUrl = `${fSettings.serverDomain}/api/clients`;

const auth = axios.create({ withCredentials: true });

export async function fetchToken() {
	return auth.get(`${apiUrl}/token`);
}

export async function requestEmailLink(email) {
	return axios.get(`${apiUrl}/verify/${email}`);
}
export async function verifyEmailLink(token) {
	return axios.post(`${apiUrl}/verify/${token}`, {
		emailToken: token,
	});
}
export async function requestPassReset(email) {
	const res = await axios.get(`${apiUrl}/forgotpass/${email}`);
	return res;
}
export async function resetPassword(password, token) {
	return await axios.post(`${apiUrl}/forgotpass/${token}`, {
		password: password,
	});
}
// find client by provided ID
export async function getClient(id, token) {
	const req = await auth.get(`${apiUrl}/find/${id}`, {
		headers: { "x-token": token },
	});
	return req.data;
}
// update client in database
export async function updateClient(id, changes, token) {
	return auth.put(`${apiUrl}/${id}`, changes, {
		headers: { "x-token": token },
	});
}
// get all clients from database, trainers only
export async function fetchClients(token) {
	const req = await auth.get(`${apiUrl}`, {
		headers: { "x-token": token },
	});
	return req.data;
}

export async function logout(_credentials) {
	return await auth.post(`${apiUrl}/logout`, _credentials);
}

// create a new account on the database
export async function registerClient(_account) {
	return auth.post(apiUrl, _account);
}

export async function loginClient(_credentials) {
	return auth.post(`${apiUrl}/login`, _credentials);
}
