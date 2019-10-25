import { BinaryReader } from "./stream-api/BinaryReader.js";
import { SeekOrigin } from "./stream-api/SeekOrigin.js";

type PropertyInformation = [string, number, number];

export class Song {
    private propertyMap: Map<string, string>;
    private propertyInformationMap: Map<string, PropertyInformation>;

    private version: [number, number];

    private speed: number | undefined;
    private start_time: string | undefined;
    private end_time: string | undefined;

    readonly reader: BinaryReader;

    private constructor(reader: BinaryReader) {
        this.propertyMap = new Map();
        this.propertyInformationMap = new Map();
        this.reader = reader;
        this.version = [0, 0];
    }

    public static FromReader(reader: BinaryReader): Song {
        let song = new Song(reader);

        if (reader.ReadString(3) == "ID3") {
            song.ScanTAGv2(reader);
        }

        return song;
    }

    private ReadEnhancedTag(reader: BinaryReader) {
        //this.title = reader.ReadString(60);
        //this.artist = reader.ReadString(60);
        //this.album = reader.ReadString(60);
        this.speed = reader.ReadByte();
        //this.genre = reader.ReadString(30);
        this.start_time = reader.ReadString(6);
        this.end_time = reader.ReadString(6);
    }

    private ReadTAGv1(reader: BinaryReader) {
        /*if (!this.title)
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
            reader.BaseStream.Position--;
            this.comment += reader.ReadString(2);
        }

        if (!this.genre)
            this.genre = reader.ReadByte() as Genre;*/
    }

    private ReadFrame(information: PropertyInformation): string {
        let pos = this.reader.BaseStream.Position;
        this.reader.BaseStream.Seek(information[1] + 11, SeekOrigin.Begin);

        let data =  this.reader.ReadString(information[2]);
        this.propertyMap.set(information[0], data);

        this.reader.BaseStream.Seek(pos, SeekOrigin.Begin);

        return data;
    }

    private ScanFrame(reader: BinaryReader) {
        let pos = reader.BaseStream.Position;
        let identifier = reader.ReadString(4);
        let size = reader.ReadUInt() - 1;

        this.propertyInformationMap.set(identifier, [identifier, pos, size]);

        reader.BaseStream.Seek(size + 3, SeekOrigin.Current);
    }

    private ScanTAGv2(reader: BinaryReader) {
        let v = reader.ReadBytes(2);
        this.version = [v[0], v[1]];
        
        reader.BaseStream.Seek(1, SeekOrigin.Current);

        let sizeRAW = reader.ReadUInt();
        let size = 0;
        for (let i = 0; i < 4; i++) {
            size |= ((sizeRAW & 0x7F << (i * 7)) >> i);
        }

        while (reader.BaseStream.Position <= size + 10) {
            this.ScanFrame(reader);
        }
    }

    private AccessProperty(name: string): string | undefined {
        let val = this.propertyMap.get(name);

        if (val == undefined) {
            let offs = this.propertyInformationMap.get(name);

            if (offs != undefined)
                return this.ReadFrame(offs);
            else
                return undefined;
        } else {
            return val;
        } 
    }

    get Title() {
        return this.AccessProperty("TIT2");
    }

    get Subtitle() {
        return this.AccessProperty("TIT3");
    }

    get Artist() {
        return this.AccessProperty("TPE1");
    }

    get Composer() {
        return this.AccessProperty("TCOM");
    }

    get Album() {
        return this.AccessProperty("TALB");
    }

    get Year() {
        return this.AccessProperty("TDRC");
    }

    get Comment() {
        return this.AccessProperty("COMM");
    }

    get Track() {
        return this.AccessProperty("TRCK");
    }

    get Genre() {
        return this.AccessProperty("TCOM");
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