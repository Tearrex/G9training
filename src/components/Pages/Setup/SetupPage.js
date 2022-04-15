import { useState, useContext, useEffect } from "react";
import SetupForm from "./SetupForm";
import "./SetupPage.scss";
import { FormProvider, useForm } from "react-hook-form";
import { postPlan } from "../../../services/clientsService";
import { CurrentUserContext, xTokenContext } from "../../Main/Contexts";
import { useNavigate } from "react-router-dom";

function SetupPage(props) {
	const navigate = useNavigate();
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const methods = useForm();

	const [chosenStyle, setChosenStyle] = useState(null);
	// give user the rundown of the style they selected
	const [description, setDescription] = useState(null);

	// clickable component that manipulates the above states ^
	const StyleItem = (props) => {
		const { name, desc, image, freeze } = props;
		var className = "";
		if (chosenStyle && chosenStyle.props.name === name) className = "active";
		if (freeze) className = className + " selected";
		return (
			<button
				className={`selection themeBackMid ${className}`}
				onClick={() => {
					if (freeze) return; // only work as a display
					setChosenStyle(
						<StyleItem name={name} desc={desc} image={image} freeze />
					);
					setDescription(desc);
				}}
			>
				<div className="info">
					<h2 className="themeMidText">{name || "STYLE NAME"}</h2>
					<img className="themeIcon" src={`/traintypes/${image}`} alt="" />
				</div>
			</button>
		);
	};

	const styles = [
		<StyleItem
			name="Bodybuild"
			image="bodybuild.svg"
			desc={
				<p className="themeMidText">Get shredded with The Backyard Beast.</p>
			}
		/>,
		<StyleItem
			name="Powerlift"
			image="powerlift.png"
			desc={<p className="themeMidText">Feel the power of your endurance.</p>}
		/>,
		<StyleItem
			name="Crossfit"
			image="crossfit.png"
			desc={
				<p className="themeMidText">
					Those that want a taste of every discipline.
				</p>
			}
		/>,
		<StyleItem
			name="Weight Loss"
			image="fatburn.png"
			desc={
				<p className="themeMidText">There is no guesswork beyond this point.</p>
			}
		/>,
		<StyleItem
			name="Other"
			image="other.svg"
			desc={
				<p className="themeMidText">
					Not sure? We can discuss the plan later on.
				</p>
			}
		/>,
	];
	const [selected, setSelected] = useState(false);
	const [revising, setRevising] = useState(false);
	const [profile, setProfile] = useState(null);
	useEffect(() => {
		// if the user has an existing plan, load in their defaults
		if (_user && _user["plan"]) {
			const _style = styles.find(
				(style) =>
					String(style.props.name).toLowerCase() ===
					String(_user.plan.style).toLowerCase()
			);
			if (_style) {
				setChosenStyle(_style);
				setDescription(_style.props.desc);
				setSelected(true);
			}
			const _plan = _user["plan"];
			const keys = Object.keys(_plan);
			const values = Object.values(_plan);
			for (let i = 0; i < keys.length; i++) {
				methods.setValue(keys[i], String(values[i]));
			}
			setProfile(_user.plan);
		}
	}, []);
	function submit_plan() {
		const _plan = {
			...profile,
			style: chosenStyle.props.name,
		};
		if (_user["plan"] && _plan === _user.plan) return navigate("/training");
		console.log("final plan", _plan);
		// do the backend work
		postPlan(xToken, _user._id, _plan)
			.then((s) => {
				_setUser(s.data.user); // updated user w/ plan
				navigate("/training"); // redirect feedback
			})
			.catch((e) => {
				alert(e.response.data.message);
			});
	}
	return (
		<>
			{(!selected || revising) && (
				<div>
					<h1>Choose a Path</h1>
					<p className="themeMidText">
						Which training style best represents your goals?
					</p>
					<div className="hmargin styleList">
						{styles.map((style) => style)}
					</div>
					{/* <h1>{trainStyle}</h1> */}
					{chosenStyle && (
						<div className="actions" style={{ marginTop: "10px" }}>
							{description}
							<button
								className="coolButton hmargin"
								style={{ marginTop: "10px" }}
								onClick={() => {
									setRevising(false);
									setSelected(true);
								}}
							>
								Select
							</button>
						</div>
					)}
				</div>
			)}
			{selected && (
				<>
					{!revising && <h1>My Plan</h1>}
					{chosenStyle && !revising && (
						<div
							className={`selection themeBackMid active selected hmargin`}
							style={{ marginTop: "20px" }}
							onClick={() => {
								//setChosenStyle(null);
								setRevising(true);
								//setSelected(false);
							}}
						>
							<div className="info" style={{ cursor: "pointer" }}>
								<img
									className="themeIcon"
									src={`/traintypes/${chosenStyle.props.image}`}
									alt=""
								/>
							</div>
							<div className="sideText themeMidText">
								<h2 className="themeHighText">
									{chosenStyle.props.name || "STYLE NAME"}
								</h2>
								{chosenStyle.props.desc}
							</div>
						</div>
					)}
					{profile && !revising && (
						<div
							className={`selection themeBackMid active selected hmargin`}
							style={{ marginTop: "20px" }}
							onClick={() => setProfile(null)}
						>
							<div className="info health" style={{ cursor: "pointer" }}>
								<img className="themeIcon" src={`/diet.png`} alt="" />
							</div>
							<div className="sideText themeMidText">
								<h2 className="themeHighText">Health Info</h2>
								<p className="themeMidText">
									Weight <b>{profile.weight} lbs</b> Height{" "}
									<b>
										{profile.heightFt}' {profile.heightIn}"
									</b>
									<br />
									Level <b>{profile.experience}</b>{" "}
									<i>
										{profile.prevInjury === "true"
											? "Prior Injuries"
											: "No Injuries"}
									</i>
								</p>
							</div>
						</div>
					)}
					{!profile && (
						<FormProvider {...methods}>
							<SetupForm hide={revising} setData={(data) => setProfile(data)} />
						</FormProvider>
					)}
					{selected && !revising && profile && (
						<button
							className="coolButton hmargin"
							style={{ marginTop: "20px" }}
							onClick={submit_plan}
						>
							Submit Plan
						</button>
					)}
				</>
			)}
		</>
	);
}

export default SetupPage;
