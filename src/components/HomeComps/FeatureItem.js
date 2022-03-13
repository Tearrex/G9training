function FeatureItem(props) {
	const { icon, title, color } = props;
	return (
		<div
			className={
				"item themeBackMid " +
				(props.fancy ? "fancyCard" : "") +
				` ${props.padded ? "paddedItem" : ""}`
			}
			style={{ paddingTop: props.padTop ? "10px" : null }}
		>
			<img src={icon} className="lightenedDarkness themeIcon" />
			<h2 style={{ color: color || null }}>{title}</h2>
			{props.children}
		</div>
	);
}

export default FeatureItem;
