import {
	BrowserRouter as Router,
	Route,
	Routes,
	//useNavigate
} from "react-router-dom";
import { useState } from "react";

import NavBar from "./components/navbar";
import { CurrentUserContext, xTokenContext } from "./components/Main/Contexts";

import ContactPage from "./components/Pages/Contact/ContactPage";
import ServicesPage from "./components/Pages/ServicesPage";
import TrainPage from "./components/Pages/TrainPage";
import HomePage from "./components/Pages/HomePage";
import ResetPassword from "./components/Pages/ResetPassword";
import VerifyEmail from "./components/Pages/VerifyPage";
import Maintenance from "./components/Pages/Maintenance";
import SetupPage from "./components/Pages/Setup/SetupPage";
import { fSettings } from "./fSettings";
import NotFoundPage from "./components/Pages/NotFoundPage";


function App() {
	const [_user, _setUser] = useState(null); // user data
	const [xToken, setXToken] = useState(null); // access token
	return (
		<Router>
			<xTokenContext.Provider value={{ xToken, setXToken }}>
				<CurrentUserContext.Provider value={{ _user, _setUser }}>
					<NavBar />
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="services" element={<ServicesPage />} />
						<Route path="contact" element={<ContactPage />} />
						<Route path="setup" element={<SetupPage />} />
						<Route
							path="training"
							element={
								!fSettings["maintenance"] ? <TrainPage /> : <Maintenance />
							}
						/>
						<Route exact path="verify/:emailToken" element={<VerifyEmail />} />
						<Route exact path="resetpass/:token" element={<ResetPassword />} />
						<Route path="/*" element={<NotFoundPage />} />
					</Routes>
				</CurrentUserContext.Provider>
			</xTokenContext.Provider>
			<footer style={{ padding: "10px 0" }}>
				<p>All legitimate business inquiries should be sent to:</p>
				<a href="mailto:coachgustavo@gonz9training.com">
					coachgustavo@gonz9training.com
				</a>
			</footer>
		</Router>
	);
}

export default App;
