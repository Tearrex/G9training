import { useContext, useState } from "react";
import {
	CurrentUserContext,
	DateContext,
	ScheduleDismissContext,
	sessionsContext,
	xTokenContext,
} from "../Main/Contexts";

// REST API
import { postSession } from "../../services/sessionServices";

import { useNavigate } from "react-router";

function SessionForm(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { _date, _setDate } = useContext(DateContext);
	const { dismiss, setDismiss } = useContext(ScheduleDismissContext);
	const { sessions, setSessions } = useContext(sessionsContext);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errMessage, setErrMessage] = useState(null);
	const navigate = useNavigate();
	function cancel_selection(e) {
		e.preventDefault();
		_setDate("");
	}
	function set_time(e) {
		var timeInput = e.target.value;
		// not proud of this, but it works....
		var splitInput = String(timeInput).split(":");
		var hourVal = parseInt(splitInput[0]);
		var minuteVal = parseInt(splitInput[1]);

		var date = _date;
		date.setHours(hourVal);
		date.setMinutes(minuteVal);
		_setDate(date);
		console.log(
			"new hour is",
			hourVal,
			"new minute is",
			minuteVal,
			"and date",
			date
		);
	}
	function submit_form(e) {
		e.preventDefault(); // don't let the page reload
		if (_user.sessions === 0) {
			navigate("/services");
			return;
		}
		//var _time = document.getElementById("sessionTime").value;
		var _note = document
			.getElementById("sessionNote")
			.value.replace(/\s+/g, " ");
		// send to the backend
		const _json = {
			clientID: _user._id,
			sessionDate: _date,
			clientNote: _note,
		};
		setLoading(true);
		setTimeout(() => {
			postSession(_json, xToken).then((s) => {
				setLoading(false);
				console.log("server returned", s);
				if (String(s.status).startsWith("4")) {
					setError(true);
					setErrMessage(`${s.statusText}: ${s.data.message}`);
				} else {
					setSessions([...sessions, s]);
					var newUser = _user;
					newUser.sessions -= 1;
					_setUser(newUser);
				}
				setDismiss(false);
				/*var newUser = _user;
				newUser.sessions -= 1;
				_setUser(newUser);*/
			});
		}, 3000);
	}
	function dismiss_prompt() {
		setDismiss(true);
		setError(false);
		_setDate("");
	}
	return (
		<div className="sessionForm" onSubmit={submit_form}>
			{loading && (
				<div className="loadScreen">
					<p>
						<i className="fas fa-spinner"></i> Waiting for server
					</p>
				</div>
			)}
			<form id="sessionForm" style={{ display: !dismiss && "none" }}>
				<h2
					style={{
						display: _user && _user.sessions === 0 && "none",
						color: "#fff",
					}}
				>
					Selected Date:{" "}
					{_date !== "" && String(_date.toLocaleDateString("en-US"))}
				</h2>
				{_user && _user.sessions === 0 && (
					<h2>You don't have session tokens!</h2>
				)}
				{_user && _user.sessions > 0 && (
					<div className="formFields">
						<div className="arrField">
							<label htmlFor="arrangement">Arrangement:</label>
							<select
								name="arrangement"
								id="arrangement"
								onChange={(e) => console.log(e.target.value)}
							>
								<option value="consultation">Free Consultation</option>
								<option value="session">Training Session</option>
							</select>
						</div>
						<div className="timeField">
							<label htmlFor="sessionTime">Preferred time:</label>
							<input
								type="time"
								id="sessionTime"
								name="time"
								required
								onChange={(e) => set_time(e)}
							/>
						</div>
						<div className="infoField">
							<label htmlFor="sessionNote">
								Anything I should know in advance?
							</label>
							<textarea id="sessionNote" rows="4" name="note"></textarea>
						</div>
					</div>
				)}
				<div className="subField">
					<button id="cancel" onClick={cancel_selection}>
						Cancel
					</button>
					<button id="submit">
						{_user && _user.sessions > 0 ? "Confirm" : "Renew?"}
					</button>
				</div>
			</form>
			<div
				className="confirmation"
				style={{ display: !dismiss && !error ? null : "none" }}
			>
				<h1>
					<i className="fas fa-paper-plane"></i> All set!
				</h1>
				<p>
					You've scheduled a <b>session</b> with your coach for{" "}
					<span>{String(_date.toLocaleDateString("en-US"))}</span>
					<br />
					Expect to receive an email confirmation once they review your
					request...
				</p>
				<button onClick={dismiss_prompt}>Okay</button>
			</div>
			<div
				className="confirmation error"
				style={{ display: error ? null : "none" }}
			>
				<h1>
					<i className="fas fa-times"></i> That didn't work
				</h1>
				<p>
					Something went wrong with your request.
					<br />
					Try refreshing the page and booking again...
				</p>
				<p>({errMessage})</p>
				<button onClick={dismiss_prompt}>Okay</button>
			</div>
		</div>
	);
}

export default SessionForm;
