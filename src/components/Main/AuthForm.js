import { useContext, useState, useEffect } from "react";
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

	// clear any previous errors or form messages
	useEffect(() => {
		setFormMessage("");
	}, [chooseLogin]);
	return (
		<div className="authSplash">
			<div className="authForm">
				<div className="header">
					<img src="/slim-icon.png" alt="logo" />
					<p>onz9Training</p>
				</div>
				{formMessage !== "" && (
					<div className={"logMessage"}>
						{msgClass === "success" ? (
							<i className="fas fa-check"></i>
						) : (
							<i className="fas fa-times"></i>
						)}
						{formMessage}
					</div>
				)}
				{chooseLogin ? (
					<LoginProc
						setMessage={setFormMessage}
						setClass={setMsgClass}
						chooseLogin={(e) => setChooseLogin(e)}
					/>
				) : (
					<SignupProc
						setMessage={setFormMessage}
						setClass={setMsgClass}
						chooseLogin={(e) => setChooseLogin(e)}
					/>
				)}
			</div>
		</div>
	);
}

export default AuthForm;
