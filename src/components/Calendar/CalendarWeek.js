import CalendarDay from "./CalendarDay";

function CalendarWeek(props) {
    const { week } = props;
    return (
        <ul className="calendarWeek">
            {
            week.map((day, i) => <CalendarDay key={i} day={day}/>)
            }
        </ul>
    );
}

export default CalendarWeek;