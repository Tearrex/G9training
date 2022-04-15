// simply handles setting the props state
// with optional parameters to prompt for confirmation
function toggle_pref(e, setState, confDisable = null, confEnable = null) {
	var checked = e.target.checked;
	if (confDisable && !checked) {
		// are you sure you want to disable?
		if (!window.confirm(confDisable)) return e.preventDefault();
	} else if (confEnable && checked) {
		// are you sure you want to enable?
		if (!window.confirm(confDisable)) return e.preventDefault();
	}
	setState(checked);
}

function PrefToggle(props) {
	const { name, icon, desc, wip, context } = props;
	// this guilts me deeply after tasting typescript...
	const { state, setState } = context || {};
	return (
		<div className="toggleBundle">
			<div className="switchBundle">
				<p>
					{icon} {name}
					{wip && <span className="wip"> WIP</span>}
				</p>
				<label className="accSwitch">
					<input
						type="checkbox"
						onClick={(e) => toggle_pref(e, setState)}
						defaultChecked={state}
						disabled={wip}
					/>
					<span className="slider"></span>
				</label>
			</div>
			<p className="optDesc">{desc}</p>
		</div>
	);
}

export default PrefToggle;
