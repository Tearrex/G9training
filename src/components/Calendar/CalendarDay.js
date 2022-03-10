import { useContext } from "react";
import { DateContext, sessionsContext } from "../Main/Contexts";

function CalendarDay(props) {
	const { _date, _setDate } = useContext(DateContext);
	const { sessions, setSessions } = useContext(sessionsContext);
	const { day } = props; // provided by CalendarWeek component

	var className = null;
	const _today = new Date();
	if (day) {
		// check if the client has an upcoming session with this component's date
		var _sesh = sessions.length > 0 && sessions.find(
			(sesh) => new Date(sesh.sessionDate).toDateString() === day.toDateString()
		);
		if (_sesh) {
			// session was a success (hopefully)
			if (_sesh.attended && _sesh.approved) className = "attended";
			// trainer confirmed the session
			else if (_sesh.approved) className = "approved";
			// trainer has not confirmed the session yet
			else className = "pending";
		}
		// did the client select this date?
		else if (_date && day.toDateString() === _date.toDateString())
			className = "active";
		// is it today's date?
		else if (day.toDateString() === _today.toDateString())
			className = "current";
		// has the date passed?
		else if (day < _today) className = "past";
	}
	// empty slot in calendar
	else className = "inactive";

	function select_date(date) {
		if (date && date > _today && !className) _setDate(date);
	}
	return (
		<li onClick={() => select_date(day)} className={className}>
			{day && day.getDate()}
		</li>
	);
}

export default CalendarDay;
