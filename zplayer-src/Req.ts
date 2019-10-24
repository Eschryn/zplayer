class Req {
    public static ArrayBuffer(URI: string, receive: (ev: ArrayBuffer) => any): any {
        let req = new XMLHttpRequest();
        req.open("GET", URI, false);
        req.responseType = "arraybuffer";
        req.send();
        return receive(req.response);
    }
}