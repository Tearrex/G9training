import { useContext, useState, useEffect } from "react";
import {
	registerClient,
	loginClient,
	requestPassReset,
} from "../../services/clientsService";
import { CurrentUserContext, xTokenContext } from "./Contexts";

function LoginForm() {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);

	// display errors and other updates when trying to log in
	const [formMessage, setFormMessage] = useState("");
	const [msgClass, setMsgClass] = useState("error");

	// force the client to make corrections before attempting to login again
	const [oldEmail, setOldEmail] = useState("");
	const [oldPass, setOldPass] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	useEffect(() => {
		if (email !== oldEmail || password !== oldPass) setFormMessage("");
	}, [email, password]);

	// login or signup?
	const [chooseLogin, setChooseLogin] = useState(true);
	// reset password process?
	const [forgotPass, setForgotPass] = useState(false);
	useEffect(() => {
		if (forgotPass) setFormMessage("");
	}, [forgotPass]);
	// signup stuff
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	function login(e) {
		e.preventDefault();
		var pass = document.getElementById("pswField");
		if (!chooseLogin) {
			var cpass = document.getElementById("cPswField");
			// check if both passwords match
			if (pass.value !== cpass.value) {
				setFormMessage("Passwords must match!");
				pass.classList.add("badPass");
				cpass.classList.add("badPass");
				return;
			} else {
				pass.classList.remove("badPass");
				cpass.classList.remove("badPass");
			}
			// register the user
			const _json = {
				email: email,
				password: pass.value,
				firstName: firstName,
				lastName: lastName,
			};
			registerClient(_json).then((s) => {
				console.log("server returned", s);
				if (s.data && s.data.message) {
					setFormMessage(s.data.message);
					return;
				} else if (s.data.user) {
					_setUser(s.data.user);
					setXToken(s.data.access);
				}
			});
		} else {
			if (forgotPass) {
				// request password reset
				console.log("do reset password");
				requestPassReset(email).then((s) => {
					if (s.status === 200) {
						setEmail("");
						setForgotPass(false);
						setMsgClass("success");
						setFormMessage(s.data.message);
					}
				});
				return;
			}
			const _json = {
				email: email,
				password: pass.value,
			};
			loginClient(_json).then((s) => {
				console.log("server returned", s);
				if (s.data && s.data.message) {
					setFormMessage(s.data.message);
					// don't want to make it easier for attackers
					// to penetrate the website's security...
					if (s.data.message === "Email not in use.") setOldEmail(email);
					else if (s.data.message === "Invalid credentials.")
						setOldPass(password);
					return;
				} else if (s.data.user) {
					_setUser(s.data.user);
					setXToken(s.data.access);
				}
			});
		}
		// reset credentials
	}
	return (
		<div className="loginForm">
			<form onSubmit={login}>
				<div className="header">
					<img src="/android-chrome-192x192.png" />
					<p>Gonz9Training</p>
				</div>
				<div className="authTypes">
					<span
						className={chooseLogin ? "active" : null}
						onClick={() => {
							setForgotPass(false);
							setChooseLogin(true);
						}}
					>
						Log In
					</span>
					<span
						className={!chooseLogin ? "active" : null}
						onClick={() => {
							setForgotPass(false);
							setChooseLogin(false);
							setOldEmail(null);
							setOldPass(null);
						}}
					>
						Sign Up
					</span>
				</div>
				{formMessage !== "" && (
					<div className={"logMessage " + msgClass}>{formMessage}</div>
				)}
				<div className="formFields">
					{!chooseLogin && (
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
					)}
					{forgotPass && (
						<p className="forgotPassNote">
							A link will be sent to this email to reset your password:
						</p>
					)}
					<input
						type="email"
						placeholder="your@email.com"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value.trim())}
					/>
					{!forgotPass && (
						<input
							type="password"
							placeholder="Password"
							id="pswField"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					)}
					{!chooseLogin ? (
						<input
							type="password"
							placeholder="Repeat Password"
							id="cPswField"
							required
						/>
					) : (
						!forgotPass && (
							<span className="forgotPass" onClick={() => setForgotPass(true)}>
								Forgot password?
							</span>
						)
					)}
				</div>
				{email !== "" &&
					email.includes("@") &&
					email !== oldEmail &&
					((password !== "" && password !== oldPass) || forgotPass) && (
						<input
							type="submit"
							value={!forgotPass ? "Continue" : "Send Email"}
						/>
					)}
			</form>
		</div>
	);
}

export default LoginForm;
