export default class DateTime {
  static formatTime(date: string | Date) {
    date = new Date(date);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour clock to 12-hour clock
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 => 12)

    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  static formatDate(date: string | Date) {
    date = new Date(date);
    if (this.isToday(date)) return "Today";
    if (this.isYesterday(date)) return "Yesterday";
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  static isSameDay(date1: string | Date, date2: string | Date) {
    date1 = new Date(date1);
    date2 = new Date(date2);

    const earlier = new Date(Math.min(date1.getTime(), date2.getTime()));
    const later = new Date(Math.max(date1.getTime(), date2.getTime()));

    // Compare day values
    return (
      earlier.getDate() === later.getDate() &&
      earlier.getMonth() === later.getMonth() &&
      earlier.getFullYear() === later.getFullYear()
    );
  }

  static isToday(date: string | Date) {
    date = new Date(date);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  static isYesterday(date: string | Date) {
    date = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }

  static difference(start: Date, end: Date) {
    start = new Date(start);
    end = new Date(end);
    const millisInOneSec = 1000;
    const secsInOneMin = 60;
    const minsInOneHr = 60;
    const hrsInOneDay = 24;
    const diffInMillis = end.getTime() - start.getTime();
    const inSecs = Math.ceil(diffInMillis / millisInOneSec);
    const inMins = Math.ceil(diffInMillis / (millisInOneSec * secsInOneMin));
    const inHrs = Math.ceil(
      diffInMillis / (millisInOneSec * secsInOneMin * minsInOneHr)
    );
    const inDays = Math.ceil(
      diffInMillis / (millisInOneSec * secsInOneMin * minsInOneHr * hrsInOneDay)
    );
    const difference =
      inSecs < secsInOneMin
        ? `${inSecs} sec`
        : inMins < minsInOneHr
        ? `${inMins} mins`
        : inHrs < hrsInOneDay
        ? `${inHrs} hours`
        : `${inDays} days`;
    return difference;
  }
}
