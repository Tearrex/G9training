import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmailLink } from "../../services/clientsService";

function VerifyEmail(props) {
	const { emailToken } = useParams();
    const navigate = useNavigate();
	const [message, setMessage] = useState(null);
	const [complete, setComplete] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		setTimeout(() => {
			//setComplete(true);
            verifyEmailLink(emailToken).then((s) => {
                if(s.status === 200) setMessage(s.data.message);
                setComplete(true);
                console.log(s);
            }).catch((e) => {
                setError(`${e.response.statusText}: ${e.response.data.message}`);
                setComplete(true);
            });
		}, 1500);
	}, []);
	return !complete ? (
		<div className="verifyWindow cmodal">
			<h1>Waiting on server</h1>
			<i className="fas fa-spinner spinny themeIcon"></i>
		</div>
	) : !error ? (
		<div className="verifyWindow cmodal">
			<h1>Good to go!</h1>
			<p>{message}</p>

			<div className="bubble">
				<button onClick={() => navigate("/training")}>
					<i className="fas fa-angle-double-right themeIcon"></i>
				</button>
				<p>Go to account</p>
			</div>
		</div>
	) : (
		<div className="verifyWindow cmodal">
			<h1>Something went wrong.</h1>
			<p><i className="fas fa-info-circle infocolor" style={{fontSize:"1rem"}}></i> {error}</p>
		</div>
	);
}

export default VerifyEmail;
