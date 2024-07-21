export function zeroPad(a: number, length: number = 2): string {
return String(a).padStart(2, '0');
}