const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatExpenseDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / DAY_IN_MS,
  );

  if (diffDays === 0) {
    return 'Bugün';
  }

  if (diffDays === 1) {
    return 'Dün';
  }

  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function isExpenseInCurrentMonth(isoDate: string, now = new Date()): boolean {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function getExpenseCreatedAtTime(isoDate: string): number {
  const time = new Date(isoDate).getTime();
  return Number.isNaN(time) ? 0 : time;
}
