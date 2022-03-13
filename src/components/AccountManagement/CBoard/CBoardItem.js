import { useState } from "react";

function CBoardItem(props) {
	const { _id, firstName, lastName, email, verified, sessions } = props.client;
	const [text, setText] = useState("Copy");

	// called when the user wants a copy a client's ID into their clipboard
	function copy_id(e) {
		console.log("copy", _id);
		if (navigator.clipboard) {
			return navigator.clipboard.writeText(_id).then((s) => setText("Copied!"));
		}
		// old browser fallback
		var temp = document.createElement("textarea");
		temp.value = _id;
		temp.setAttribute("readonly", "");
		temp.style = { display: "none" };
		document.body.appendChild(temp);
		temp.focus();
		temp.select();
		document.execCommand("copy");
		document.body.removeChild(temp);
	}
	return (
		<tr>
			<td onClick={() => props.onClick(_id)}>
				{lastName}, {firstName}
			</td>
			<td>
				<a href={`mailto:${email}?subject=Message for ${firstName}`}>{email}</a>{" "}
				{verified && (
					<div className="ttParent" style={{ display: "inline" }}>
						<span className="tooltip" style={{ bottom: "1.5rem" }}>
							Verified
						</span>
						<i className="fas fa-check verified" />
					</div>
				)}
			</td>
			<td>{sessions}</td>
			<td
				onClick={copy_id}
				className="copyId ttParent"
				onMouseOut={(e) => setText("Copy")}
			>
				<span className="tooltip">{text}</span>
				<button>
					<i className="fas fa-copy"></i>
				</button>
			</td>
			<td className="copyId">
				<button onClick={props.choose}>
					<i className="fas fa-edit"></i>
				</button>
			</td>
		</tr>
	);
}

export default CBoardItem;
