import { useContext, useState } from "react";
import { logout } from "../../../services/clientsService";
import { CurrentUserContext, xTokenContext } from "../../Main/Contexts.tsx";
import EmailPanel from "../EmailPrefs/EmailPanel.tsx";
import "./AccPrefs.scss";
function AccPrefs(props) {
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { xToken, setXToken } = useContext(xTokenContext);
	const [show, setShow] = useState(false);
	return (
		<>
			<div className="logActions">
				<p>
					Logged in as <b>{_user.email}</b>
				</p>
				<button onClick={() => setShow(!show)}>
					<i className="fas fa-user-cog"></i> Settings
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
			{show && (
				<div className="cmodal accPrefsModal">
					<div className="sections">
						<button>Email</button>
						<button>Security</button>
					</div>
					<div className="section">
						<EmailPanel />
					</div>
				</div>
			)}
		</>
	);
}

export default AccPrefs;
