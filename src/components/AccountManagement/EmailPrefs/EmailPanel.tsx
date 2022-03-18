import { useContext } from "react";
// kill me
import { CurrentUserContext } from "../../Main/Contexts";

export const EmailPanel: React.FC = (props) => {
	const { _user, _setUser } = useContext(CurrentUserContext);
	return (
		<div>
			<h3>{_user.email}</h3>
		</div>
	);
}

export default EmailPanel;
