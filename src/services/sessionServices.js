import axios from "axios";
import { fSettings } from "../fSettings";

// const apiUrl = "https://gonz9training.com/api/sessions";
const apiUrl = `${fSettings.serverDomain}/api/sessions`;

export async function getPending(client_id) {
	//return axios.get(apiUrl);
	const data = await axios.get(apiUrl + client_id);
	return data;
}
export async function getSessions(request, client_id, token) {
	return axios.get(`${apiUrl}/${request}/${client_id}`, {
		headers: { "x-token": token },
		withCredentials: true,
	});
}

export async function postSession(session, token) {
	return axios.post(apiUrl, session, {
		headers: { "x-token": token },
		withCredentials: true,
	});
}

export async function updateSession(sessionId, changes, reimburse, token) {
	return axios.put(`${apiUrl}/${sessionId}/${reimburse}`, changes, {
		headers: { "x-token": token },
		withCredentials: true,
	});
}