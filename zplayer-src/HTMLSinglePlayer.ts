import { BinaryStreamReader } from "./BinaryStreamReader.js";
import { Song } from "./Song.js";

export class HTMLSinglePlayer {
    private audio: HTMLAudioElement;
    private root: HTMLElement;
    private currentSong: Song | undefined;
    private file: string;

    private audioInitialized: boolean = false;
    private source: MediaElementAudioSourceNode | undefined;
    private context: AudioContext | undefined;
    private filter: BiquadFilterNode | undefined;

    get Paused(): boolean {
        return this.audio.paused;
    }

    get Progress(): number {
        return (this.audio.currentTime * 100) / this.audio.duration;
    }

    get File(): string {
        return this.file;
    }

    set File(value: string) {
        if (!this.audioInitialized)
            this.InitAudio();
        this.file = value;
        (this.audio as HTMLAudioElement).src = value;

        fetch(value)
            .then(response => response.body)
            .then(body => {
                if (body != null) {
                    let reader = new BinaryStreamReader(body);

                    Song.FromReaderAsync(reader)
                        .then(song => this.currentSong = song);
                }
            })
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

    public InitAudio() {
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

    private FadeIn() {
        if (this.filter !== undefined) {

            this.filter.frequency.value = this.filter.frequency.minValue + 47;
            this.filter.frequency.exponentialRampToValueAtTime(this.filter.frequency.maxValue, 2);
        }
    }

    constructor(elem: HTMLElement) {
        this.root = elem;
        this.audio = new Audio();
        this.Bind();
        this.file = "";
    }

    public Play(file?: string | null) {
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

    private ActOnElements(className: string, act: (elem: HTMLElement) => void) {
        let elems = document.getElementsByClassName(className);
        for (const elem in elems) {
            if (elems.hasOwnProperty(elem)) {
                const element = elems[elem] as HTMLElement;
                act(element);
            }
        }
    }

    public Pause() {
        this.audio.pause();
        this.ActOnElements("player__button", (e) => {
            e.innerHTML = "<i class='fas fa-play'></i>";
        });
    }

    public Stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.ActOnElements("player__button", (e) => {
            e.innerHTML = "<i class='fas fa-play'></i>";
        });
    }

    public Toggle() {
        if (this.audio.paused) {
            this.Play();
        }
        else {
            this.Pause();
        }
    }

    private Bind() {
        let bars = this.root.getElementsByClassName("player__progress") as HTMLCollectionOf<HTMLDivElement>;
        let trackhandle = this.root.getElementsByClassName("player__trackhandle") as HTMLCollectionOf<HTMLDivElement>;
        let ctime = this.root.getElementsByClassName("player__ctime") as HTMLCollectionOf<HTMLDivElement>;
        let updateProg: boolean = true;

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
        }

        (document.getElementById("test") as HTMLElement).onclick = (e) => {
            this.File = "sectorMPerc.mp3";
            this.Play();
        };

        (document.getElementById("test2") as HTMLElement).onclick = (e) => {
            this.File = "triangulartoaster.mp3";
            this.Play();
        };

        (document.getElementById("test3") as HTMLElement).onclick = (e) => {
            this.File = "threefourtothedoor.mp3";
            this.Play();
        };

        (document.getElementById("test4") as HTMLElement).onclick = (e) => {
            this.File = "SOUPBASS.mp3";
            this.Play();
        };

        (document.getElementById("t1") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 01 Magic.mp3";
            this.Play();
        };

        (document.getElementById("t2") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 02 Stay Pure.mp3";
            this.Play();
        };

        (document.getElementById("t3") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 03 Cheek.mp3";
            this.Play();
        };

        (document.getElementById("t4") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 04 Universe.mp3";
            this.Play();
        };

        (document.getElementById("t5") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 05 Touch.mp3";
            this.Play();
        };

        (document.getElementById("t6") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 06 In The Moon.mp3";
            this.Play();
        };

        (document.getElementById("t7") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 07 2 Late.mp3";
            this.Play();
        };

        (document.getElementById("t8") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 08 Dreamy.mp3";
            this.Play();
        };

        (document.getElementById("t9") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 09 Holiday!.mp3";
            this.Play();
        };

        (document.getElementById("t10") as HTMLElement).onclick = (e) => {
            this.File = "Night Tempo - Babymaker 2/Night Tempo - Babymaker 2 - 10 Heart Break.mp3";
            this.Play();
        };

        this.ActOnElements("player__button", (e) => {
            e.onclick = () => {
                this.Toggle();
            };
        });

        this.ActOnElements("player__track", (e) => {
            let newtime: number = this.audio.currentTime;
            e.onpointerdown = (ev) => {
                updateProg = false;
                this.ActOnElements("player__prevtime", (eve) => {
                    eve.style.opacity = 1 + "";
                });
                e.onpointermove = (ev) => {
                    let p = ev.offsetX / e.offsetWidth;
                    newtime = this.audio.duration * p;
                    let bars = e.getElementsByClassName("player__progress") as HTMLCollectionOf<HTMLDivElement>;
                    let prevtime = this.root.getElementsByClassName("player__prevtime") as HTMLCollectionOf<HTMLDivElement>;
                    let trackhandles = e.getElementsByClassName("player__trackhandle") as HTMLCollectionOf<HTMLDivElement>;
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