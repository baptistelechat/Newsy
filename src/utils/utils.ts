export const formatDate = (dateString?: string) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
