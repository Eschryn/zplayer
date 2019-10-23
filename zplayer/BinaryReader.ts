enum SeekOrigin {
    Begin,
    Current,
    End
}

class BinaryReader {
    protected dv: DataView;
    protected pos: number;

    constructor(buff: ArrayBuffer) {
        this.dv = new DataView(buff);
        this.pos = 0;
    }

    get Position(): number {
        return this.pos;
    }

    set Position(value: number) {
        this.pos = value;
    }

    get Length(): number {
        return this.dv.byteLength;
    }

    public Seek(origin: SeekOrigin, pos: number) {
        switch (origin) {
            case SeekOrigin.Begin:
                this.pos = pos;
                break;
            case SeekOrigin.Current:
                this.pos += pos;
                break;
            case SeekOrigin.End:
                this.pos = this.Length - pos;
                break;
        }
    }

    public ReadByte(): number {
        return this.dv.getUint8(this.pos++);
    }

    public ReadBytes(length: number): number[] {
        let bytes: number[] = new Array();
        for (let index = 0; index < length; index++) {
            bytes.push(this.ReadByte());
        }
        return bytes;
    }

    public ReadUShorts(length: number): number[] {
        let ushorts: number[] = new Array();
        for (let index = 0; index < length; index++) {
            ushorts.push(this.ReadUShort());
        }
        return ushorts;
    }

    public ReadSByte(): number {
        return this.dv.getInt8(this.pos++);
    }

    public ReadChar(): string {
        return String.fromCharCode(this.ReadByte());
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
            str = String.fromCodePoint(...utf16);
        }
        return str;
    }

    public ReadShort(): number {
        let tmp = this.dv.getInt16(this.pos);
        this.pos += 2;
        return tmp;
    }

    public ReadUShort(): number {
        let tmp = this.dv.getUint16(this.pos);
        this.pos += 2;
        return tmp;
    }

    public ReadInt(): number {
        let tmp = this.dv.getInt32(this.pos);
        this.pos += 4;
        return tmp;
    }

    public ReadUInt(): number {
        let tmp = this.dv.getUint32(this.pos);
        this.pos += 4;
        return tmp;
    }

    public ReadFloat(): number {
        let tmp = this.dv.getFloat32(this.pos);
        this.pos += 4;
        return tmp;
    }

    public ReadDouble(): number {
        let tmp = this.dv.getFloat64(this.pos);
        this.pos += 8;
        return tmp;
    }

    public ReadBool(): boolean {
        return this.ReadByte() != 0;
    }
}