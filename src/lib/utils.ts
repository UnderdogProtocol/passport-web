import {
  format,
  differenceInDays,
  isToday,
  isYesterday,
  formatDistanceToNow,
  differenceInMilliseconds,
  isSameYear,
  isSameDay,
} from "date-fns";

export const formatTimestamp = (timestampString: string) => {
  const parsedDate = new Date(timestampString);
  const currentDate = new Date();
  const distance = formatDistanceToNow(parsedDate);
  const timeDifference = differenceInMilliseconds(currentDate, parsedDate);

  if (isSameDay(currentDate, parsedDate)) {
    // If it's the same day, show "Today" and the time
    return `Today, ${format(parsedDate, "hh:mma")}`;
  }
  if (timeDifference < 86400000) {
    // If it was sent within the last 24 hours but not today, show the time
    return format(parsedDate, "hh:mma");
  }
  if (timeDifference < 172800000) {
    // If it was sent within the last 48 hours, show "Yesterday" and the time
    return `Yesterday, ${format(parsedDate, "hh:mma")}`;
  }
  const formattedDate = isSameYear(currentDate, parsedDate)
    ? format(parsedDate, "E, MMM d, hh:mma")
    : format(parsedDate, "E, MMM d, yyyy, hh:mma");

  return `${formattedDate} (${distance} ago)`;

  // const parsedDate = new Date(timestampString);
  // const currentDate = new Date();
  // const distance = formatDistanceToNow(parsedDate);
  // const timeDifference = differenceInMilliseconds(currentDate, parsedDate);

  // if (timeDifference < 86400000) {
  //   // If it was sent within the last 24 hours, show the time
  //   return format(parsedDate, 'hh:mma');
  // } else if (timeDifference < 172800000) {
  //   // If it was sent within the last 48 hours, show "Yesterday" and the time
  //   return `Yesterday, ${format(parsedDate, 'hh:mma')}`;
  // } else {
  //   const formattedDate = isSameYear(currentDate, parsedDate)
  //     ? format(parsedDate, 'E, MMM d, hh:mma')
  //     : format(parsedDate, 'E, MMM d, yyyy, hh:mma');

  //   return `${formattedDate} (${distance} ago)`;
  // }

  // const parsedDate = new Date(timestampString);
  // const currentDate = new Date();
  // const distance = formatDistanceToNow(parsedDate);
  // const timeDifference = differenceInMilliseconds(currentDate, parsedDate);

  // if (timeDifference < 86400000) {
  //   // If it was sent within the last 24 hours, show the time
  //   return format(parsedDate, 'hh:mma');
  // } else if (timeDifference < 172800000) {
  //   // If it was sent within the last 48 hours, show "Yesterday" and the time
  //   return `Yesterday, ${format(parsedDate, 'hh:mma')}`;
  // } else {
  //   // Show the formatted date and the number of days ago
  //   return `${format(parsedDate, 'E, MMM d, hh:mma')} (${distance} ago)`;
  // }

  //   const parsedDate = new Date(timestampString);
  //   const currentDate = new Date();

  //   if (isToday(parsedDate)) {
  //     // Format for today
  //     return format(parsedDate, "hh:mma '(today)'");
  //   } else if (isYesterday(parsedDate)) {
  //     // Format for yesterday
  //     return format(parsedDate, "hh:mma '(yesterday)'");
  //   } else if (differenceInDays(currentDate, parsedDate) <= 7) {
  //     // Format for within the last 7 days
  //     return format(parsedDate, "EEE, MMM d, hh:mma");
  //   } else {
  //     // Format for older dates
  //     return format(parsedDate, 'MMM d');
  //   }
};
