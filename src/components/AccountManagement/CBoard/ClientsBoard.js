import { useContext, useEffect, useState } from "react";
import {
	clientsContext,
	CurrentUserContext,
	xTokenContext,
} from "../../Main/Contexts";
import "./CBoard.scss";
import CBoardItem from "./CBoardItem";
// growing pains
import { updateClient, fetchClients } from "../../../services/clientsService";
function ClientsBoard(props) {
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { xToken, setXToken } = useContext(xTokenContext);
	const { clients, setClients } = useContext(clientsContext);

	// trainer interface for editing "clients"
	const [focusClient, setFocusClient] = useState(null);
	const [focusIndex, setFocusIndex] = useState(-1);
	const [sessionTokens, setSessionTokens] = useState(0);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (clients.length > 0) return console.log("clients exist");
		fetchClients(xToken).then((s) => {
			console.log("got clients", s);
			setClients(s);
		});
	}, []);
	useEffect(() => {
		if (focusIndex > -1) setFocusClient(clients[focusIndex]);
	}, [clients]);
	// rerender the correct token amount for each chosen "client"
	useEffect(() => {
		if (!focusClient) return setMessage(null);
		setSessionTokens(focusClient.sessions);
	}, [focusClient]);
	// find the index of a particular "client" in the array with a given ID
	function find_index(id) {
		const _client = clients.findIndex((client) => client._id === id);
		if (_client == -1) return console.log("no index found!");
		// debug log
		console.log(`index ${_client}`, clients[_client]);
		return _client;
	}
	function set_sessions(e) {
		if (e.target.value < 0) return;
		setSessionTokens(parseInt(e.target.value));
	}
	// called when the user wants to update a "client's" session tokens
	// it reaches out to the backend database to save the changes
	function save_client() {
		updateClient(
			focusClient._id,
			{
				sessions: sessionTokens,
			},
			xToken
		)
			.then((s) => {
				console.log("got response", s);
				if (String(s.status).startsWith("4")) {
					setError(true);
					setMessage(s.data.message);
				} else {
					setError(false);
					setMessage("Changes have been saved!");
					// feedback for the UI
					var _clients = clients;
					_clients[focusIndex].sessions = sessionTokens;
					setClients(_clients);
					console.log("clients are now", _clients);
				}
			})
			.catch((e) => {
				console.log("update error", e);
				return e;
			});
	}
	return (
		<div className="clientsBoard">
			{/* <h1>client list</h1> */}
			{focusClient && (
				<div>
					<div className="fade" />
					<div className="modal">
						<h1>{`${focusClient.firstName} ${focusClient.lastName}`}</h1>
						{message && (
							<div className={`logMessage ${error ? "error" : "success"}`}>
								{message}
							</div>
						)}
						<div className="settings">
							<div className="inField">
								<label htmlFor="sessionCount">Sessions</label>
								<input
									type="number"
									value={sessionTokens}
									onChange={set_sessions}
									id="sessionCount"
								/>
							</div>
							<div className="options">
								{sessionTokens != focusClient.sessions && (
									<button className="save" onClick={save_client}>
										<i className="fas fa-save"></i> Save
									</button>
								)}
								<button className="close" onClick={() => setFocusClient(null)}>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="searchBar">
				<span>
					<i className="fas fa-search"></i>
				</span>
				{/* search bar doesnt work yet! */}
				<input type="text" placeholder="Search for someone..." />
			</div>
			<table id="clientsList">
				<tbody>
					<tr>
						<th>
							<i className="fas fa-sort-down" /> Name
						</th>
						{/* <th>Email</th> */}
						<th>Sessions</th>
						<th>ID</th>
						<th>Edit</th>
					</tr>
					{clients &&
						clients
							.sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
							.map((client, i) => (
								<CBoardItem
									key={i}
									client={client}
									onClick={find_index}
									choose={() => {
										setFocusClient(client);
										setFocusIndex(i);
									}}
								/>
							))}
				</tbody>
			</table>
		</div>
	);
}

export default ClientsBoard;
