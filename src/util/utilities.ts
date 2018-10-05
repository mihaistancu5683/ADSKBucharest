import Day from "../classes/day";

const Utilities = (function () {
  const weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

  const GetSimpleDateFromToday = function (addDays: number): Day {
    const today = new Date(new Date().getTime() + addDays * 24 * 60 * 60 * 1000); // Tue Sep 25 2018 22:23:40 GMT+0030 (Eastern...)
    const dn = weekday[today.getDay()];
    const dd = today.getDate(); // 25
    const mm = today.getMonth() + 1; // 9 - January is 0!
    const yyyy = today.getFullYear(); // 2018
    const justDate = new Date(yyyy, mm - 1, dd);
    const prettyToday = `${dn} ${dd}/${mm}/${yyyy}`;
    const day = new Day();
    day.internalDate = justDate; // 2018-09-24 21:00:00.000Z
    day.userDate = prettyToday; // Thu 26/9/2018
    return day;
  };

  return {
    GetSimpleDateFromToday: GetSimpleDateFromToday
  };
})();
export default Utilities;