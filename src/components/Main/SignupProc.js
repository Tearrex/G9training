import { useContext, useState, useEffect, useRef } from "react";
import { registerClient } from "../../services/clientsService";
import { CurrentUserContext, xTokenContext } from "./Contexts";
import ReCAPTCHA from "react-google-recaptcha";
import { fSettings } from "../../fSettings";
function SignupProc(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cPassword, setCPassword] = useState("");
	// force the client to make corrections before attempting to login again
	const [oldEmail, setOldEmail] = useState("");

	useEffect(() => {
		if (email !== oldEmail) props.setMessage("");
	}, [email]);

	const [showCaptcha, setShowCaptcha] = useState(false);
	const captchaRef = useRef();

	// toggle the invite code form that's required for signup
	// temporary for backend improvements
	const [inviteProc, setInviteProc] = useState(false);
	const [code, setCode] = useState(""); // invite code to validate
	const [oldCode, setOldCode] = useState(null); // for corrections

	// called by the form's button, just validates input
	// the captcha calls the actual signup function
	function signup_action(e) {
		e.preventDefault();

		// check if email needs correction
		if (email === oldEmail) return;
		// check if names have letters only
		if (!/^[a-zA-Z]+$/.test(firstName + lastName))
			return props.setMessage("Names must have letters only (A-Z)");

		var pass = document.getElementById("pswField");
		var cpass = document.getElementById("cPswField");
		// check if both passwords match
		if (password !== cPassword) {
			props.setMessage("Passwords must match!");
			pass.classList.add("badPass");
			cpass.classList.add("badPass");
			return;
		} else {
			pass.classList.remove("badPass");
			cpass.classList.remove("badPass");
			setShowCaptcha(true);
		}
	}
	// called when the user completes the captcha
	function signup() {
		// register the user
		const _json = {
			email: email,
			password: password,
			firstName: firstName,
			lastName: lastName,
			inviteCode: code, // to be checked by the server
		};
		registerClient(_json)
			.then((s) => {
				console.log("good response", s);
				if (s.data.user) {
					_setUser(s.data.user);
					setXToken(s.data.access);
					// we should have a new refresh token now
					// reset the cookie so we can use it again
					localStorage.removeItem("refreshFail");
					// rest of the components load past the login wall
				}
			})
			.catch((e) => {
				// make it pop with red
				props.setClass("error");
				switch (e.response.data.message) {
					case "Email already in use.":
						setOldEmail(_json.email);
						// switch back to signup form
						setInviteProc(false);
						break;
					case "Your invite code is invalid.":
						// setOldCode(_json.code); // scopes
						setOldCode(code); // for now
						break;
					case "Your invite code has expired.":
						setOldCode(code);
						break;
					// less ugliness later
					default:
						alert(e.response.data.message);
				}
				// make user do the captcha again upon fail
				// will make it after a certain amount of times later
				setShowCaptcha(false);
				// display the error message for the user
				if (e.response.data.message) props.setMessage(e.response.data.message);
			});
		return;
	}
	// format the input value nicely for the code
	function changeCode(e) {
		var value = e.target.value;
		setCode(String(value).toUpperCase());
	}
	return (
		<>
			<form className="formFields" onSubmit={signup_action}>
				{!inviteProc ? (
					<>
						<div className="nameFields">
							<input
								placeholder="First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
							/>
							<input
								placeholder="Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
							/>
						</div>
						<input
							type="email"
							placeholder="your@email.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value.trim())}
						/>
						<input
							type="password"
							placeholder="Password"
							id="pswField"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Repeat Password"
							id="cPswField"
							value={cPassword}
							onChange={(e) => setCPassword(e.target.value)}
							required
						/>

						{showCaptcha && (
							<ReCAPTCHA
								ref={captchaRef}
								sitekey={fSettings.siteKey}
								size="normal"
								onChange={() => setInviteProc(true)}
								theme="dark"
							/>
						)}
						{email !== "" &&
							email.includes("@") &&
							email !== oldEmail &&
							password !== "" &&
							password === cPassword && (
								<input type="submit" value="Continue" />
							)}
					</>
				) : (
					<>
						<div>
							<h2 className="themeLowText">Almost there</h2>
							<p className="themeMidText">Input your invite code below</p>
						</div>
						<input
							type="text"
							style={{ textAlign: "center" }}
							value={code}
							onChange={changeCode}
						/>
					</>
				)}
			</form>
			{inviteProc && String(code).length >= 5 && code != oldCode && (
				<button className="continue" onClick={signup}>
					Confirm
				</button>
			)}
		</>
	);
}

export default SignupProc;
