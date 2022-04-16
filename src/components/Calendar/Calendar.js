import { useContext, useEffect, useState } from "react";
import {
	CurrentUserContext,
	DateContext,
	ScheduleDismissContext,
	xTokenContext,
} from "../Main/Contexts";
import SessionForm from "../AccountManagement/Sessions/SessionForm";
import "./Calendar.scss";
import CalendarWeek from "./CalendarWeek";
import { Link } from "react-router-dom";
function Calendar(props) {
	const { xToken, setXToken } = useContext(xTokenContext);
	const { _user, _setUser } = useContext(CurrentUserContext);
	const { dismiss, setDismiss } = useContext(ScheduleDismissContext);

	const { _date, _setDate } = useContext(DateContext);
	const [curMonth, setCurMonth] = useState(0);
	const [curYear, setCurYear] = useState(0);
	const [curWeeks, setCurWeeks] = useState([]);
	const _today = new Date();

	const [plan, setPlan] = useState(null);
	useEffect(() => {
		// check if user has filled out the application form, called the "plan"
		const _plan = localStorage.getItem("formPlan");
		if (!_plan) return;
		setPlan(JSON.parse(_plan));
	}, []);

	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	function getDaysOfMonth(month, year) {
		// start off at the first day of the given month and year
		// then increment over subsequent days of the month
		var date = new Date(year, month, 1);
		var days = [];
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	}
	function getWeeksInMonth(days) {
		var weeks = [];
		var week = new Array(7).fill(null);

		for (let i = 0; i < days.length; i++) {
			week[days[i].getDay()] = days[i];
			// is it a saturday?
			if (days[i].getDay() === 6 || i === days.length - 1) {
				// add the week and reset the local array for the next
				weeks.push(week);
				if (i <= days.length - 1) week = new Array(7).fill(null);
			}
		}
		return weeks;
	}
	useEffect(() => {
		var date = new Date();
		setCurMonth(date.getMonth());
		setCurYear(date.getFullYear());
	}, []);
	useEffect(() => {
		if (curYear === 0) return;
		var days = getDaysOfMonth(curMonth, curYear);
		var weeks = getWeeksInMonth(days);
		setCurWeeks(weeks);
	}, [curMonth, curYear]);
	function change_month(amount) {
		if (
			curMonth + amount < _today.getMonth() &&
			curYear <= _today.getFullYear()
		)
			return;
		if (curMonth + amount < 0) {
			setCurMonth(11);
			setCurYear(curYear - 1);
		} else if (curMonth + amount > 11) {
			setCurMonth(0);
			setCurYear(curYear + 1);
		} else setCurMonth(curMonth + amount);
	}
	return (
		<div className="calendarField">
			{_user && !_user.trainer && (
				<h1 style={{ fontWeight: "lighter" }}>Book a session with me</h1>
			)}
			<div className="calendarBody">
				{!plan && (
					<div
						className="overlay flex-center"
						style={{ display: _user && dismiss ? "none" : null }}
					>
						<div className="consultNote">
							<h3>Let's plan the grind!</h3>
							<p>
								To deliver the best experience, we ask that you provide some
								basic details about your body and health prior to our initial
								meeting.
							</p>
						</div>

						<Link to="/setup">
							<button className="formBtn">
								<img src="/diet.png" alt="Application" />
								<p style={{ display: dismiss ? null : "none", color: "#fff" }}>
									Fill out application
								</p>
							</button>
						</Link>
					</div>
				)}
				<div className="monthCycle">
					<button
						onClick={() => change_month(-1)}
						style={{
							opacity:
								(curMonth > _today.getMonth() &&
									curYear >= _today.getFullYear()) ||
								(curMonth >= _today.getMonth() &&
									curYear > _today.getFullYear())
									? null
									: "0",
						}}
					>
						«
					</button>
					<h1>
						{months[curMonth]} {curYear}
					</h1>
					<button onClick={() => change_month(1)}>»</button>
				</div>
				<ul className="weekDays">
					<li>Su</li>
					<li>Mo</li>
					<li>Tu</li>
					<li>We</li>
					<li>Th</li>
					<li>Fr</li>
					<li>Sa</li>
				</ul>
				{curWeeks !== undefined &&
					curWeeks.map((week, i) => <CalendarWeek key={i} week={week} />)}
			</div>
			{_date && <SessionForm />}
		</div>
	);
}

export default Calendar;
