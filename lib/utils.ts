export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(isoString: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes} KST`;
}

export function formatKRW(amount: number): string {
  return amount.toLocaleString('ko-KR') + ' KRW';
}

export function getTimeUntil(isoString: string): { days: number; hours: number; minutes: number; isPast: boolean } {
  const now = new Date().getTime();
  const target = new Date(isoString).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isPast: false };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ongoing': return 'var(--green)';
    case 'ended': return 'var(--red)';
    case 'upcoming': return 'var(--blue)';
    default: return 'var(--text-secondary)';
  }
}
