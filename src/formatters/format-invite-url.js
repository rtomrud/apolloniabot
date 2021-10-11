export default function ({
  client_id,
  permissions,
  scope = ["applications.commands", "bot"],
}) {
  return `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=${permissions}&scope=${encodeURIComponent(
    scope.join(" ")
  )}`;
}
