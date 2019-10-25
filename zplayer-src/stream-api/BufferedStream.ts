import { Stream } from "./Stream.js";
import { SeekOrigin } from "./SeekOrigin.js";

export class BufferedStream extends Stream {
    private stream: Stream;
    private buffer: Uint8Array;
    private bufferPointer: number;
    private bufferPosition: number;

    constructor(stream: Stream, bufferSize: number = 4096) {
        super(stream.CanRead, stream.CanWrite, stream.CanSeek);

        this.buffer = new Uint8Array(bufferSize);
        this.bufferPosition = 0;
        this.bufferPointer = bufferSize;
        this.stream = stream;
    }

    public Close(): void {
        this.stream.Close();

        this.buffer = new Uint8Array(0);
        this.length = 0;
    }

    get Length(): number {
        return this.stream.Length;
    }

    get Position(): number {
        return super.Position;
    }

    set Position(value: number) {
        this.Seek(value, SeekOrigin.Begin);
    }

    public Seek(position: number, origin: SeekOrigin) {
        // invalidate buffer
        if (origin != SeekOrigin.Current
            || this.buffer.length < (this.bufferPointer + position)
            || (this.bufferPointer + position) < 0) {   // also invalidate buffer if the new position is out of the current buffer
            // check if the new position is still in buffer bounds;
            let relPos = this.bufferPosition - position;
            if (this.buffer.length < (this.bufferPointer + relPos)
                || (this.bufferPointer + relPos) < 0) {
                // buffer is in bounds so we just want to adjust the position
                this.bufferPointer += relPos;
            } else {
                this.bufferPointer = this.buffer.length;

                if (origin == SeekOrigin.Current) 
                    this.bufferPosition += position;
                else if (origin == SeekOrigin.End)
                    this.bufferPosition = this.length - position;
                else 
                    this.bufferPosition = position;

                this.stream.Seek(position, origin);         // when we invalidate our buffer we also want to reset our stream position
            }
        } else 
            this.bufferPointer += position;

        super.Seek(position, origin);
    }

    public Write(data: ArrayBuffer, offset: number, length: number): void {
        this.position += length;

        this.stream.Write(data, offset, length);
    }

    public WriteAsync(data: ArrayBuffer, offset: number, length: number): Promise<void> {
        this.position += length;

        return this.stream.WriteAsync(data, offset, length);
    }

    public Read(offset: number, length: number): ArrayBuffer {
        this.position += length;

        if ((this.buffer.length - this.bufferPointer) < length) {
            let rest = this.buffer.slice(this.bufferPointer);
            let offs = rest.length;
            
            this.bufferPointer = length - offs;
            this.buffer = new Uint8Array(this.stream.Read(offset + offs, this.buffer.length));

            this.bufferPosition = offset + offs;

            let result = new Uint8Array(length);
            for (let i = 0; i < rest.length; ++i) {
                result[i] = rest[i];
            }

            for (let i = offs; i < length; ++i) {
                result[i] = this.buffer[i - offs];
            }

            return result.buffer;
        } else {
            this.bufferPointer += length;
            return this.buffer.slice(offset, offset + length).buffer;
        }
    }

    public async ReadAsync(offset: number, length: number): Promise<ArrayBuffer> {
        this.position += length;

        if ((this.buffer.length - this.bufferPointer) < length) {
            let rest = this.buffer.slice(offset);
            let offs = rest.length;
                
                this.bufferPointer = length - offs;
            this.buffer = new Uint8Array(await this.stream.ReadAsync(offset + offs, this.buffer.length));

            let result = new Uint8Array(length);
            for (let i = 0; i < rest.length; ++i) {
                result[i] = rest[i];
            }

            for (let i = offs; i < length; ++i) {
                result[i] = this.buffer[i - offs];
            }

            return result.buffer;
        } else {
            this.bufferPointer += length;
            return this.buffer.slice(offset, offset + length - 1).buffer;
        }
    }
}