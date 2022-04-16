import { useState } from "react";
import FeatureItem from "../HomeComps/FeatureItem";

function ServicesPage() {
	const [sessionPrice, setSessionPrice] = useState(0);
	const [eachSesh, setEachSesh] = useState(0);
	const pricing = {
		4: 240.0,
		8: 420.0,
		12: 540.0,
		16: 680.0,
	};
	function set_pricing(e) {
		var value = e.target.value;
		var price = pricing[String(value)];
		setSessionPrice(price);
		setEachSesh(price / value);
	}
	return (
		<div>
			<div className="themeBackMid nicePad perks">
				<h1>The Perks</h1>
				<p>No matter which path you take, you can always expect:</p>
				<ul className="bullets themeMidText" style={{ marginBottom: 0 }}>
					<li>An experience tailored to your body and ambition.</li>
					<li>
						Honest and constructive feedback, <i>sugarcoating not included</i>.
					</li>
					<li>Regular check-ins and evaluative assessments.</li>
					<li>
						Prompt guidance and messaging through the <b>TrainHeroic</b> app.
					</li>
					{/* {<li>Endorphin-boosting exercises to make you feel like a champ!</li>} */}
					<li>
						My full energy and support, I only ask that you give it your all 🔥
					</li>
				</ul>
			</div>
			<div className="featureList">
				<FeatureItem
					icon="/spotter.svg"
					title="In-person"
					color="#ea5329"
					fancy
					padTop
				>
					<p className="description">
						Great for developing a solid synergy between us while being able to
						provide you with the best, in-depth coaching environment that I can.{" "}
						Ideal for those in the local area and/or that need an extra push.
					</p>
					<ul className="themeMidText">
						<li>TrainHeroic membership</li>
						<li>One on one 60 minute sessions</li>
						<li>Equipment provided</li>
					</ul>
					<div className="pricing">
						<p>
							Amount of sessions <span style={{ color: "#ea5329" }}>*</span>
						</p>
						{/*4 8 12 16*/}
						<div className="seshSelect">
							<div className="amount">
								<input
									type="radio"
									id="s4"
									name="session_amount"
									value="4"
									onChange={set_pricing}
								/>
								<label htmlFor="s4">4</label>
							</div>
							<div className="amount">
								<input
									type="radio"
									id="s8"
									name="session_amount"
									value="8"
									onChange={set_pricing}
								/>
								<label htmlFor="s8">8</label>
							</div>
							<div className="amount">
								<input
									type="radio"
									id="s12"
									name="session_amount"
									value="12"
									onChange={set_pricing}
								/>
								<label htmlFor="s12">12</label>
							</div>
							<div className="amount">
								<input
									type="radio"
									id="s16"
									name="session_amount"
									value="16"
									onChange={set_pricing}
								/>
								<label htmlFor="s16">16</label>
							</div>
						</div>
						{sessionPrice > 0 && (
							<>
								<h2
									className="skinnyTitle"
									style={{ margin: 0, marginTop: "10px" }}
								>
									<span className="currency">${sessionPrice}</span>
								</h2>
								<p className="sideNote">
									{Number(eachSesh).toFixed(2)}$ per session
								</p>
							</>
						)}
						{/* <a
							href="https://docs.google.com/forms/d/e/1FAIpQLScd265Iyf1gVkrIjvSxr8XkTmsNA4C-rWip9kNy-R_n9US5aw/viewform"
							target="_blank"
							rel="noreferrer"
						>
							<button className="inPersonRegBtn">
								<i className="fas fa-file-alt"></i>
								<p>Google Form</p>
							</button>
						</a> */}
					</div>
				</FeatureItem>
			</div>
			<div className="themeMidText" style={{ paddingBottom: "40px" }}>
				<span style={{ color: "#ea5329" }}>*</span> Sessions bought in bulk,
				paid upfront.
			</div>
		</div>
	);
}

export default ServicesPage;
