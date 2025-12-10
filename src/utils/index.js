export function fromApp() {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    ua
  );
}

// 简单日期格式化：默认输出 YYYY-MM-DD HH:mm:ss
export function dateFormat(date, _formatter = "YYYY-MM-DD HH:mm:ss") {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const s = pad(d.getSeconds());

  return `${y}-${m}-${day} ${h}:${mi}:${s}`;
}
