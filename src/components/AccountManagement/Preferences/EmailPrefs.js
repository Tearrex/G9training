import { useContext } from "react";
// kill me
import { CurrentUserContext } from "../../Main/Contexts.js";
import PrefToggle from "./PrefToggle.js";

export const EmailPrefs = (props) => {
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { security, setSecurity } = props.securityCtx;
	const { reminders, setReminders } = props.remindersCtx;
	return (
		<>
			<h3 style={{ marginTop: 0 }}>{_user.email}</h3>

			<div className="toggles">
				<PrefToggle
					icon={<i className="fas fa-shield-alt" />}
					name="Security Alerts"
					desc="Updates and suspicious activity related to your account."
					context={{ state: security, setState: setSecurity }}
				/>
				<PrefToggle
					icon={<i className="fas fa-bell" />}
					name="Reminders"
					desc={
						<>
							Automated email reminders about your upcoming payments or
							arrangements.
						</>
					}
					context={{ state: reminders, setState: setReminders }}
				/>
				<PrefToggle
					icon={<i className="fas fa-newspaper" />}
					name="Newsletter"
					desc="Occasional quotes, announcements, exclusive content, etc.."
					wip
				/>
			</div>
		</>
	);
};

export default EmailPrefs;
