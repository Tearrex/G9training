import { useContext, useState, useEffect, useRef } from "react";
import { CurrentUserContext, xTokenContext } from "./Contexts";
import LoginProc from "./LoginProc";
import SignupProc from "./SignupProc";

function AuthForm() {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);

	// display errors and other updates when trying to log in
	const [formMessage, setFormMessage] = useState("");
	const [msgClass, setMsgClass] = useState("error");

	// login or signup?
	const [chooseLogin, setChooseLogin] = useState(true);
	return (
		<div className="authSplash">
			<div className="authForm">
				<div className="header">
					<img src="/android-chrome-192x192.png" />
					<p>Gonz9Training</p>
				</div>
				<div className="authTypes">
					<span
						className={chooseLogin ? "active" : null}
						onClick={() => {
							setChooseLogin(true);
						}}
					>
						Log In
					</span>
					<span
						className={!chooseLogin ? "active" : null}
						onClick={() => {
							setChooseLogin(false);
						}}
					>
						Sign Up
					</span>
				</div>
				{formMessage !== "" && (
					<div className={"logMessage " + msgClass}>{formMessage}</div>
				)}
				{chooseLogin ? (
					<LoginProc setMessage={setFormMessage} setClass={setMsgClass} />
				) : (
					<SignupProc setMessage={setFormMessage} setClass={setMsgClass} />
				)}
			</div>
		</div>
	);
}

export default AuthForm;
