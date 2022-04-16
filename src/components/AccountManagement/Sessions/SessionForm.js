import { useContext, useRef, useState } from "react";
import {
	CurrentUserContext,
	DateContext,
	ScheduleDismissContext,
	sessionsContext,
	xTokenContext,
} from "../../Main/Contexts";

// REST API
import { postSession } from "../../../services/sessionServices";

import { useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
import { fSettings } from "../../../fSettings";
import { postConsultation } from "../../../services/clientsService";

function SessionForm(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { _date, _setDate } = useContext(DateContext);
	const { dismiss, setDismiss } = useContext(ScheduleDismissContext);
	const { sessions, setSessions } = useContext(sessionsContext);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [errMessage, setErrMessage] = useState(null);

	// for consultation form
	const [email, setEmail] = useState("");
	// final step before form submission
	const captchaRef = useRef();
	const [showRecaptcha, setShowRecaptcha] = useState(false);

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
	}
	function submit_form(e) {
		//e.preventDefault(); // don't let the page reload
		if (!dismiss) return; // the captcha component errors out when unmounted, calling multiple times
		var _note = document
			.getElementById("sessionNote")
			.value.replace(/\s+/g, " ");
		setLoading(true);
		setTimeout(() => {
			// user is a guest, schedule consultation
			if (!_user) {
				const _plan = localStorage.getItem("formPlan");
				if (!_plan) {
					return window.alert(
						"A strange error occured. Please refresh the page."
					);
				}
				const _json = {
					email: email,
					date: _date,
					plan: JSON.parse(_plan),
					clientNote: _note,
				};
				postConsultation(_json)
					.then((s) => {
						setMessage(s.data.message);
						setLoading(false);
						setDismiss(false);
						// discourage repeat applications
						localStorage.setItem("inquired", true);
						props.complete(); // disable the calendar again
					})
					.catch((e) => {
						setErrMessage(
							`${e.response.statusText}: ${e.response.data.message}`
						);
						setLoading(false);
						setDismiss(false);
					});
				return;
			}
			const _json = {
				clientID: _user._id,
				sessionDate: _date,
				clientNote: _note,
			};
			// user is logged in, schedule training session
			postSession(_json, xToken).then((s) => {
				setLoading(false);
				console.log("server returned", s);
				if (String(s.status).startsWith("4")) {
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
		setErrMessage(null);
		_setDate("");
	}
	return (
		<div
			className="sessionForm themeBackMid"
			onSubmit={(e) => {
				e.preventDefault();
				setShowRecaptcha(true);
			}}
		>
			{loading && (
				<div className="loadScreen">
					<p>
						<i className="fas fa-spinner"></i> Waiting for server
					</p>
				</div>
			)}
			<form id="sessionForm" style={{ display: !dismiss && "none" }}>
				<h2
					className="themeHighText"
					style={{
						display: _user && _user.sessions === 0 && "none",
					}}
				>
					Selected Date:{" "}
					{_date !== "" && String(_date.toLocaleDateString("en-US"))}
				</h2>
				<div className="formFields">
					<div className="arrField">
						<label htmlFor="arrangement" className="themeMidText">
							Arrangement:
						</label>
						<select
							name="arrangement"
							id="arrangement"
							onChange={(e) => console.log(e.target.value)}
						>
							<option value="consultation">Free Consultation</option>
							{_user && _user.sessions > 0 && (
								<option value="session">Training Session</option>
							)}
						</select>
					</div>
					<div>
						<div className="timeField">
							<label htmlFor="sessionTime" className="themeMidText">
								Preferred time:
							</label>
							<input
								type="time"
								id="sessionTime"
								name="time"
								required
								onChange={(e) => set_time(e)}
							/>
						</div>
						<p className="themeHighText">Your ideal meet time, it may defer.</p>
					</div>
					{!_user && (
						<div className="emailField">
							<label className="themeMidText">Contact Email</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(String(e.target.value).toLowerCase())}
							/>
							<p className="themeHighText">
								A Zoom link will be sent to this email for our meeting.
							</p>
						</div>
					)}
					<div className="infoField">
						<label htmlFor="sessionNote" className="themeMidText">
							Anything I should know in advance?
						</label>
						<textarea
							id="sessionNote"
							rows="4"
							name="note"
							placeholder="Note for trainer..."
							className="themeBackLow"
						></textarea>
					</div>
				</div>
				{showRecaptcha && (
					<ReCAPTCHA
						ref={captchaRef}
						sitekey={fSettings.siteKey}
						size="normal"
						onChange={submit_form}
						theme="dark"
					/>
				)}
				<div className="subField">
					<button id="cancel" onClick={cancel_selection}>
						Cancel
					</button>
					<button id="submit">Confirm</button>
				</div>
			</form>
			<div
				className="confirmation"
				style={{ display: !dismiss && !errMessage ? null : "none" }}
			>
				<h1>
					<i className="fas fa-paper-plane"></i> All set!
				</h1>
				{_user ? (
					<p>
						You've scheduled a <b>session</b> with your coach for{" "}
						<span>{String(_date.toLocaleDateString("en-US"))}</span>
						<br />
						Expect to receive an email confirmation once they review your
						request...
					</p>
				) : (
					<p>{message}</p>
				)}
				<button onClick={dismiss_prompt}>Okay</button>
			</div>
			<div
				className="confirmation error"
				style={{ display: errMessage ? null : "none" }}
			>
				<h1>
					<i className="fas fa-times"></i> That didn't work
				</h1>
				{_user ? (
					<p>
						Something went wrong with your request.
						<br />
						Try refreshing the page and booking again...
					</p>
				) : (
					<p>{errMessage}</p>
				)}
				<button onClick={dismiss_prompt}>Okay</button>
			</div>
		</div>
	);
}

export default SessionForm;
