import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { CurrentUserContext } from "./Main/Contexts";
import NavLink from "./navlink";
function NavBar() {
	const { pathname } = useLocation();
	const [dark, setDark] = useState(false);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const navigate = useNavigate();

	const body = document.body;
	// check for a theme cookie in the browser
	useEffect(() => {
		var _theme = localStorage.getItem("theme");
		if (_theme) setDark(_theme === "dark");
	}, []);
	useEffect(() => {
		// load the user's preferred theme
		if (dark) {
			body.classList.remove("lightMode");
			body.classList.add("darkMode");
		} else {
			body.classList.remove("darkMode");
			body.classList.add("lightMode");
		}
		// save to browser
		localStorage.setItem("theme", dark ? "dark" : "light");
	}, [dark]);
	function toggle_ham() {
		var bar = document.getElementById("hamBar");
		if (bar.style.display == "none") bar.style.display = null;
		else bar.style.display = "none";
	}
	return (
		<div className={`navigator ${pathname === "/" ? "fixedBar" : null}`}>
			<div className="navBar" id="navBar">
				<span onClick={() => navigate("/")} className="gonz9" />
				<button
					onClick={() => setDark(!dark)}
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
				<button onClick={() => setDark(!dark)} className="themeButton">
					{dark ? "🌙 Dark " : "☀️ Light "} Theme
				</button>
			</div>
		</div>
	);
}
export default NavBar;
