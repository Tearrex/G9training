import { useState } from "react";

export function copy_text(text, success) {
	if (navigator.clipboard) {
		return navigator.clipboard.writeText(text).then(success);
	}
	// old browser fallback
	var temp = document.createElement("textarea");
	temp.value = text;
	temp.setAttribute("readonly", "");
	temp.style = { display: "none" };
	document.body.appendChild(temp);
	temp.focus();
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
	success();
}
function CBoardItem(props) {
	const { _id, firstName, lastName, email, verified, sessions } = props.client;
	const [text, setText] = useState("Copy");

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
				onClick={() => copy_text(_id, () => setText("Copied!"))}
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
