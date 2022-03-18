import {
	BrowserRouter as Router,
	Route,
	Routes,
	//useNavigate
} from "react-router-dom";
import { useState } from "react";

import NavBar from "./components/navbar";
import {
	CurrentUserContext,
	xTokenContext,
} from "./components/Main/Contexts.tsx";

import ContactPage from "./components/Pages/ContactPage";
import ServicesPage from "./components/Pages/ServicesPage";
import TrainPage from "./components/Pages/TrainPage";
import HomePage from "./components/Pages/HomePage";
import ResetPassword from "./components/Pages/ResetPassword";
import VerifyEmail from "./components/Pages/VerifyPage";
import Maintenance from "./components/Pages/Maintenance";
import NotFoundPage from "./components/Pages/404Page";

// maintenance mode?
const maintenance = false;

function App() {
	const [_user, _setUser] = useState(null);
	const [xToken, setXToken] = useState(null);
	// used for refreshing access tokens upon page load
	const [attemptedLogin, setAttemptedLogin] = useState(false);
	return (
		<Router>
			<xTokenContext.Provider value={{ xToken, setXToken }}>
				<CurrentUserContext.Provider value={{ _user, _setUser }}>
					<NavBar />
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="services" element={<ServicesPage />} />
						<Route path="contact" element={<ContactPage />} />
						<Route
							path="training"
							element={!maintenance ? <TrainPage /> : <Maintenance />}
						/>
						<Route exact path="verify/:emailToken" element={<VerifyEmail />} />
						<Route exact path="resetpass/:token" element={<ResetPassword />} />
						<Route path="/*" element={<NotFoundPage />} />
					</Routes>
				</CurrentUserContext.Provider>
			</xTokenContext.Provider>
		</Router>
	);
}

export default App;
