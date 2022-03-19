import { useContext } from "react";
// kill me
import { CurrentUserContext } from "../../Main/Contexts.js";

export const EmailPrefs = (props) => {
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { security, setSecurity } = props.securityCtx;
	const { reminders, setReminders } = props.remindersCtx;

	function change(e, setState, confDis = null) {
		var checked = e.target.checked;
		if (confDis && !checked) {
			var confirm = window.confirm(confDis);
			if (!confirm) return e.preventDefault();
		}
		setState(checked);
	}
	return (
		<>
			<h3 style={{ marginTop: 0 }}>{_user.email}</h3>

			<div className="toggleBundle">
				<div className="switchBundle">
					<p>
						<i className="fas fa-shield-alt"></i> Security Alerts
					</p>
					<label className="accSwitch">
						<input
							type="checkbox"
							onClick={(e) => change(e, setSecurity)}
							defaultChecked={security}
						/>
						<span className="slider"></span>
					</label>
				</div>
				<p className="optDesc">
					Updates and suspicious activity related to your account.
				</p>
			</div>
			<div className="toggleBundle">
				<div className="switchBundle">
					<p>
						<i className="fas fa-bell"></i> Reminders{" "}
						<span className="wip">WIP</span>
					</p>
					<label className="accSwitch">
						<input
							type="checkbox"
							onClick={(e) => change(e, setReminders)}
							defaultChecked={reminders}
						/>
						<span className="slider"></span>
					</label>
				</div>
				<p className="optDesc">
					Automated email reminders about your upcoming payments or
					arrangements.
				</p>
			</div>
			<div className="toggleBundle">
				<div className="switchBundle">
					<p>
						<i className="fas fa-newspaper"></i> Newsletter{" "}
						<span className="wip">WIP</span>
					</p>
					<label className="accSwitch">
						<input type="checkbox" disabled />
						<span className="slider"></span>
					</label>
				</div>
				<p className="optDesc">
					Occasional quotes, announcements, exclusive content, etc..
				</p>
			</div>
		</>
	);
};

export default EmailPrefs;
