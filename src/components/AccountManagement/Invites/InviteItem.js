function InviteItem(props) {
	const { code, createdAt } = props.invite;
	var timeDiff = new Date() - new Date(createdAt);
	const diffHours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
	const diffMinutes = Math.floor((timeDiff / (1000 * 60)) % 60);
	return (
		<button
			className="inviteItem themeBackMid faintShadow"
			onClick={() => props.onClick(code)}
		>
			<h1>{code}</h1>
			<p className="themeMidText">
				<i className="far fa-clock"></i> {23 - diffHours}h {60 - diffMinutes}m
			</p>
		</button>
	);
}

export default InviteItem;
