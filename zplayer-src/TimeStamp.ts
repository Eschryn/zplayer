class TimeStamp {
    private ms: number | undefined;
    private s: number | undefined;
    private m: number | undefined;
    private h: number | undefined;

    constructor(ms: number | undefined, s: number | undefined, m: number | undefined, h: number | undefined) {
        this.ms = ms;
        this.s = s;
        this.m = m;
        this.h = h;
    }

    get Milliseconds(): number {
        return this.ms ? this.ms : 0;
    }

    get Seconds(): number {
        return this.s ? this.s : 0;
    }

    get Minutes(): number {
        return this.m ? this.m : 0;
    }

    get Hours(): number {
        return this.h ? this.h : 0;
    }

    public AsMilliseconds(): number {
        return this.Milliseconds + (this.Seconds + (this.Minutes + this.Hours * 60) * 60) * 60;
    }

    public AsSeconds(): number {
        return (this.Milliseconds / 60) + this.Seconds + (this.Minutes + this.Hours * 60) * 60; 
    }

    public AsMinutes(): number {
        return (((this.Milliseconds / 60) + this.Seconds) / 60) + this.Minutes + this.Hours * 60;
    }

    public AsHours(): number {
        return (((((this.Milliseconds / 60) + this.Seconds) / 60) + this.Minutes) / 60) + this.Hours;
    }

    public ToString(ms: boolean): string {
        return (this.h ? this.Hours.toLocaleString("arab", { minimumIntegerDigits: 2 }) + ":" : "")
            + this.Minutes.toLocaleString("arab", { minimumIntegerDigits: 1 })
            + ":" + this.Seconds.toLocaleString("arab", { minimumIntegerDigits: 2 })
            + (ms ? ":" + this.Milliseconds.toLocaleString("arab", { minimumIntegerDigits: 2 }) : "");
    }

    public static FromSeconds(s: number) {
        let ms = ((s - Math.floor(s)) * 60);
        let h = (Math.floor(s) / 60) / 60;
        let m = ((h - Math.floor(h)) * 60);
        let sec = ((m - Math.floor(m)) * 60);
        return new TimeStamp(Math.floor(ms), Math.floor(sec), Math.floor(m), Math.floor(h));
    }
}