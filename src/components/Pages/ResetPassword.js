import { useContext, useState, useEffect } from "react";
import {
	registerClient,
	loginClient,
	resetPass,
	resetPassword,
} from "../../services/clientsService";
import { useParams } from "react-router";

function ResetPassword() {
	// display errors and other updates when trying to log in
	const { token } = useParams();
	const [formMessage, setFormMessage] = useState(null);
	const [msgClass, setMsgClass] = useState(null);

	const [password, setPassword] = useState("");
	const [oldPass, setOldPass] = useState(null);

	const [cPass, setCPass] = useState("");
	const [oldCPass, setOldCPass] = useState(null);

	// when set to true, the input fields will no longer show up
	// this will (hopefully) mitigate spamming requests to the server
	// when clients are prompted to ask for a new reset link
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		setFormMessage(null);
	}, [password, cPass]);
	function login(e) {
		e.preventDefault();
		//var cPass = document.getElementById("cPswField");
		// if the passwords don't match, make the client correct them.
		if (password !== cPass) return setFormMessage("Passwords don't match!");
		// otherwhise, send the request to the server
		resetPassword(password, token)
			.then((s) => {
				if (s.status === 200) setMsgClass("success");
				setFormMessage(s.data.message); setDisabled(true);
			})
			.catch((e) => {
				console.log(e.response);
				if(e.response.status === 401) setDisabled(true);
				setFormMessage(e.response.data.message);
			});
		console.log("do magic");
	}
	return (
		<div className="loginForm">
			<form onSubmit={login}>
				<div className="header">
					<img src="/android-chrome-192x192.png" />
					<p>Reset Password</p>
				</div>
				{formMessage && (
					<div className={`logMessage ${msgClass || "error"}`}>
						{formMessage}
					</div>
				)}
				{!disabled && (
					<div className="formFields">
						<input
							type="password"
							placeholder="New Password"
							id="pswField"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Repeat Password"
							id="cPswField"
							value={cPass}
							onChange={(e) => setCPass(e.target.value)}
							required
						/>
					</div>
				)}
				{password !== "" && cPass !== "" && !formMessage && !disabled && (
					<input type="submit" value={"Confirm"} />
				)}
			</form>
		</div>
	);
}

export default ResetPassword;
