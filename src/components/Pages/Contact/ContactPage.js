import "./Contact.scss";
function ContactPage() {
	return (
		<>
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
