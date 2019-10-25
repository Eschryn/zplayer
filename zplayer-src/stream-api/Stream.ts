import { SeekOrigin } from "./SeekOrigin.js";

export abstract class Stream {
    protected position: number;
    protected length: number;

    readonly seekable: boolean;
    readonly readable: boolean;
    readonly writable: boolean;

    constructor(readable: boolean, writable: boolean, seekable: boolean) {
        this.position = 0;
        this.length = 0;

        this.readable = readable;
        this.writable = writable;
        this.seekable = seekable;
    }

    get CanRead(): boolean {
        return this.readable;
    }

    get CanWrite(): boolean {
        return this.writable;
    }

    get CanSeek(): boolean {
        return this.writable;
    }

    get Length(): number {
        return this.length;
    }

    get Position(): number {
        return this.position;
    }

    set Position(value: number) {
        this.position = value;
    }

    public abstract Close(): void;

    public abstract Write(data: ArrayBuffer, offset: number, length: number): void;
    public abstract async WriteAsync(data: ArrayBuffer, offset: number, length: number): Promise<void>;

    public abstract Read(offset: number, length: number): ArrayBuffer;
    public abstract async ReadAsync(offset: number, length: number): Promise<ArrayBuffer>;

    public Seek(position: number, origin: SeekOrigin) {
        switch (origin) {
            case SeekOrigin.Current:
                this.position += position;
                break;
            case SeekOrigin.End:
                this.position = this.length - position;
                break;
            case SeekOrigin.Begin:
            default:
                this.position = position;
                break;
        }
    }

    public WriteByte(number: number): void {
        this.Write(new Uint8Array([number]).buffer, this.position, 1);
    }

    public ReadByte(): number {
        return new Uint8Array(this.Read(this.position, 1))[0];
    }
}