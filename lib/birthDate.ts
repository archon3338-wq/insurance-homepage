export function normalizeBirthDate(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    return isValidYmd(digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8))
      ? `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
      : "";
  }
  if (digits.length !== 6) return "";

  const yy = Number(digits.slice(0, 2));
  const mm = digits.slice(2, 4);
  const dd = digits.slice(4, 6);
  const today = new Date();
  const as20 = toDate(2000 + yy, mm, dd);
  if (as20 && as20 <= today && yearsSince(as20, today) < 100) {
    return formatYmd(2000 + yy, mm, dd);
  }
  const as19 = toDate(1900 + yy, mm, dd);
  if (as19 && as19 <= today) {
    return formatYmd(1900 + yy, mm, dd);
  }
  return "";
}

export function isAdultBirth(value: string) {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : normalizeBirthDate(value);
  if (!iso) return false;
  const birth = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 19;
}

function isValidYmd(year: string, mm: string, dd: string) {
  return Boolean(toDate(Number(year), mm, dd));
}

function toDate(year: number, mm: string, dd: string) {
  if (!/^(0[1-9]|1[0-2])$/.test(mm) || !/^(0[1-9]|[12]\d|3[01])$/.test(dd)) return null;
  const iso = `${year}-${mm}-${dd}`;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getMonth() + 1 !== Number(mm) || date.getDate() !== Number(dd)) return null;
  return date;
}

function formatYmd(year: number, mm: string, dd: string) {
  return `${year}-${mm}-${dd}`;
}

function yearsSince(birth: Date, today: Date) {
  return today.getFullYear() - birth.getFullYear();
}
