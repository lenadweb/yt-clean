interface OperaGlobal {
    opr?: unknown;
}

export const isOpera = () =>
    typeof (globalThis as OperaGlobal).opr !== 'undefined';
