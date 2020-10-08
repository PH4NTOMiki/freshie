/**
 * @see https://github.com/lukeed/pwa/blob/master/packages/cli/lib/util/pretty.js
 */

const UNITS = ['B', 'kB', 'MB', 'GB'];

export function size(val: number): string {
	if (!val) return '0.00 kB';
	let exp = Math.min(Math.floor(Math.log10(val) / 3), UNITS.length - 1) || 1;
	let out = (val / Math.pow(1e3, exp)).toPrecision(3);
	let idx = out.indexOf('.');
	if (idx === -1) {
		out += '.00';
	} else if (out.length - idx - 1 !== 2) {
		out = (out + '00').substring(0, idx + 3); // 2 + 1 for 0-based
	}
	return out + ' ' + UNITS[exp];
}

export function time(ms=0): string {
	return (ms / 1e3).toFixed(2) + 's';
}
