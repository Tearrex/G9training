import { useContext, useState, useEffect } from "react";
import { logout, updateEmailPrefs } from "../../../services/clientsService";
import { CurrentUserContext, xTokenContext } from "../../Main/Contexts";
import EmailPrefs from "./EmailPrefs.js";
import "./AccPrefs.scss";
import BillingPrefs from "./BillingPrefs";
import SecurityPrefs from "./SecurityPrefs";
import { useNavigate } from "react-router-dom";
function AccPrefs(props) {
	const navigate = useNavigate();
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { xToken, setXToken } = useContext(xTokenContext);
	const [section, setSection] = useState("email");
	const [show, setShow] = useState(false);

	// are we requesting the user's email prefs from the server?
	const [updating, setUpdating] = useState(true);
	// remember email preference changes
	const [security, setSecurity] = useState(false);
	const [reminders, setReminders] = useState(false);

	// rerender the email toggles when the _user state is updated,
	// in case we changed the key value pair for the preferences
	useEffect(() => {
		var prefs = _user["emailPrefs"];
		if (prefs) {
			// set user's settings
			setSecurity(prefs.security || false);
			setReminders(prefs.reminders || false);
			// show settings button
			setUpdating(false);
		}
	}, [_user]);

	// setup the user's email notification preferences in the database
	// so we know when they would like to be emailed, if at all.
	useEffect(() => {
		// don't proceed if they are already setup
		if (_user["emailPrefs"]) return;
		setTimeout(() => {
			updateEmailPrefs(xToken, _user._id, {
				security: true, // enable security alerts by default
			})
				.then((s) => {
					console.log(s.data);
					_setUser(s.data.changes); // returned object with new changes
				})
				.catch((e) => {
					alert(`${e.response.statusText}: ${e.response.data.message}`);
				});
		}, 2000);
	}, []);
	const sections = {
		email: (
			<EmailPrefs
				securityCtx={{ security, setSecurity }}
				remindersCtx={{ reminders, setReminders }}
			/>
		),
		security: <SecurityPrefs />,
		billing: <BillingPrefs />,
	};

	// display status of the user's API request
	const [message, setMessage] = useState(null);
	// im tired, this will determine the background color
	// true = green, false = red
	const [msgStatus, setMsgStatus] = useState(true);

	// clear the message output after a few seconds
	useEffect(() => {
		if (message) setTimeout(() => setMessage(null), 4000);
	}, [message]);
	// called when the user wants to close the settings modal
	// we also handle saving the user's email settings here
	function close_down() {
		setShow(false); // hide the settings modal
		// check if the user tweaked their email preferences
		var changes = {
			security: security,
			reminders: reminders,
		};
		var prefs = _user["emailPrefs"];
		var shouldUpdate = false; // difference between values?
		if (security !== prefs.security || reminders !== prefs.reminders)
			shouldUpdate = true;
		if (shouldUpdate) {
			updateEmailPrefs(xToken, _user._id, changes)
				.then((s) => {
					_setUser(s.data.changes);
					setMsgStatus(true);
					setMessage("email preferences updated!");
				})
				.catch((e) => {
					// handle the access token error nicely,
					// since im too lazy to make them refresh right now....
					if (e.response.status === 401) {
						setMsgStatus(false);
						return setMessage(e.response.data.message);
					}
					alert(`${e.response.statusText}: ${e.response.data.message}`);
				});
		}
	}
	return (
		<>
			<div className="logActions">
				<p>
					Logged in as <b>{_user.email}</b>
				</p>
				<div className="buttons">
					{!updating && (
						<button onClick={() => setShow(!show)}>
							<i className="fas fa-user-cog"></i> Settings
						</button>
					)}
					<button onClick={() => navigate(`/setup`)}>
						<i className="fas fa-clipboard-list"></i> My Plan
					</button>
					<button
						className="logout"
						onClick={async () => {
							await logout(_user);
							_setUser(null);
							setXToken(null);
							// don't try to auto-login after logging out
							localStorage.setItem("refreshFail", true);
						}}
					>
						<i className="fas fa-sign-out-alt"></i> Log Out
					</button>
				</div>
				{message && (
					<p
						className="prefMessage"
						style={{ color: msgStatus ? "#0f0" : "#f00" }}
					>
						{message}
					</p>
				)}
			</div>
			{show && (
				<>
					<div
						className="bgFade"
						onClick={close_down}
						style={{ zIndex: 20, opacity: 0.7 }}
					></div>
					<div className="cmodal accPrefsModal" style={{ zIndex: 21 }}>
						<div className="sections">
							<button onClick={() => setSection("email")}>Email</button>
							<button
								onClick={() => setSection("security")}
								style={{ opacity: 0.5 }}
								disabled
							>
								Security
							</button>
							<button
								onClick={() => setSection("billing")}
								style={{ opacity: 0.5 }}
								disabled
							>
								Billing
							</button>
						</div>
						<div className="section">
							{sections[section] || <h1>placeholder</h1>}
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default AccPrefs;
