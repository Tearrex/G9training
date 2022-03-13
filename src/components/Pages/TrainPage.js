import { useContext, useEffect, useState } from "react";

import "../../styles/accounts.scss";

import Calendar from "../Calendar/Calendar";
import {
	attemptLoginContext,
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
import ClientsBoard from "../AccountManagement/ClientsBoard";
import VerifyWidget from "../AccountManagement/VerifyWidget";

function TrainPage() {
	const { attemptedLogin, setAttemptedLogin } = useContext(attemptLoginContext);
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const [clients, setClients] = useState([]);
	const [_date, _setDate] = useState(null);
	const [dismiss, setDismiss] = useState(true);

	const [sessions, setSessions] = useState([]);
	const [pastSessions, setPastSessions] = useState([]);
	useEffect(() => {
		// here we attempt to ask the server for an access token
		// if the client has a refresh token, they will be logged in
		if (!attemptedLogin && !xToken) {
			fetchToken().then((s) => {
				console.log("token:", s);
				if (s && s.token) {
					// server returned an access token, save in memory
					setXToken(`Bearer ${s.token}`);
					// now that the client is logged in, retrieve their profile data
					getClient(s.clientID, `Bearer ${s.token}`).then((s) => {
						_setUser(s);
					});
				}
			});
			setAttemptedLogin(true);
		}
	}, [attemptedLogin]);
	useEffect(() => {
		if (_user) console.log("User is now", _user);
	}, [_user]);
	return (
		<DateContext.Provider value={{ _date, _setDate }}>
			<div className="warnBanner">
				<h3>⚠️ Test Phase</h3>
				<p>
					A page refresh should fix any bugs you find.
					<br />
					Might go down for maintenance periodically.
				</p>
			</div>
			{attemptedLogin && !xToken && !_user && <LoginForm />}
			<div id="centerPage">
				{_user && (
					<div className="logActions">
						<p>
							Logged in as <b>{_user.email}</b>
						</p>
						<button
							className="logout"
							onClick={async () => {
								_setUser(null);
								setXToken(null);
								await logout(_user);
							}}
						>
							<i class="fas fa-sign-out-alt"></i> Log Out
						</button>
					</div>
				)}
				{_user && !_user.verified && <VerifyWidget />}
				{_user && !_user.trainer && <ClientPanel />}
				<clientsContext.Provider value={{ clients, setClients }}>
					<prevSessionsContext.Provider
						value={{ pastSessions, setPastSessions }}
					>
						<sessionsContext.Provider value={{ sessions, setSessions }}>
							<ScheduleDismissContext.Provider value={{ dismiss, setDismiss }}>
								<Calendar />
							</ScheduleDismissContext.Provider>
							{_user && xToken && (
								<Arrangements trainer={_user.trainer} primary />
							)}
							{_user && xToken && (
								<Arrangements trainer={_user.trainer} secondary />
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
