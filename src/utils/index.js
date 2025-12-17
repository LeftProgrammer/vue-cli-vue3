export function fromApp() {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

// 简单日期格式化：默认输出 YYYY-MM-DD HH:mm:ss
export function dateFormat(date, _formatter = "YYYY-MM-DD HH:mm:ss") {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const pad = n => (n < 10 ? `0${n}` : `${n}`);

  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const s = pad(d.getSeconds());

  return `${y}-${m}-${day} ${h}:${mi}:${s}`;
}

export function computeTimeDuration(startTime, endTime) {
  const toDate = t => {
    if (t instanceof Date) return t;
    if (typeof t === "number") return new Date(t);
    if (typeof t === "string") {
      const safe = t.replace(/-/g, "/");
      const d = new Date(safe);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  };

  const date1 = toDate(startTime);
  const date2 = toDate(endTime);
  if (!date1 || !date2) {
    return { durationText: "", days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const dateDiff = date2.getTime() - date1.getTime();
  const days = Math.floor(dateDiff / (24 * 3600 * 1000));
  const residue1 = dateDiff % (24 * 3600 * 1000);
  const hours = Math.floor(residue1 / (3600 * 1000));
  const residue2 = residue1 % (3600 * 1000);
  const minutes = Math.floor(residue2 / (60 * 1000));
  const residue3 = residue2 % (60 * 1000);
  const seconds = Math.round(residue3 / 1000);

  const durationText =
    (days === 0 ? "" : `${days}天`) +
    (hours === 0 ? "" : `${hours}时`) +
    (minutes === 0 ? "" : `${minutes}分`) +
    (seconds === 0 ? "" : `${seconds}秒`);

  return {
    durationText,
    days,
    hours,
    minutes,
    seconds,
  };
}
