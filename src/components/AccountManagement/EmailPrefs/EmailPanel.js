import { useContext } from "react";
// kill me
import { CurrentUserContext } from "../../Main/Contexts.tsx";

export const EmailPanel = (props) => {
	const { _user, _setUser } = useContext(CurrentUserContext);
	return (
		<>
			<h3 style={{ marginTop: 0 }}>{_user.email}</h3>

			<div className="toggleBundle">
				<div className="switchBundle">
					<p>
						<i className="fas fa-shield-alt"></i> Security Alerts{" "}
						<span className="green">RECOMMENDED</span>
					</p>
					<label class="accSwitch">
						<input type="checkbox" />
						<span class="slider"></span>
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
					<label class="accSwitch">
						<input type="checkbox" disabled />
						<span class="slider"></span>
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
					<label class="accSwitch">
						<input type="checkbox" disabled />
						<span class="slider"></span>
					</label>
				</div>
				<p className="optDesc">
					Empowering quotes, occasional announcements, exclusive content, etc..
				</p>
			</div>
		</>
	);
};

export default EmailPanel;
