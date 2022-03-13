import { useState, useEffect, useContext } from "react";
import {
	fetchInvites,
	requestInviteCode,
} from "../../../services/clientsService";
import { xTokenContext } from "../../Main/Contexts";
import { copy_text } from "../CBoard/CBoardItem";
import InviteItem from "./InviteItem";
import "./Invites.scss";

function InviteBoard(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	// stores the list returned by the server
	const [invites, setInvites] = useState([]);
	// are we waiting for a response?
	const [creating, setCreating] = useState(false);
	// brief popup to notify the user when they copy a code
	const [note, setNote] = useState(null);
	useEffect(() => {
		if (note) setTimeout(() => setNote(null), 3000);
	}, [note]);
	function make_code() {
		if (creating) return;
		var amount = Object.entries(invites).length;
		if (amount > 1) {
			if (amount >= 3)
				return alert("Please don't make more than 3 coexisting codes.");
			var confirm = window.confirm(
				`You have ${amount} active invite codes, make another?`
			);
			if (!confirm) return;
		}
		setCreating(true); // ignore further calls
		setTimeout(() => {
			requestInviteCode(xToken)
				.then((s) => {
					// add this new code to the list
					var _invites = invites;
					_invites = [s.data, ...invites];
					setInvites(_invites);
					setCreating(false);
				})
				.catch((e) => {
					alert(e.response.data.message);
					setCreating(false);
				});
		}, 2000);
	}
	useEffect(() => {
		// load invite codes from the database
		// as soon as the page loads
		fetchInvites(xToken)
			.then((s) => {
				// show the codes at the trainer's disposal
				setInvites(s.data);
			})
			.catch((e) => {
				alert(e.response.data.message);
			});
	}, []);
	function clipboard_code(code) {
		copy_text(code, () => setNote(`Copied '${code}' to clipboard!`));
	}
	return (
		<div className="inviteBoard">
			<h1>Invite a Client</h1>
			<p>
				Please be selective of who you invite as we improve our system.
				<br />
				Invite codes are valid for <b>24 hours</b> and are <b>single use</b>.
			</p>
			<button onClick={make_code}>
				{!creating ? (
					<>
						<span>
							<i className="fas fa-plus"></i>
						</span>{" "}
						<p>Create a code</p>
					</>
				) : (
					<>
						<span>
							<i className="fas fa-cog spin"></i>
						</span>{" "}
						<p>Creating ...</p>
					</>
				)}
			</button>
			<div className="inviteList">
				{invites &&
					Object.entries(invites).length > 0 &&
					invites
						.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
						.map((inv, i) => (
							<InviteItem key={i} invite={inv} onClick={clipboard_code} />
						))}
			</div>
			{note && <h2 style={{ marginTop: "10px" }}>{note}</h2>}
		</div>
	);
}

export default InviteBoard;
