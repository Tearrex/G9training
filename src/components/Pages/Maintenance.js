function Maintenance() {
	return (
		<div className="cmodal">
			{/*Have the h1 element display the status message that is to be
			broadcoasted by the server to keep the users updated*/}
			<h1>Check back later...</h1>
			<img src="/plug.svg" className="themeIcon stretchy" />
			<p className="skinnyTitle themeMidText">
				This website area is currently being serviced.
				<br />
				We appreciate your patience.
			</p>
		</div>
	);
}

export default Maintenance;
