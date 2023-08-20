# LabelGenerator

A janky javascript/css/html bundle to help create and format stickers/labels with QR codes

This implementation relies on the user printing from their browsers... A bit of adjustments and fiddling around with margens etc. is probably required due to the peculiarities that occur in the mix of browsers, printers and operating systems. Good luck...

## Usage

Modify the ```2-triplet-columns.html``` to your liking. Sizes, margins, etc. are controlled by the css classes directly in the header of the file.
The sticker generator must be initalized with a configuration object, e.g.

```javascript
const stickerConfig = {
    codes_per_grouping: 3, // Set to 1 to disable
    codes_per_page: PerPage,
    genesisElementId: 'genesis',
    size: 32,   
    getCode: seed => (seed >= Pages * PerPage) ? false : cvt.Convert(seed + 676), // 676 offsets the 1 and 2-character ranges
}
```

The function supplied in ```getCode``` should take a seed value (integer indicating how many codes have been added so far) and return either a code to be added or ```false```.

In this case we are using a number converter to have our codes consisting of only 3-character alpha strings (ie. no numbers).

You can also check out the ```2x4-labels.html``` to start off with a set-up with larger labels (8 per page) and some very rudimentary logic to keep track of printed codes.

- Shout-out to [davidshimjs](https://github.com/davidshimjs) who created the [QRCode.js library used in this bundle](https://github.com/davidshimjs/qrcodejs/tree/master). 
Copyright (c) 2012 under this [license (MIT)](https://raw.githubusercontent.com/davidshimjs/qrcodejs/master/LICENSE)
