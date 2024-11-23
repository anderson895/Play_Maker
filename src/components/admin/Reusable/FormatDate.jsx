export const formatDateTime = (date, time) => {
  const eventDate = new Date(`${date}T${time}`);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return { formattedDate, formattedTime };
};
