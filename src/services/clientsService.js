import axios from "axios";
import { fSettings } from "../fSettings";

// const apiUrl = "https://gonz9training.com/api/clients";
const apiUrl = `${fSettings.serverDomain}/api/clients`;

const auth = axios.create({ withCredentials: true });

export async function fetchToken() {
	return auth.get(`${apiUrl}/token`);
}

export async function postPlan(token, user_id, plan) {
	return auth.put(`${apiUrl}/plan/${user_id}`, plan, {
		headers: { "x-token": token },
	});
}

// for contact form
export async function postInquiry(_json) {
	return axios.post(`https://formspree.io/f/mvojroqv`, _json);
}
// for consultation form
export async function postConsultation(_json) {
	return axios.post(`https://formspree.io/f/xbjvyjkb`, _json);
}

// create a new invite code for signups, trainers only
export async function requestInviteCode(token) {
	return axios.get(`${apiUrl}/invite`, {
		headers: { "x-token": token },
	});
}
// get all invite codes from the database, trainers only
export async function fetchInvites(token) {
	return axios.get(`${apiUrl}/invites`, {
		headers: { "x-token": token },
	});
}

export async function updateEmailPrefs(token, user_id, prefs) {
	return axios.post(`${apiUrl}/emprefs/${user_id}`, prefs, {
		headers: { "x-token": token },
	});
}
// add email verification link to database and send to email
export async function requestEmailLink(email) {
	return axios.get(`${apiUrl}/verify/${email}`);
}
// validate verification link in database
export async function verifyEmailLink(token) {
	return axios.post(`${apiUrl}/verify/${token}`, {
		emailToken: token,
	});
}
// add password reset link to database and send to email
export async function requestPassReset(email) {
	const res = await axios.get(`${apiUrl}/forgotpass/${email}`);
	return res;
}
// validate reset link in database and reset password
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

// clear refresh token
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
