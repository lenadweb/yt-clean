export const formatNumber = (value: string | number, exp = false): string => {
    if (isNaN(Number(value))) return value.toString();

    const num = Number(value);

    if (exp && Math.abs(num) >= 1e17) {
        return num.toExponential(10);
    }

    if (Math.abs(num) >= 1e14) {
        return num.toExponential(10);
    }

    let originalStr = typeof value === 'string' ? value : value.toString();
    originalStr = originalStr.replace(',', '.');

    const hasDot = originalStr.includes('.');

    let [integerPartRaw, fractionalPart] = originalStr.split('.');
    if (fractionalPart === undefined) fractionalPart = '';

    if (
        integerPartRaw === '' ||
        integerPartRaw === '-' ||
        integerPartRaw === '+'
    ) {
        integerPartRaw = '0';
    }

    let formattedInteger = new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 19,
        useGrouping: true,
    }).format(Number(integerPartRaw));
    formattedInteger = formattedInteger.replace(/\u00A0/g, ' ');

    if (hasDot) {
        return `${formattedInteger}.${fractionalPart}`;
    }

    return formattedInteger;
};

export const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const parts = [];

    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h === 0) parts.push(`${m}m`);

    return parts.join(' ');
};
