"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var SeekOrigin;
(function (SeekOrigin) {
    SeekOrigin[SeekOrigin["Begin"] = 0] = "Begin";
    SeekOrigin[SeekOrigin["Current"] = 1] = "Current";
    SeekOrigin[SeekOrigin["End"] = 2] = "End";
})(SeekOrigin || (SeekOrigin = {}));
class BinaryReader {
    constructor(buff) {
        this.dv = new DataView(buff);
        this.pos = 0;
    }
    get Position() {
        return this.pos;
    }
    set Position(value) {
        this.pos = value;
    }
    get Length() {
        return this.dv.byteLength;
    }
    Seek(origin, pos) {
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
    ReadByte() {
        return this.dv.getUint8(this.pos++);
    }
    ReadBytes(length) {
        let bytes = new Array();
        for (let index = 0; index < length; index++) {
            bytes.push(this.ReadByte());
        }
        return bytes;
    }
    ReadUShorts(length) {
        let ushorts = new Array();
        for (let index = 0; index < length; index++) {
            ushorts.push(this.ReadUShort());
        }
        return ushorts;
    }
    ReadSByte() {
        return this.dv.getInt8(this.pos++);
    }
    ReadChar() {
        return String.fromCharCode(this.ReadByte());
    }
    ReadString(length) {
        let bytes = this.ReadBytes(length);
        let str = String.fromCharCode(...bytes);
        if (str.startsWith("ÿþ")) {
            let utf16 = new Array();
            for (let i = 0; i < bytes.length; ++i) {
                utf16.push(bytes[i] | bytes[++i] << 8);
            }
            //Trim null chars
            for (let i = utf16.length - 1; i >= 0; --i) {
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
    ReadShort() {
        let tmp = this.dv.getInt16(this.pos);
        this.pos += 2;
        return tmp;
    }
    ReadUShort() {
        let tmp = this.dv.getUint16(this.pos);
        this.pos += 2;
        return tmp;
    }
    ReadInt() {
        let tmp = this.dv.getInt32(this.pos);
        this.pos += 4;
        return tmp;
    }
    ReadUInt() {
        let tmp = this.dv.getUint32(this.pos);
        this.pos += 4;
        return tmp;
    }
    ReadFloat() {
        let tmp = this.dv.getFloat32(this.pos);
        this.pos += 4;
        return tmp;
    }
    ReadDouble() {
        let tmp = this.dv.getFloat64(this.pos);
        this.pos += 8;
        return tmp;
    }
    ReadBool() {
        return this.ReadByte() != 0;
    }
}
class BinaryStreamReader extends BinaryReader {
    constructor(buff) {
        super(new ArrayBuffer(0));
        this.locked = true;
        this.FetchData();
        this.stream = buff;
    }
    FetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            let val = yield this.stream.getReader().read();
            let res = val.value;
            console.log(res);
            this.dv = new DataView(res.buffer);
            this.locked = false;
        });
    }
    DV() {
        // lock thread
        if (this.dv == undefined)
            throw Error("Stream End");
        if (this.locked)
            throw Error("Poyaya");
        return this.dv;
    }
    ReadByte() {
        return this.DV().getUint8(this.pos++);
    }
    ReadSByte() {
        return this.DV().getInt8(this.pos++);
    }
    ReadShort() {
        let tmp = this.DV().getInt16(this.pos);
        this.pos += 2;
        return tmp;
    }
    ReadUShort() {
        let tmp = this.DV().getUint16(this.pos);
        this.pos += 2;
        return tmp;
    }
    ReadInt() {
        let tmp = this.DV().getInt32(this.pos);
        this.pos += 4;
        return tmp;
    }
    ReadUInt() {
        let tmp = this.DV().getUint32(this.pos);
        this.pos += 4;
        return tmp;
    }
    ReadFloat() {
        let tmp = this.DV().getFloat32(this.pos);
        this.pos += 4;
        return tmp;
    }
    ReadDouble() {
        let tmp = this.DV().getFloat64(this.pos);
        this.pos += 8;
        return tmp;
    }
}
var Genre;
(function (Genre) {
    Genre[Genre["Blues"] = 0] = "Blues";
    Genre[Genre["Classic_Rock"] = 1] = "Classic_Rock";
    Genre[Genre["Country"] = 2] = "Country";
    Genre[Genre["Dance"] = 3] = "Dance";
    Genre[Genre["Disco"] = 4] = "Disco";
    Genre[Genre["Funk"] = 5] = "Funk";
    Genre[Genre["Grunge"] = 6] = "Grunge";
    Genre[Genre["Hip_Hop"] = 7] = "Hip_Hop";
    Genre[Genre["Jazz"] = 8] = "Jazz";
    Genre[Genre["Metal"] = 9] = "Metal";
    Genre[Genre["New_Age"] = 10] = "New_Age";
    Genre[Genre["Oldies"] = 11] = "Oldies";
    Genre[Genre["Other"] = 12] = "Other";
    Genre[Genre["Pop"] = 13] = "Pop";
    Genre[Genre["Rhythm_and_Blues"] = 14] = "Rhythm_and_Blues";
    Genre[Genre["Rap"] = 15] = "Rap";
    Genre[Genre["Reggae"] = 16] = "Reggae";
    Genre[Genre["Rock"] = 17] = "Rock";
    Genre[Genre["Techno"] = 18] = "Techno";
    Genre[Genre["Industrial"] = 19] = "Industrial";
    Genre[Genre["Alternative"] = 20] = "Alternative";
    Genre[Genre["Ska"] = 21] = "Ska";
    Genre[Genre["Death_metal"] = 22] = "Death_metal";
    Genre[Genre["Pranks"] = 23] = "Pranks";
    Genre[Genre["Soundtrack"] = 24] = "Soundtrack";
    Genre[Genre["Euro_Techno"] = 25] = "Euro_Techno";
    Genre[Genre["Ambient"] = 26] = "Ambient";
    Genre[Genre["Tip_Hop"] = 27] = "Tip_Hop";
    Genre[Genre["Vocal"] = 28] = "Vocal";
    Genre[Genre["Jazz_and_Funk"] = 29] = "Jazz_and_Funk";
    Genre[Genre["Fusion"] = 30] = "Fusion";
    Genre[Genre["Trance"] = 31] = "Trance";
    Genre[Genre["Classical"] = 32] = "Classical";
    Genre[Genre["Instrumental"] = 33] = "Instrumental";
    Genre[Genre["Acid"] = 34] = "Acid";
    Genre[Genre["House"] = 35] = "House";
    Genre[Genre["Game"] = 36] = "Game";
    Genre[Genre["Sound_clip"] = 37] = "Sound_clip";
    Genre[Genre["Gospel"] = 38] = "Gospel";
    Genre[Genre["Noise"] = 39] = "Noise";
    Genre[Genre["Alternative_Rock"] = 40] = "Alternative_Rock";
    Genre[Genre["Bass"] = 41] = "Bass";
    Genre[Genre["Soul"] = 42] = "Soul";
    Genre[Genre["Punk"] = 43] = "Punk";
    Genre[Genre["Space"] = 44] = "Space";
    Genre[Genre["Meditative"] = 45] = "Meditative";
    Genre[Genre["Instrumental_Pop"] = 46] = "Instrumental_Pop";
    Genre[Genre["Instrumental_Rock"] = 47] = "Instrumental_Rock";
    Genre[Genre["Ethnic"] = 48] = "Ethnic";
    Genre[Genre["Gothic"] = 49] = "Gothic";
    Genre[Genre["Darkwave"] = 50] = "Darkwave";
    Genre[Genre["Techno_Industrial"] = 51] = "Techno_Industrial";
    Genre[Genre["Electronic"] = 52] = "Electronic";
    Genre[Genre["Pop_Folk"] = 53] = "Pop_Folk";
    Genre[Genre["Eurodance"] = 54] = "Eurodance";
    Genre[Genre["Dream"] = 55] = "Dream";
    Genre[Genre["Southern_Rock"] = 56] = "Southern_Rock";
    Genre[Genre["Comedy"] = 57] = "Comedy";
    Genre[Genre["Cult"] = 58] = "Cult";
    Genre[Genre["Gangsta"] = 59] = "Gangsta";
    Genre[Genre["None"] = 255] = "None";
})(Genre || (Genre = {}));
class HTMLSinglePlayer {
    constructor(elem) {
        this.audioInitialized = false;
        this.root = elem;
        this.audio = new Audio();
        this.Bind();
        this.file = "";
    }
    get Paused() {
        return this.audio.paused;
    }
    get Progress() {
        return (this.audio.currentTime * 100) / this.audio.duration;
    }
    get File() {
        return this.file;
    }
    set File(value) {
        if (!this.audioInitialized)
            this.InitAudio();
        this.file = value;
        this.audio.src = value;
        fetch(value)
            .then(response => response.body)
            .then(body => {
            if (body != null) {
                let reader = new BinaryStreamReader(body);
                this.currentSong = new Song(reader);
            }
        });
        /*Req.ArrayBuffer(Path.Append(Path.BaseURI), (e) => {
            let reader = new BinaryReader(e);
            this.currentSong = new Song(reader);
            let titles = this.root.getElementsByClassName("player__title") as HTMLCollectionOf<HTMLDivElement>;
            if (Song !== undefined) {
                let song = this.currentSong as Song;
                if (titles.length > 0) {
                    if (song.Title !== undefined)
                        if (song.Artist !== undefined)
                            titles[0].innerText = `${song.Artist} - ${song.Title}`;
                        else
                            titles[0].innerText = song.Title;
                    else
                        titles[0].innerText = (this.audio as HTMLAudioElement).src;
                }
            }
        });*/
    }
    InitAudio() {
        this.context = new AudioContext();
        this.audioInitialized = this.context.state == "running";
        if (!this.audioInitialized)
            return;
        this.source = this.context.createMediaElementSource(this.audio);
        this.filter = this.context.createBiquadFilter();
        this.source.connect(this.filter);
        this.filter.connect(this.context.destination);
        this.FadeIn();
        console.log(this.context.state);
    }
    FadeIn() {
        if (this.filter !== undefined) {
            this.filter.frequency.value = this.filter.frequency.minValue + 47;
            this.filter.frequency.exponentialRampToValueAtTime(this.filter.frequency.maxValue, 2);
        }
    }
    Play(file) {
        if (!this.audioInitialized)
            this.InitAudio();
        if (file !== undefined) {
            if (file !== null) {
                this.File = file;
            }
        }
        this.audio.play();
        this.ActOnElements("player__button", (e) => {
            e.innerHTML = "<i class='fas fa-pause'></i>";
        });
    }
    ActOnElements(className, act) {
        let elems = document.getElementsByClassName(className);
        for (const elem in elems) {
            if (elems.hasOwnProperty(elem)) {
                const element = elems[elem];
                act(element);
            }
        }
    }
    Pause() {
        this.audio.pause();
        this.ActOnElements("player__button", (e) => {
            e.innerHTML = "<i class='fas fa-play'></i>";
        });
    }
    Stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.ActOnElements("player__button", (e) => {
            e.innerHTML = "<i class='fas fa-play'></i>";
        });
    }
    Toggle() {
        if (this.audio.paused) {
            this.Play();
        }
        else {
            this.Pause();
        }
    }
    Bind() {
        let bars = this.root.getElementsByClassName("player__progress");
        let trackhandle = this.root.getElementsByClassName("player__trackhandle");
        let ctime = this.root.getElementsByClassName("player__ctime");
        let updateProg = true;
        this.audio.ontimeupdate = (e) => {
            if (updateProg) {
                if (bars.length > 0) {
                    bars[0].style.width = this.Progress + "%";
                }
                if (trackhandle.length > 0) {
                    trackhandle[0].style.left = this.Progress + "%";
                }
            }
            if (ctime.length > 0) {
                let stamp = TimeStamp.FromSeconds(this.audio.currentTime);
                ctime[0].innerHTML = stamp.ToString(false);
            }
            this.ActOnElements("player__resttime", (eve) => {
                let stamp = TimeStamp.FromSeconds(this.audio.duration - this.audio.currentTime);
                eve.innerHTML = stamp.ToString(false);
            });
        };
        this.audio.onended = (e) => {
            this.ActOnElements("player__button", (e) => {
                e.innerHTML = "<i class='fas fa-play'></i>";
            });
        };
        document.getElementById("test").onclick = (e) => {
            this.File = "sectorMPerc.mp3";
            this.Play();
        };
        document.getElementById("test2").onclick = (e) => {
            this.File = "triangulartoaster.mp3";
            this.Play();
        };
        document.getElementById("test3").onclick = (e) => {
            this.File = "threefourtothedoor.mp3";
            this.Play();
        };
        document.getElementById("test4").onclick = (e) => {
            this.File = "SOUPBASS.mp3";
            this.Play();
        };
        document.getElementById("t1").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 01 Magic.mp3";
            this.Play();
        };
        document.getElementById("t2").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 02 Stay Pure.mp3";
            this.Play();
        };
        document.getElementById("t3").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 03 Cheek.mp3";
            this.Play();
        };
        document.getElementById("t4").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 04 Universe.mp3";
            this.Play();
        };
        document.getElementById("t5").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 05 Touch.mp3";
            this.Play();
        };
        document.getElementById("t6").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 06 In The Moon.mp3";
            this.Play();
        };
        document.getElementById("t7").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 07 2 Late.mp3";
            this.Play();
        };
        document.getElementById("t8").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 08 Dreamy.mp3";
            this.Play();
        };
        document.getElementById("t9").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 09 Holiday!.mp3";
            this.Play();
        };
        document.getElementById("t10").onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 10 Heart Break.mp3";
            this.Play();
        };
        this.ActOnElements("player__button", (e) => {
            e.onclick = () => {
                this.Toggle();
            };
        });
        this.ActOnElements("player__track", (e) => {
            let newtime = this.audio.currentTime;
            e.onpointerdown = (ev) => {
                updateProg = false;
                this.ActOnElements("player__prevtime", (eve) => {
                    eve.style.opacity = 1 + "";
                });
                e.onpointermove = (ev) => {
                    let p = ev.offsetX / e.offsetWidth;
                    newtime = this.audio.duration * p;
                    let bars = e.getElementsByClassName("player__progress");
                    let prevtime = this.root.getElementsByClassName("player__prevtime");
                    let trackhandles = e.getElementsByClassName("player__trackhandle");
                    if (bars.length > 0) {
                        bars[0].style.width = p * 100 + "%";
                    }
                    if (trackhandle.length > 0) {
                        trackhandles[0].style.left = p * 100 + "%";
                    }
                    if (prevtime.length > 0) {
                        prevtime[0].style.left = p * 100 + "%";
                        let stamp = TimeStamp.FromSeconds(newtime);
                        prevtime[0].innerHTML = stamp.ToString(false);
                    }
                };
                e.onpointermove(ev);
                e.setPointerCapture(ev.pointerId);
            };
            e.onpointerup = (ev) => {
                updateProg = true;
                e.onpointermove = null;
                this.ActOnElements("player__prevtime", (eve) => {
                    eve.style.opacity = 0 + "";
                });
                this.audio.currentTime = newtime;
                e.releasePointerCapture(ev.pointerId);
            };
        });
    }
}
class Path {
    static get BaseURI() {
        return document.baseURI;
    }
    static Append(Path, File) {
        return this.GetPath(Path) + File.trim();
    }
    static GetPath(URI) {
        if (URI.startsWith("http")) {
            let index = URI.length;
            for (; index >= 0 && URI[index] != "/"; index--)
                ;
            return URI.substr(0, ++index);
        }
        return "";
    }
}
class Req {
    static ArrayBuffer(URI, receive) {
        let req = new XMLHttpRequest();
        req.open("GET", URI, false);
        req.responseType = "arraybuffer";
        req.send();
        return receive(req.response);
    }
}
class Song {
    constructor(reader) {
        if (reader.ReadString(3) == "ID3") {
            this.ReadTAGv2(reader);
        }
        //reader.Seek(SeekOrigin.End, 512);
        /*if (reader.ReadString(3) == "TAG")
            this.ReadTag(reader);*/
    }
    static FromURI(URI) {
        return Req.ArrayBuffer(Path.Append(Path.BaseURI, URI), (e) => {
            return new Song(new BinaryReader(e));
        });
    }
    ReadEnhancedTag(reader) {
        this.title = reader.ReadString(60);
        this.artist = reader.ReadString(60);
        this.album = reader.ReadString(60);
        this.speed = reader.ReadByte();
        this.genre = reader.ReadString(30);
        this.start_time = reader.ReadString(6);
        this.end_time = reader.ReadString(6);
    }
    ReadTAGv1(reader) {
        if (!this.title)
            this.title = reader.ReadString(30);
        if (!this.artist)
            this.artist = reader.ReadString(30);
        if (!this.album)
            this.album = reader.ReadString(30);
        this.year = reader.ReadString(4);
        this.comment = reader.ReadString(28);
        // detect zero-byte
        let tmp = reader.ReadByte();
        if (tmp == 0) // there is a zero-byte so we get the track number
            this.track = reader.ReadByte() + "";
        else { // no zero-byte so we get the rest of the comment
            reader.Position--;
            this.comment += reader.ReadString(2);
        }
        if (!this.genre)
            this.genre = reader.ReadByte();
    }
    ReadFrame(reader) {
        let identifier = reader.ReadString(4);
        let size = reader.ReadUInt() - 1;
        reader.ReadUShort();
        reader.ReadByte();
        switch (identifier) {
            case "TRCK":
                this.track = reader.ReadString(size);
                break;
            case "TOPE":
                this.originalArtist = reader.ReadString(size);
                break;
            case "TCON":
                this.genre = reader.ReadString(size);
                break;
            case "COMM":
                this.comment = reader.ReadString(size);
                break;
            case "TYER":
                this.year = reader.ReadString(size);
                break;
            case "TALB":
                this.album = reader.ReadString(size);
                break;
            case "TPE1":
                this.artist = reader.ReadString(size);
                break;
            case "TIT2":
                this.title = reader.ReadString(size);
                break;
        }
    }
    ReadTAGv2(reader) {
        let v = reader.ReadBytes(2);
        console.log(`version: ${v[0]}.${v[1]}`);
        reader.ReadByte();
        let sizeRAW = reader.ReadUInt();
        let size = 0;
        for (let i = 0; i < 4; i++) {
            size |= ((sizeRAW & 0x7F << (i * 7)) >> i);
        }
        while (reader.Position <= size + 10) {
            this.ReadFrame(reader);
        }
    }
    get Title() {
        return this.title;
    }
    get Artist() {
        return this.artist;
    }
    get OriginalArtist() {
        return this.originalArtist;
    }
    get Album() {
        return this.album;
    }
    get Year() {
        return this.year;
    }
    get Comment() {
        return this.comment;
    }
    get Track() {
        return this.track;
    }
    get Genre() {
        return this.genre;
    }
    get Speed() {
        return this.speed;
    }
    get StartTime() {
        return this.start_time;
    }
    get EndTime() {
        return this.end_time;
    }
}
class TimeStamp {
    constructor(ms, s, m, h) {
        this.ms = ms;
        this.s = s;
        this.m = m;
        this.h = h;
    }
    get Milliseconds() {
        return this.ms ? this.ms : 0;
    }
    get Seconds() {
        return this.s ? this.s : 0;
    }
    get Minutes() {
        return this.m ? this.m : 0;
    }
    get Hours() {
        return this.h ? this.h : 0;
    }
    AsMilliseconds() {
        return this.Milliseconds + (this.Seconds + (this.Minutes + this.Hours * 60) * 60) * 60;
    }
    AsSeconds() {
        return (this.Milliseconds / 60) + this.Seconds + (this.Minutes + this.Hours * 60) * 60;
    }
    AsMinutes() {
        return (((this.Milliseconds / 60) + this.Seconds) / 60) + this.Minutes + this.Hours * 60;
    }
    AsHours() {
        return (((((this.Milliseconds / 60) + this.Seconds) / 60) + this.Minutes) / 60) + this.Hours;
    }
    ToString(ms) {
        return (this.h ? this.Hours.toLocaleString("arab", { minimumIntegerDigits: 2 }) + ":" : "")
            + this.Minutes.toLocaleString("arab", { minimumIntegerDigits: 1 })
            + ":" + this.Seconds.toLocaleString("arab", { minimumIntegerDigits: 2 })
            + (ms ? ":" + this.Milliseconds.toLocaleString("arab", { minimumIntegerDigits: 2 }) : "");
    }
    static FromSeconds(s) {
        let ms = ((s - Math.floor(s)) * 60);
        let h = (Math.floor(s) / 60) / 60;
        let m = ((h - Math.floor(h)) * 60);
        let sec = ((m - Math.floor(m)) * 60);
        return new TimeStamp(Math.floor(ms), Math.floor(sec), Math.floor(m), Math.floor(h));
    }
}
function CreatePlayer(elem) {
    return new HTMLSinglePlayer(elem);
}
let playerTags = document.getElementsByTagName("player");
for (const playerTag in playerTags) {
    if (playerTags.hasOwnProperty(playerTag)) {
        const element = playerTags[playerTag];
        let t = CreatePlayer(element);
        console.log(t);
        let attr = element.getAttribute("file");
        if (attr !== null)
            t.File = attr;
    }
}
var zplayScrip = document.getElementById("zplayer");
var elem = document.createElement("link");
elem.rel = "stylesheet";
elem.href = "zplayer/zplayer-base.css";
document.head.appendChild(elem);
