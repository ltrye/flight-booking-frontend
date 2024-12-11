export function getFormattedDate(date: string | Date) {
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
