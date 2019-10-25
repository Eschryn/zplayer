import { Stream } from "./Stream.js";

export class BinaryReader {
    protected stream: Stream;
    private littleEndian: boolean;

    constructor(stream: Stream) {
        this.stream = stream;
        this.littleEndian = this.PlatformIsLittleEndian();
    }

    get BaseStream(): Stream {
        return this.stream;
    }

    public ReadByte(): number {
        return this.stream.ReadByte();
    }

    public ReadSByte(): number {
        return new Int8Array(this.stream.Read(this.stream.Position, 1))[0];
    }

    private PlatformIsLittleEndian(): boolean {
        const u = new Uint8Array(4);
        const v = new Uint32Array(u.buffer);
        return ((v[0] = 1) & u[0]) != 0;
    }

    private EndianAwareRelativeRead(len: number): ArrayBuffer {
        let be = this.stream.Read(this.stream.Position, len);

        if (this.littleEndian) {
            let view = new Uint8Array(be);

            return view.reverse().buffer;
        }

        return be;
    }

    public ReadShort(): number {
        return new Int16Array(this.EndianAwareRelativeRead(2))[0];
    }

    public ReadUShort(): number {
        return new Uint16Array(this.EndianAwareRelativeRead(2))[0];
    }

    public ReadInt(): number {
        return new Int32Array(this.EndianAwareRelativeRead(4))[0];
    }

    public ReadUInt(): number {
        return new Uint32Array(this.EndianAwareRelativeRead(4))[0];
    }

    public ReadFloat(): number {
        return new Float32Array(this.EndianAwareRelativeRead(4))[0];
    }

    public ReadDouble(): number {
        return new Float64Array(this.EndianAwareRelativeRead(8))[0];
    }

    public ReadBool(): boolean {
        return this.ReadByte() != 0;
    }

    public ReadChar(): string {
        return String.fromCharCode(this.ReadByte());
    }

    public ReadBytes(length: number): number[] {
        let rawBytes = new Uint8Array(this.stream.Read(this.stream.Position, length));
        let bytes: number[] = new Array();

        // Copy to array
        rawBytes.forEach(x => bytes.push(x));

        return bytes;
    }

    public ReadString(length: number): string {
        let bytes = this.ReadBytes(length);
        let str = String.fromCharCode(...bytes);
        if (str.startsWith("ÿþ")) {
            let utf16 = new Array();
            for (let i: number = 0; i < bytes.length; ++i) {
                utf16.push(bytes[i] | bytes[++i] << 8);
            }
            //Trim null chars
            for (let i: number = utf16.length - 1; i >= 0; --i){
                if (utf16[i] == 0)
                    utf16.pop();
                else
                    break;
            }
            // and slice off ÿþ
            utf16 = utf16.slice(1);
            str = String.fromCodePoint(...utf16).trim();
        }
        return str;
    }
}