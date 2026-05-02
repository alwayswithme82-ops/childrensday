import html2canvas from 'html2canvas';

export async function downloadCertificate(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
