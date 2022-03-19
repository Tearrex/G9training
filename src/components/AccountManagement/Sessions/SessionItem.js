import { useContext, useEffect, useState } from "react";
import { updateSession } from "../../../services/sessionServices";
import { clientsContext, xTokenContext } from "../../Main/Contexts";

function SessionItem(props) {
	const { clients, setClients } = useContext(clientsContext);
	const { xToken, setXToken } = useContext(xTokenContext);
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const {
		_id,
		clientID,
		sessionDate,
		clientNote,
		trainerNote,
		approved,
		attended,
		reviewed,
		reimbursed,
	} = props.data;
	// client's name
	const [name, setName] = useState(null);
	// trainer's note
	const [note, setNote] = useState("");
	// initial prompt (Yes is true, No is false)
	const [action, setAction] = useState(null);
	// confirmation prompt, in case the users misclicks
	const [confirm, setConfirm] = useState(false);
	// is the "case" closed?
	const [settled, setSettled] = useState(false);
	// in case the server returns some kind of error, store it here
	const [error, setError] = useState(null);
	// if the client didn't show up, should they get a free session?
	const [reimburse, setReimburse] = useState(false);
	// add the client's name to the component for the trainer to see
	useEffect(() => {
		if (name || !props.reviewing) return;
		const index = clients.findIndex((client) => client._id === clientID);
		if (index == -1) return console.log("no client found!");
		const _client = clients[index];
		setName(`${_client.firstName} ${_client.lastName[0]}.`);
	}, [clientID, clients]);
	// determine the current status of the session
	var status = "pending";
	if (attended && approved && !reviewed) status = "attended";
	else if (attended && !approved && reviewed) status = "cancelled";
	else if (attended && approved && reviewed) status = "no-show";
	else if (approved) status = "approved";
	// pretty date display for calendar
	var date = new Date(sessionDate);
	var month = months[date.getMonth()];
	// interactions by the trainer
	function action_prompt(_confirm) {
		if (action !== null) {
			if (!_confirm) return setAction(null);
			else {
				settle_session();
				return setConfirm(true);
			}
		} else setAction(_confirm);
	}
	function settle_session() {
		var changes = {};
		if (action === true) {
			// positive action
			if (props.approving) changes["approved"] = true;
			else changes["attended"] = true;
		} else {
			// negative action
			changes["reviewed"] = true;
			changes["attended"] = true;
			//changes["reimbursed"] = reimburse;
		}
		console.log("id is", _id, "changes are", changes);
		props.settler(_id, changes, props.approving);
		// setSettled(true);
	}
	function save_changes() {
		var changes = {};
		changes["approved"] = approved;
		changes["reviewed"] = reviewed;
		changes["attended"] = attended;
		changes["reimbursed"] = reimburse;
		if (note !== "") changes["trainerNote"] = note;
		setSettled(true);
		setTimeout(() => {
			updateSession(_id, changes, reimburse, xToken).then((s) => {
				if (String(s.status).startsWith("4")) {
					setError(`${s.statusText}: ${s.data.message}`);
				} else {
					props.dismisser(_id, props.approving);
					console.log("server updated!", s.data);
				}
			});
		}, 5000);
	}
	return (
		<div className="sessionCard">
			{settled && (
				<div className="loadScreen">
					{!error ? (
						<p>
							<i className="fas fa-spinner"></i> Waiting for server...
						</p>
					) : (
						<p>
							<i
								className="fas fa-exclamation-circle"
								style={{ animation: "none" }}
							></i>{" "}
							An error occured!
							<br />
							{error}
						</p>
					)}
				</div>
			)}
			<div className="sessionItem themeBackMid">
				<div className="leftInfo">
					<div className="mainTitle">
						<span className={"status " + status}>{status}</span>
						<h2 className="themeHighText">
							Session {name && <span className="skinnyTitle">with {name}</span>}
						</h2>
						<p className="time themeMidText">
							at {date.getHours()}:{String(date.getMinutes()).padStart(2, "0")}
						</p>
					</div>
				</div>
				<div className="timeInfo">
					<div className="miniDate">
						<p className="month">{month}</p>
						<h1 className="nWeight">{date.getDate()}</h1>
					</div>
				</div>
			</div>
			{!props.reviewing && (
				<div className="reviewPrompt">
					{(status === "no-show" || status === "cancelled") && (
						<p>Your session was {!reimbursed && " not"} reimbursed.</p>
					)}
					{trainerNote !== "" && (
						<div>
							<h2>Trainer's Note</h2>
							<p>{trainerNote}</p>
						</div>
					)}
				</div>
			)}
			{props.reviewing && !settled && (
				<div className="reviewPrompt">
					{/*this is kinda messy...*/}
					{action === null &&
						!confirm &&
						(!props.approving ? (
							<p>Did they show up?</p>
						) : (
							<p>Will this work?</p>
						))}
					{action !== null &&
						!confirm &&
						(!props.approving ? (
							<p>
								They <b>DID{!action && " NOT"}</b> show up, are you sure?
							</p>
						) : (
							<p>
								Are you sure you want to <b>{action ? "approve" : "deny"}</b>{" "}
								this?
							</p>
						))}
					{action !== null &&
						confirm &&
						(action ? (
							!props.approving ? (
								<p>Great! Add a recap for them if you want:</p>
							) : (
								<p>
									Great! The client will be notified and you will get a
									reminder.
								</p>
							)
						) : (
							<p style={{ paddingBottom: "0" }}>
								Yikes! Do you want to reimburse their session?
							</p>
						))}
					{!confirm && (
						<div
							className="buttons"
							style={{ flexFlow: action !== true ? null : "row-reverse" }}
						>
							<button
								className={action !== false ? "confirm" : "deny"}
								onClick={() => action_prompt(true)}
							>
								{action === null ? "Yes" : "Confirm"}
							</button>
							<button className="cancel" onClick={() => action_prompt(false)}>
								{action === null ? "No" : "Cancel"}
							</button>
						</div>
					)}
					{action && confirm && !props.approving && (
						<textarea
							placeholder="Some praiseful comment... Some suggestion..."
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
					)}
					{!action && confirm && (
						<form className="checkBoxes">
							<div>
								<input
									type="radio"
									id="yesReimburse"
									name="reimburse"
									value="yes"
									onChange={() => setReimburse(true)}
								/>
								<label htmlFor="yesReimburse">Yes</label>
							</div>
							<div>
								<input
									type="radio"
									id="noReimburse"
									name="reimburse"
									value="no"
									defaultChecked
									onChange={() => setReimburse(false)}
								/>
								<label htmlFor="noReimburse">No</label>
							</div>
						</form>
					)}
					{confirm && (
						<button className="finish" onClick={save_changes}>
							Finish
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default SessionItem;
