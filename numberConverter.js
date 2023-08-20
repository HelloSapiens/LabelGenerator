// A janky number-to-alpha-chars-only base26 converter...
// A note on ranges:
// Max with 1 chars: 26
// Max with 2 chars: 676
// Max with 3 chars: 17.576
// Max with 4 chars: 456.976
// Max with 5 chars: 11.881.376
class NumberConverter {
    #allowedChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    #replacementValues = ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    #radix = this.#allowedChars.length + this.#replacementValues.length;
    #transpose = (intVal) => this.#replacementValues[intVal];
    #moduloValue = 23;
    constructor() {
        console.debug(`Initialized base ${this.#radix} number converter.`);
    }
    Convert = (intX) => {
        return [...intX.toString(this.#radix)].map(c => {
            const base10 = parseInt(c, 10);
            const converted = isNaN(base10) ? c.toUpperCase() : this.#transpose(base10);
            const checksum = '';
            return `${converted}${checksum}`;
        }).join('');
    }
    ConvertWithChecksum = (intX) => {
        return this.Convert(intX) + this.Convert(intX % this.#moduloValue);
    }
    Unconvert = (strCode) => {
        let decimalValue = 0;

        for (let i = 0; i < strCode.length; i++) {
            const currentChar = strCode.charAt(i);

            if (this.#allowedChars.includes(currentChar)) {
                const charIndex = this.#allowedChars.indexOf(currentChar);
                decimalValue = decimalValue * this.#radix + charIndex;
            } else if (this.#replacementValues.includes(currentChar)) {
                const replacementIndex = this.#replacementValues.indexOf(currentChar);
                const digitValue = this.#allowedChars.length + replacementIndex;
                decimalValue = decimalValue * this.#radix + digitValue;
            } else {
                // Invalid character found, return a value indicating error
                return NaN;
            }
        }

        return decimalValue;
    }

    UnconvertWithChecksum = (strCodeWithChecksum) => {
        const strCode = strCodeWithChecksum.slice(0, -1); // Removes the last character (checksum)
        const checksum = strCodeWithChecksum.slice(-1); // Get the last character (checksum)
        const error = checksum !== this.Convert(this.Unconvert(strCode) % this.#moduloValue);
        const value = error ? NaN : this.Unconvert(strCode);        
        return { error, value };        
    }
}