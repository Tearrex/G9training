import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { fSettings } from "../../../fSettings";
import { postInquiry } from "../../../services/clientsService";
import "./Contact.scss";
function ContactPage() {
	const captchaRef = useRef();
	const [showCaptcha, setShowCaptcha] = useState(false);

	const [name, setName] = useState(""); // user's name
	const [email, setEmail] = useState(""); // user's email
	const [message, setMessage] = useState(""); // user's message

	const [sending, setSending] = useState(false); // true after captcha is passed
	const [complete, setComplete] = useState(false); // server's success message
	const [error, setError] = useState(null); // server's error messages
	function handle_form(e) {
		e.preventDefault();
		setShowCaptcha(true);
	}
	function finish() {
		const _json = {
			name: name,
			email: email,
			clientNote: message,
		};
		setSending(true);
		setTimeout(() => {
			postInquiry(_json)
				.then((s) => {
					localStorage.setItem("contactUsed", true); // prevent further submissions, for now.
					setComplete("We received your message. Thank you for your interest!");
				})
				.catch((e) => {
					console.log(e);
					alert(e.response.data.message);
					setSending(false);
				});
		}, 2000);
	}
	useEffect(() => {
		if (localStorage.getItem("contactUsed"))
			setComplete("We received your message. Thank you for your interest!");
	}, []);
	return (
		<>
			<main className="contactField">
				<div className="info">
					<h1>Let's talk.</h1>
					<hr className="redLine"></hr>
					<p className="themeMidText">
						If you'd like to request more information, please leave us a message
						with your name and contact email. Happy to assist in your journey!
					</p>
				</div>
				{!complete ? (
					<form onSubmit={handle_form}>
						<div>
							<label htmlFor="name" className="themeMidText">
								Name
							</label>
							<input
								type="text"
								name="name"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="email" className="themeMidText">
								Email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<label htmlFor="msg" className="themeMidText">
							Message
						</label>
						<textarea
							rows="3"
							col="70"
							name="msg"
							id="msg"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						></textarea>
						{showCaptcha && (
							<ReCAPTCHA
								ref={captchaRef}
								sitekey={fSettings.siteKey}
								size="normal"
								onChange={finish}
								theme="dark"
							/>
						)}
						{String(name).trim() !== "" &&
							String(email).trim() !== "" &&
							String(message).trim() !== "" &&
							!sending && (
								<input
									type="submit"
									value="SEND"
									className="hmargin coolButton sharp"
								/>
							)}
						{sending && (
							<p className="status themeHighText">
								<i className="fas fa-spinner spin"></i> Sending to server...
							</p>
						)}
					</form>
				) : (
					<p className="status themeHighText">
						<i className="fas fa-paper-plane"></i> {complete}
					</p>
				)}
			</main>
			<section className="instaPage hmargin">
				<div className="info">
					<h1>Check out the instagram page</h1>
					<p className="themeMidText">
						For a little inside look at the grind and our commitment to quality
						fitness.
					</p>
					<a
						href="https://www.instagram.com/gonz9training/"
						target="_blank"
						rel="noreferrer"
					>
						<button>
							<i className="fab fa-instagram"></i>
							<p>Follow Us</p>
						</button>
					</a>
				</div>
				<div className="instaGrid">
					<div className="small">
						<img src="/insta_s1.jpg" alt="media" className="textHog" />
						<img src="/insta_s2.jpg" alt="media" />
					</div>
					<a
						href="https://www.instagram.com/p/B2msrHRFu7o/"
						target="_blank"
						rel="noreferrer"
						style={{ position: "relative" }}
					>
						<i className="fas fa-external-link-alt icon"></i>
						<img src="/insta_b1.jpg" alt="media" />
					</a>
				</div>
			</section>
		</>
	);
}

export default ContactPage;
