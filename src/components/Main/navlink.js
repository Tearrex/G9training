import { useLocation, useNavigate } from "react-router-dom";
function NavLink(props) {
	const location = useLocation();
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate(props.route)}
			className={`link ${location.pathname === props.route ? "active" : ""}`}
		>
			{props.children}
		</button>
	);
}

export default NavLink;