import { getSessions } from "../../services/sessionServices";
import { useContext, useEffect, useState } from "react";
import {
	CurrentUserContext,
	prevSessionsContext,
	sessionsContext,
	xTokenContext,
} from "../Main/Contexts";
import SessionItem from "./SessionItem";
function Arrangements(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	// this context is alternatively used for every session the trainer must confirm
	// if the _user is a client, it's used for their upcoming sessions (pending/approved)
	const { sessions, setSessions } = useContext(sessionsContext);
	// this context is alternatively used for pending sessions if the _user is a trainer!
	// if the _user is just a client, it's used for their history of sessions
	// !!! i should really start using Redux to avoid this chaotic mess !!!
	const { pastSessions, setPastSessions } = useContext(prevSessionsContext);
	const [hide, setHide] = useState(false);
	useEffect(() => {
		if (!xToken) return;
		// should probably compensate for errors...
		if (!props.trainer) {
			if (props.primary) {
				getSessions("upcoming", _user._id, xToken).then((s) => {
					console.log("server returned", s);
					// if no message key, it's probably the list of sessions!
					if (!s.message) setSessions(s);
				});
			} else if (props.secondary) {
				getSessions("past", _user._id, xToken).then((s) => {
					console.log("server returned", s);
					// if no message key, it's probably the list of sessions!
					if (!s.message) setPastSessions(s);
				});
			}
		} else {
			if (props.secondary) {
				// pending sessions awaiting approval from the trainer
				getSessions("pending", null, xToken).then((s) => {
					console.log("server returned", s);
					// if no message key, it's probably the list of sessions!
					if (!s.message) {
						setPastSessions(s);
					}
				});
			} else {
				// past sessions awaiting confirmation of attendance
				getSessions("confirming", null, xToken).then((s) => {
					console.log("server returned", s);
					// if no message key, it's probably the list of sessions!
					if (!s.message) {
						setSessions(s);
					}
				});
			}
		}
	}, []);
	useEffect(() => {
		if(props.primary)
		{
			if(!Object.entries(sessions).length) setHide(true);
			else setHide(false);
		}
		else if(props.secondary)
		{
			if(!Object.entries(pastSessions).length) setHide(true);
			else setHide(false);
		}
	}, [sessions, pastSessions]);
	// called when the trainer wants to update the status of a client's session
	// only affects the frontend, backend calls are made through the child components
	function settle_session(sessionId, changes, pending = false) {
		// look for the index of the session that is to be changed
		const seshIndex = (!pending ? sessions : pastSessions).findIndex(
			(sesh) => sesh._id === sessionId
		);
		if (seshIndex == -1) return console.log("no session index found!");
		// copy the correct state
		var _sessions = !pending ? sessions : pastSessions;
		// apply the requested changes
		_sessions[seshIndex] = { ..._sessions[seshIndex], ...changes };
		// override state with the copy ^
		if (!pending) setSessions([..._sessions]);
		else setPastSessions([..._sessions]);
	}
	// called after a session status has been updated and the backend call was made
	function dismiss_session(sessionId, pending = false) {
		// look for the index of the session that is to be removed
		const seshIndex = (!pending ? sessions : pastSessions).findIndex(
			(sesh) => sesh._id === sessionId
		);
		if (seshIndex == -1) return console.log("no session index found!");
		// copy the correct state
		var _sessions = !pending ? sessions : pastSessions;
		// remove the session from the copy, it no longer requires attention
		_sessions.splice(seshIndex, 1);
		// save the new state
		if (!pending) setSessions([..._sessions]);
		else setPastSessions([..._sessions]);
	}
	return (
		<div className="arrangements" style={{ display: hide ? "none" : null }}>
			{!props.trainer ? (
				<div id="arrangements">
					<h1>{props.primary ? "Upcoming" : "Previous"} Arrangements</h1>
					<h3>{props.primary ? "Descending" : "Ascending"}</h3>
				</div>
			) : (
				<div id="arrangements">
					<h1>Attention Needed</h1>
					{!props.secondary ? (
						<h3>These arrangements have passed, how did they go?</h3>
					) : (
						<h3>Clients are requesting your services.</h3>
					)}
				</div>
			)}
			<div className="sessionList">
				{!props.secondary
					? Object.entries(sessions).length > 0 &&
					  sessions
							.sort((a, b) => (a.sessionDate > b.sessionDate ? 1 : -1))
							.map((sesh, i) => (
								<SessionItem
									key={i}
									data={sesh}
									reviewing={_user.trainer}
									settler={settle_session}
									dismisser={dismiss_session}
								/>
							))
					: Object.entries(pastSessions).length > 0 &&
					  pastSessions
							.sort((a, b) => (a.sessionDate < b.sessionDate ? 1 : -1))
							.map((sesh, i) => (
								<SessionItem
									key={i}
									data={sesh}
									reviewing={_user.trainer}
									approving
									settler={settle_session}
									dismisser={dismiss_session}
								/>
							))}
			</div>
			{/* {!props.trainer && (
				<div>
					<h1>Past Arrangements</h1>
					<h3>Ascending</h3>
					<div className="sessionList">
						{pastSessions &&
							Object.entries(pastSessions).length > 0 &&
							pastSessions
								.sort((a, b) => (a.sessionDate < b.sessionDate ? 1 : -1))
								.map((sesh, i) => <SessionItem key={i} data={sesh} />)}
					</div>
				</div>
			)} */}
		</div>
	);
}

export default Arrangements;
