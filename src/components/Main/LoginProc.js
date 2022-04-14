import { useContext, useState, useEffect, useRef } from "react";
import { loginClient, requestPassReset } from "../../services/clientsService";
import { CurrentUserContext, xTokenContext } from "./Contexts";

function LoginProc(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// force the client to make corrections before attempting to login again
	const [oldEmail, setOldEmail] = useState("");
	const [oldPass, setOldPass] = useState("");

	useEffect(() => {
		if (email !== oldEmail || password !== oldPass) props.setMessage("");
	}, [email, password]);

	// reset password process?
	const [forgotPass, setForgotPass] = useState(false);
	useEffect(() => {
		if (forgotPass) props.setMessage("");
	}, [forgotPass]);

	const [showCaptcha, setShowCaptcha] = useState(false);
	const captchaRef = useRef();
	useEffect(() => {
		if (showCaptcha) {
			captchaRef.current.execute();
		}
	}, [showCaptcha]);
	function login(e) {
		e.preventDefault();

		if (email === oldEmail || password === oldPass) return;

		// reset password process
		if (forgotPass) {
			// request password reset
			console.log("do reset password");
			requestPassReset(email).then((s) => {
				if (s.status === 200) {
					setEmail("");
					setForgotPass(false);
					props.setMessage(s.data.message);
				}
			});
			return;
		}

		var pass = document.getElementById("pswField");
		// login process
		const _json = {
			email: email,
			password: pass.value,
		};
		loginClient(_json)
			.then((s) => {
				console.log("good response", s);
				if (s.data.user) {
					// if authentication is successful, we save the
					// user's data object and access token in memory
					_setUser(s.data.user);
					setXToken(s.data.access);

					// we should have a new refresh token now
					// reset the cookie so we can use it again
					localStorage.removeItem("refreshFail");
					// rest of the components load past the login wall
				}
			})
			.catch((e) => {
				var s = e.response;
				if (s.data && s.data.message) {
					props.setClass("error");
					props.setMessage(s.data.message);
					// don't want to make it easier for attackers
					// to penetrate the website's security...
					switch (s.data.message) {
						case "Email not in use.":
							// reference the request's original values in case
							// the user changes them before the response arrives
							setOldEmail(_json.email);
							break;
						case "Invalid credentials.":
							setOldPass(_json.password);
							break;
						default:
							alert(s.data.message);
					}
					return;
				}
				// ugly
				else alert(String(e));
			});
	}
	function verifyCallback(e) {
		console.log("captcha human lol");
	}
	return (
		<>
			<form className="formFields" onSubmit={login}>
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
				{!forgotPass && (
					<span
						className="forgotPass linkHover"
						onClick={() => setForgotPass(true)}
					>
						Forgot password?
					</span>
				)}
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
			{!forgotPass ? (
				<span
					className="themeHighText themeBackLow signup"
					onClick={() => props.chooseLogin(false)}
					style={{ padding: "10px 0" }}
				>
					<i className="fas fa-angle-double-right"></i> Register Membership
				</span>
			) : (
				<span
					className="themeHighText themeBackLow signup"
					onClick={() => setForgotPass(false)}
					style={{ padding: "10px 0" }}
				>
					<i className="fas fa-angle-double-left"></i> Back to login
				</span>
			)}
		</>
	);
}

export default LoginProc;
