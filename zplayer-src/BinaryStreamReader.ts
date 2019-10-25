/*import { Observable } from "https://dev.jspm.io/rxjs@6/_esm2015/index.js";

enum TextMode {
    UTF32BE,
    UTF32LE,
    UTF16BE,
    UTF16LE,
    UTF8,
    Default
}

export class BinaryStreamReader {
    private stream: ReadableStream;
    private locked: boolean = true;
    private reader: ReadableStreamDefaultReader<any>;

    constructor(buff: ReadableStream) {
        super(new ArrayBuffer(0));
        this.stream = buff;
        this.reader = buff.getReader();
    }

    async FetchData() {
        let val = await this.reader.read();
        let res = val.value as Uint8Array;
        this.dv = new DataView(res.buffer);
        this.locked = false;
    }

    private async DV(): Promise<DataView> {
        // lock thread
        if (this.dv == undefined)
            throw Error("Stream End");
        if (this.locked) {
            await this.FetchData();
        }
        return this.dv;
    }

    public async ReadByteAsync(): Promise<number> {
        return this.DV().then(x => x.getUint8(this.pos++));
    }

    public async ReadSByteAsync(): Promise<number> {
        return this.DV().then(x => x.getInt8(this.pos++));
    }

    public async ReadShortAsync(): Promise<number> {
        let tmp = this.DV().then(x => x.getInt16(this.pos));
        this.pos += 2;
        return tmp;
    }

    public async ReadUShortAsync(): Promise<number> {
        let tmp = this.DV().then(x => x.getUint16(this.pos));
        this.pos += 2;
        return tmp;
    }

    public async ReadIntAsync(): Promise<number> {
        let tmp = this.DV().then(x => x.getInt32(this.pos));
        this.pos += 4;
        return tmp;
    }

    public async ReadUIntAsync(): Promise<number> {
        let tmp = this.DV().then(x => x.getUint32(this.pos));
        this.pos += 4;
        return tmp;
    }

    public async ReadFloatAsync(): Promise<number> {
        let tmp = this.DV().then(x => x.getFloat32(this.pos));
        this.pos += 4;
        return tmp;
    }

    public async ReadDoubleAsync(): Promise<number> {
        let tmp = this.DV().then(x => x.getFloat64(this.pos));
        this.pos += 8;
        return tmp;
    }

    public async ReadCharAsync(): Promise<string> {
        return this.ReadByteAsync().then(String.fromCharCode);
    }

    public ReadBytesLazy(length: number): Observable<number> {
        return new Observable(subcriber => {
            let prom = this.ReadByteAsync();

            for (let i = 0; i < length - 1; i++) {
                prom = prom.then(x => {
                    subcriber.next(x);
                    return this.ReadByteAsync();
                });
            }

            prom.then(x => {
                subcriber.next(x);
                subcriber.complete();
            });
        });
    }

    public async ReadBytesAsync(length: number): Promise<number[]> {
        let nums = new Array<number>(length);
        return this.ReadBytesLazy(length).forEach(num => nums.push(num)).then(() => nums);
    } 

    public async ReadStringAsync(length: number): Promise<string> {
        let byteStream = this.ReadBytesLazy(length);

        function processCharacter(mode: TextMode, char: number): string {
            switch (mode) {
                case TextMode.UTF16BE:
                    return "UTF-16 Big Endian Not Implemented";
                case TextMode.UTF16LE:
                    return "UTF-16 Little Endian Not Implemented";
                case TextMode.UTF32BE:
                    return "UTF-32 Big Endian Not Implemented";
                case TextMode.UTF32LE:
                    return "UTF-32 Little Endian Not Implemented";
                case TextMode.UTF8:
                default:
                    return String.fromCharCode(char);
            }
        }

        let detectTextMode = true;
        let mode = TextMode.Default;
        let string = "";
        let byteMark = [0xAA, 0xAA, 0xAA, 0xAA];    // 0xAA is default as its not used in any of the byte order marks
        let byteMarkPointer = 0;
        return byteStream.forEach(v => {
            if (detectTextMode) {
                byteMark[byteMarkPointer++] = v;

                switch (byteMark) {
                    case [0xBF, 0xBB, 0xEF, 0xAA]:
                        mode = TextMode.UTF8;
                        detectTextMode = false;
                        return;
                    case [0xFE, 0xFF, 0xAA, 0xAA]:
                        mode = TextMode.UTF16LE;
                        detectTextMode = false;
                        return;
                    case [0xFF, 0xFE, 0xAA, 0xAA]:
                        mode = TextMode.UTF16BE;
                        return;
                    case [0x00, 0x00, 0xFE, 0xFF]:
                        mode = TextMode.UTF32LE;
                        detectTextMode = false;
                        return;
                    case [0xFF, 0xFE, 0x00, 0x00]:
                        mode = TextMode.UTF32BE;
                        detectTextMode = false;
                        return;
                    default:
                        if (mode == TextMode.UTF16BE && byteMarkPointer >= 4) {
                            string += processCharacter(mode, byteMark[2]);
                            string += processCharacter(mode, byteMark[3]);

                            detectTextMode = false;
                        }
                        if (!(v == 0xFF && v == 0xFE && v == 0x00 && v == 0xBF) && byteMarkPointer == 1)
                        {
                            detectTextMode = false;
                            break;
                        }
                        return;
                }
            }

            string += processCharacter(mode, v);
        }).then(() => string);
    }
}*/