import { useContext } from "react";
import { CurrentUserContext } from "../Main/Contexts";

function ClientPanel(props) {
    const { _user, _setUser } = useContext(CurrentUserContext);
    return (
        <div className="cPanel">
            <h1>{_user.firstName}, you have <span className={_user.sessions === 0 ? "empty" : null}>{_user.sessions}</span> session tokens</h1>
        </div>
    );
}

export default ClientPanel;