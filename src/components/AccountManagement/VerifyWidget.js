import { useContext, useState, useEffect } from "react";
import { requestEmailLink } from "../../services/clientsService";
import { CurrentUserContext } from "../Main/Contexts.tsx";

function VerifyWidget(props) {
    const { _user, _setUser } = useContext(CurrentUserContext);
    const [sent, setSent] = useState(false);
    const [done, setDone] = useState(false);
    useEffect(() => {
        if(done && !sent)
        {
            requestEmailLink(_user.email).then((s) => {
                if(s.status === 200) setSent(true);
            });
        }
    }, [done, sent]);
	return (
		<div className="emailWarn">
			Your email has not been verified! Please check your inbox.
			<br />
			{!sent && !done ? (
				<span className="action" onClick={() => setDone(true)}>
					Resend link?
				</span>
			) : (
				<span className="message">
					<i className="far fa-envelope"></i> Link on the way!
				</span>
			)}
		</div>
	);
}

export default VerifyWidget;
