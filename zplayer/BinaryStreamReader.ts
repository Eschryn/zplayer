class BinaryStreamReader extends BinaryReader {
    private stream: ReadableStream;
    private locked: boolean = true;

    constructor(buff: ReadableStream) {
        super(new ArrayBuffer(0));
        this.FetchData();
        this.stream = buff;
    }

    async FetchData() {
        let val = await this.stream.getReader().read();
        let res = val.value as Uint8Array;
        console.log(res);
        this.dv = new DataView(res.buffer);
        this.locked = false;
    }

    private DV(): DataView {
        // lock thread
        if (this.dv == undefined)
            throw Error("Stream End");
        if (this.locked)
            throw Error("Poyaya");
        return this.dv;
    }

    public ReadByte(): number {
        return this.DV().getUint8(this.pos++);
    }

    public ReadSByte(): number {
        return this.DV().getInt8(this.pos++);
    }

    public ReadShort(): number {
        let tmp = this.DV().getInt16(this.pos);
        this.pos += 2;
        return tmp;
    }

    public ReadUShort(): number {
        let tmp = this.DV().getUint16(this.pos);
        this.pos += 2;
        return tmp;
    }

    public ReadInt(): number {
        let tmp = this.DV().getInt32(this.pos);
        this.pos += 4;
        return tmp;
    }

    public ReadUInt(): number {
        let tmp = this.DV().getUint32(this.pos);
        this.pos += 4;
        return tmp;
    }

    public ReadFloat(): number {
        let tmp = this.DV().getFloat32(this.pos);
        this.pos += 4;
        return tmp;
    }

    public ReadDouble(): number {
        let tmp = this.DV().getFloat64(this.pos);
        this.pos += 8;
        return tmp;
    }
}