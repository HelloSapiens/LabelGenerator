// A janky number-to-alpha-chars-only base26 converter...
// A note on ranges:
// Max with 1 chars: 26
// Max with 2 chars: 676
// Max with 3 chars: 17.576
// Max with 4 chars: 456.976
// Max with 5 chars: 11.881.376
class NumberConverter {
    #allowedChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    #replacementValues = ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    #radix = this.#allowedChars.length + this.#replacementValues.length;
    #transpose = (intVal) => this.#replacementValues[intVal];
    constructor() {
        console.debug(`Initialized base ${this.#radix} number converter.`);
    }
    Convert = (intX) => {                
        return [...intX.toString(this.#radix)].map(c => {
            var base10 = parseInt(c, 10);
            return isNaN(base10) ? c.toUpperCase() : this.#transpose(base10);
        }).join('');
    }
}