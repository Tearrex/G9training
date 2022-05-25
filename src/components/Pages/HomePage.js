import FeatureItem from "../HomeComps/FeatureItem";

import { Link } from "react-router-dom";

function HomePage() {
	const mainTheme = "#EF2853";
	const asterisk = <span style={{ color: mainTheme }}>*</span>;
	return (
		<>
			<div
				className="homeHiglight bg-center"
				style={{ backgroundImage: "url('/workout.jpg')" }}
			>
				<div className="flex-col-center textNest">
					<div className="jumper">
						<a href="#overview">
							<button>
								<i className="fas fa-chevron-down"></i>
							</button>
						</a>
					</div>
					<img src="/fullg9.png" className="full-logo" />
					<h2 style={{ color: "#fff" }}>
						Ready to challenge yourself?
						<br />
						Take your fitness to the next level!
					</h2>
				</div>
			</div>
			<div id="overview" style={{ padding: "40px 0" }}>
				<h1 className="nWeight">The Overview</h1>
				<div className="featureList">
					<FeatureItem
						icon="/calendar.png"
						title="FLEXIBILITY"
						color={mainTheme}
						padded
						noback
					>
						<p className="themeMidText">
							Busy schedule? I offer both in-person and online training services
							for your convenience. You can also inquire about{" "}
							<b>hybrid training programs</b>.
						</p>
					</FeatureItem>
					<FeatureItem
						icon="/flex.png"
						title="WITNESS GAINS"
						color={mainTheme}
						padded
						noback
					>
						<p className="themeMidText">
							I work closely with every individual to make them feel proud of
							their commitment, <b>trust the process</b> of your efforts.{" "}
							{asterisk} On average, our clients begin to notice results at the
							3 month mark.
						</p>
					</FeatureItem>
					<FeatureItem
						icon="/adapt.png"
						title="ADAPTIVE LESSONS"
						color={mainTheme}
						padded
						noback
					>
						<p className="themeMidText">
							Your training will be adjusted with each subsequent assessment to
							ensure the program stays up to par with your goals.{" "}
							<b>We are a team</b> and you're always welcome to exchange
							feedback with me!
						</p>
					</FeatureItem>
				</div>
				<p className="themeHighText">
					{asterisk} Every body is different, it ultimately depends on your
					determination.
				</p>
			</div>
			<div className="steps themeBackHigh" style={{ padding: "70px 0" }}>
				<h1 className="nWeight">Steps to success:</h1>
				<hr className="redLine"></hr>
				<div className="featureList">
					<FeatureItem icon="/nutrition.png" title="KNOW YOUR FOODS" padded>
						<p className="themeHighText">
							Diets are a touchy subject, but no matter what you're aiming
							for—weight loss, bodybuilding, crossfitting, etc.—
							<b>meal plans</b> are key to achieving optimal results. We will go
							through the details to help you get in shape <i>faster</i>!
						</p>
					</FeatureItem>
					<FeatureItem icon="/graph3.png" title="TRACK YOUR GROWTH" padded>
						<p className="themeHighText">
							Keeping score is a great way to <b>stay motivated</b> and look
							back on your improvements over time. You will get familiar with
							tools like TrainHeroic to keep in touch and record every step of
							the way.
						</p>
					</FeatureItem>
				</div>
			</div>
			<div className="homeGame" id="homeGame">
				<h1 className="centerMargin niceWidth">
					Want to <i>1 UP</i> your game?
				</h1>
				<p
					style={{ lineHeight: "2rem" }}
					className="themeMidText centerMargin niceWidth"
				>
					Consult with me to see if my services are the right fit for you. All
					it takes is showing up 💪
					<br />
				</p>
				<Link to="/services" className="centerMargin">
					<button
						className="coolButton sharp blood"
						onClick={() => window.scrollTo(0, 0)}
					>
						VIEW RATES
					</button>
				</Link>
				<Link to="/contact" className="centerMargin">
					<button
						className="coolButton sharp blood"
						onClick={() => window.scrollTo(0, 0)}
					>
						CONTACT US
					</button>
				</Link>
			</div>
		</>
	);
}

export default HomePage;
