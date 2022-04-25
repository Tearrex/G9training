function FeatureItem(props) {
	const { icon, title, color } = props;
	var classes = ["item"];
	if (props.fancy) classes.push("fancyCard");
	if (props.padded) classes.push("paddedItem");
	if (!props.noback) classes.push("themeBackMid");
	return (
		<div
			className={classes.join(" ")}
			style={{ paddingTop: props.padTop ? "10px" : null }}
		>
			{icon && <img src={icon} className="themeIcon hmargin" />}
			<h2 style={{ color: color || null }}>{title}</h2>
			{props.children}
		</div>
	);
}

export default FeatureItem;
