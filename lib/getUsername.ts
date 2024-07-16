export default function getUsername(name: string): string {
  return name.split(" ").join("").toLowerCase();
}
