import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { CurrentUserContext } from "./Main/Contexts.tsx";
import NavLink from "./navlink";
function NavBar() {
	const { pathname } = useLocation();
	const [dark, setDark] = useState(true);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const navigate = useNavigate();
	function toggle_dark(save = true) {
		var body = document.body;

		if (body.classList.contains("lightMode")) {
			body.classList.remove("lightMode");
			body.classList.add("darkMode");
			// save to browser
			if (save) localStorage.setItem("theme", "dark");
		} else {
			body.classList.remove("darkMode");
			body.classList.add("lightMode");
			// save to browser
			if (save) localStorage.setItem("theme", "light");
		}
		setDark(!body.classList.contains("lightMode"));
	}
	// check for a theme cookie in the browser
	useEffect(() => {
		var _theme = localStorage.getItem("theme");
		if (_theme) {
			// load the user's preferred theme
			if (_theme !== "dark" && dark) {
				console.log("Restoring light theme");
				toggle_dark();
			}
		}
	}, []);
	function toggle_ham() {
		var bar = document.getElementById("hamBar");
		if (bar.style.display == "none") bar.style.display = null;
		else bar.style.display = "none";
	}
	return (
		<div className={`navigator ${pathname === "/" ? "fixedBar" : null}`}>
			<div className="navBar">
				<span onClick={() => navigate("/")} className="gonz9" />
				<button
					onClick={toggle_dark}
					className="mainThemeToggle"
					style={{ width: "50px", fontSize: "1.2rem" }}
				>
					{dark ? (
						<i className="fas fa-moon"></i>
					) : (
						<i className="fas fa-sun"></i>
					)}
				</button>
				<div className="links">
					<NavLink route="/services">SERVICES</NavLink>
					<NavLink route="/contact">CONTACT</NavLink>
					<NavLink route="/training">
						MY {_user && _user.trainer ? "CLIENTS" : "TRAINING"}
					</NavLink>
				</div>
				<button id="hamButton" onClick={toggle_ham}>
					<div className="fas fa-bars"></div>
				</button>
			</div>
			<div id="hamBar" style={{ display: "none" }}>
				<NavLink route="/services">SERVICES</NavLink>
				<NavLink route="/contact">CONTACT</NavLink>
				<NavLink route="/training">
					MY {_user && _user.trainer ? "CLIENTS" : "TRAINING"}
				</NavLink>
				<button onClick={toggle_dark} className="themeButton">
					{dark ? "🌙 Dark " : "☀️ Light "} Theme
				</button>
			</div>
		</div>
	);
}
export default NavBar;
