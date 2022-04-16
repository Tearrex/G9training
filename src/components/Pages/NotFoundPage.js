import { useNavigate } from "react-router-dom";

function NotFoundPage(props) {
	const navigate = useNavigate();
	return (
		<div className="notFound cmodal verifyWindow">
			<h1 className="nWeight">Hmmm, nothing...</h1>
			<p className="themeMidText">The page you requested does not exist.</p>
			<div className="bubble">
				<button onClick={() => navigate("/")}>
					<i className="fas fa-angle-double-right themeIcon"></i>
				</button>
				<p>Go to main page</p>
			</div>
		</div>
	);
}

export default NotFoundPage;
