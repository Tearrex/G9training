import { useFormContext } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../Main/Contexts";

// missing commitment and nutrition fields
function SetupForm(props) {
	const { _user, _setUser } = useContext(CurrentUserContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useFormContext();
	const onSubmit = (data) => {
		console.log(data);
		if (Object.entries(errors).length === 0) {
			// submit now
			console.log("form looks good");
			props.setData(data);
		}
	};
	console.log(errors);
	const [injuries, setInjuries] = useState(false);
	useEffect(() => {
		if (_user && _user["plan"])
			setInjuries(String(_user.plan.prevInjury).toLowerCase() === "true");
	}, []);
	function injury_change(e) {
		console.log("THE TARGET SIR IS INDEED", e.target.value);
		setInjuries(String(e.target.value).toLowerCase() === "true");
	}
	return (
		<>
			{/* {!props.hide && <h1>Health Info</h1>} */}
			<form
				className="setupForm"
				onSubmit={handleSubmit(onSubmit)}
				style={{
					display: props.hide !== true ? null : "none",
					marginTop: "20px",
				}}
			>
				<label className="themeMidText">
					How much do you weight?
					<input
						type="number"
						placeholder="Pounds"
						className="simplenum"
						style={{ marginLeft: "10px" }}
						{...register("weight", {
							required: true,
							maxLength: 3,
							max: 4200,
						})}
					/>
					lbs
				</label>
				<div className="heightSection fineRadios themeMidText">
					What is your height?
					<div className="fineRadios fields">
						<label className="themeMidText">
							<input
								type="number"
								placeholder="Feet"
								{...register("heightFt", {
									required: true,
									maxLength: 3,
									max: 4200,
								})}
							/>
							'
						</label>
						<label className="themeMidText">
							<input
								type="number"
								placeholder="Inches"
								{...register("heightIn", {
									required: true,
									maxLength: 3,
									max: 4200,
								})}
							/>
							"
						</label>
					</div>
				</div>
				<div className="experienceSel themeHighText">
					<h3 className="themeMidText">What is your training experience?</h3>
					<div className="fineRadios">
						<label>
							<input
								{...register("experience", {
									required: true,
								})}
								type="radio"
								value="Beginner"
							/>
							Beginner
						</label>
						<label>
							<input
								{...register("experience", { required: true })}
								type="radio"
								value="Intermediate"
							/>
							Intermediate
						</label>
						<label>
							<input
								{...register("experience", { required: true })}
								type="radio"
								value="Advanced"
							/>
							Advanced
						</label>
						<label>
							<input
								{...register("experience", { required: true })}
								type="radio"
								value="Athlete"
							/>
							Athlete
						</label>
					</div>
				</div>
				<div className="injurySection themeHighText">
					<h3 className="themeMidText">
						Do you have a history of physical injuries?
					</h3>
					<div className="fineRadios">
						<label>
							<input
								{...register("prevInjury", {
									required: true,
									onChange: injury_change,
								})}
								type="radio"
								value="true"
							/>
							Yes
						</label>
						<label>
							<input
								{...register("prevInjury", {
									required: true,
								})}
								type="radio"
								value="false"
							/>
							No
						</label>
					</div>
				</div>
				<div style={{ display: !injuries ? "none" : null }}>
					<h3 className="themeMidText">
						Please describe your injuries in detail.
					</h3>
					<textarea
						rows="4"
						col="50"
						placeholder="How long ago? Do they still persist?"
						className="simpleText"
						{...register("prevInjuryInfo", { required: false })}
					/>
				</div>
				<div className="goalsSection">
					<label>
						<h3 className="themeMidText">
							What are your main goals with training?
						</h3>
						<textarea
							rows="3"
							col="50"
							placeholder="Give an idea of what you're after..."
							className="simpleText"
							{...register("trainGoals", { required: false })}
						/>
					</label>
				</div>
				<input type="submit" className="coolButton hmargin" value="Continue" />
			</form>
		</>
	);
}

export default SetupForm;
