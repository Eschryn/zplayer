import { Stream } from './Stream.js'

export class HTTPResponseStream extends Stream {
    readonly url: URL;

    public constructor(url: URL) {
        let req = new XMLHttpRequest();
        req.open("OPTIONS", url.href, false);
        req.send();

        let writable = false;
        let readable = true;
        let length = 0;

        // ensure correct read write permissions 
        let allow = req.getResponseHeader("Access-Control-Allow-Methods");

        if (allow == null)
            allow = req.getResponseHeader("Allow");

        if (allow != null) {
            let res = allow.split(',');
            res.forEach(x => x = x.trim());

            writable = res.includes("PUT");
            readable = res.includes("GET");

            // load complete length
            if (res.includes("HEAD")) {
                let req = new XMLHttpRequest();
                req.open("HEAD", url.href, false);
                req.send();

                let len = req.getResponseHeader("Content-Length");
                if (len != null)
                    length = Number.parseInt(len);
            }
        }

        super(readable, writable, readable || writable);

        this.length = length;
        this.url = url;
    }

    public Close(): void {
        
    }    

    public Write(data: ArrayBuffer, offset: number, length: number): void {
        let req = new XMLHttpRequest();
        req.open("PUT", this.url.href, false);
        req.setRequestHeader("Range", `bytes=${offset}-${offset + length - 1}`);
        req.send(data);
    }

    public async WriteAsync(data: ArrayBuffer, offset: number, length: number): Promise<void> {
        await fetch(this.url.href, {
            method: 'PUT',
            headers: {
                'Range': `bytes=${offset}-${offset + length}`
            },
            body: data
        });
    }

    public Read(offset: number, length: number): ArrayBuffer {
        let req = new XMLHttpRequest();
        req.open("GET", this.url.href, false);
        req.setRequestHeader("Range", `bytes=${offset}-${offset + length - 1}`);
        req.send();

        this.Position += length;

        let buffer = new ArrayBuffer(length);
        let view = new Uint8Array(buffer);

        for (let i = length - 1; i >= 0; --i)
            view[i] = req.responseText.charCodeAt(i);

        return buffer;
    }

    public async ReadAsync(offset: number, length: number): Promise<ArrayBuffer> {
        let res = await fetch(this.url.href, {
            method: 'GET',
            headers: {
                'Range': `bytes=${offset}-${offset + length}`
            }
        });

        if (res.status != 206)
            throw new Error(res.statusText);

        if (res.body != null) {
            let resBod = await res.body.getReader().read();
            
            if (resBod.done) {
                this.Position += resBod.value.length;

                return resBod.value.buffer;
            }

            throw new Error("Could not read the value of the response body.");
        }

        throw new Error("Could not get a response from the server.");
    }
}