import { useContext, useEffect, useState } from "react";

import "../../styles/accounts.scss";

import Calendar from "../Calendar/Calendar";
import {
	clientsContext,
	CurrentUserContext,
	DateContext,
	prevSessionsContext,
	ScheduleDismissContext,
	sessionsContext,
	xTokenContext,
} from "../Main/Contexts";
import ClientPanel from "../AccountManagement/ClientPanel";
import LoginForm from "../Main/AuthForm";

// REST API
import Arrangements from "../AccountManagement/Arrangements";
import { fetchToken, getClient, logout } from "../../services/clientsService";
import ClientsBoard from "../AccountManagement/CBoard/ClientsBoard";
import VerifyWidget from "../AccountManagement/VerifyWidget";
import InviteBoard from "../AccountManagement/Invites/InviteBoard";
import AccPrefs from "../AccountManagement/Preferences/AccPrefs";

function TrainPage() {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const [clients, setClients] = useState([]);
	const [_date, _setDate] = useState(null);
	const [dismiss, setDismiss] = useState(true);

	const [sessions, setSessions] = useState([]);
	const [pastSessions, setPastSessions] = useState([]);
	useEffect(() => {
		// here we attempt to ask the server for a new access token
		// if the client has a valid refresh token, they will be authenticated
		if (!_user && !xToken) {
			// did we try and fail before?
			var previousAttempt = localStorage.getItem("refreshFail");
			if (previousAttempt) return; // give up on dream
			fetchToken()
				.then((s) => {
					console.log("token:", s);
					if (s.data && s.data.token) {
						const newToken = `Bearer ${s.data.token}`;
						// retrieve client's profile data with new access token
						getClient(s.data.clientID, newToken)
							.then((s) => {
								_setUser(s); // set the current user/client
								setXToken(newToken); // the token worked, save it!
							})
							.catch((e) => {
								// the token might not have worked
								// or the account tied to it no longer exists
							});
					}
				})
				.catch((e) => {
					// refresh token invalid or null
					if (e.response.status === 401) {
						// remember failure and dwell on it until the user logs in
						localStorage.setItem("refreshFail", true);
						console.log(
							"Failed to validate refresh token. Try reauthenticating."
						);
					} else {
						alert(`${e.response.status}: ${e.response.statusText}`);
					}
				});
		}
	}, []);
	useEffect(() => {
		if (_user) console.log("User is now", _user);
	}, [_user]);
	return (
		<DateContext.Provider value={{ _date, _setDate }}>
			{/* {!xToken && !_user && <LoginForm />} */}
			<div id="centerPage">
				{_user && xToken && <AccPrefs />}
				{_user && !_user.verified && <VerifyWidget />}
				{_user && !_user.trainer && <ClientPanel />}
				{_user && _user.trainer && xToken && <InviteBoard />}
				<clientsContext.Provider value={{ clients, setClients }}>
					<prevSessionsContext.Provider
						value={{ pastSessions, setPastSessions }}
					>
						<sessionsContext.Provider value={{ sessions, setSessions }}>
							<ScheduleDismissContext.Provider value={{ dismiss, setDismiss }}>
								<Calendar />
							</ScheduleDismissContext.Provider>
							{_user && xToken && (
								<>
									<Arrangements primary />
									<Arrangements secondary />
								</>
							)}
						</sessionsContext.Provider>
					</prevSessionsContext.Provider>
					{_user && _user.trainer && xToken && <ClientsBoard />}
				</clientsContext.Provider>
			</div>
		</DateContext.Provider>
	);
}

export default TrainPage;
