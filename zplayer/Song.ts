
class Song {
    private title: string | undefined;
    private artist: string | undefined;
    private originalArtist: string | undefined;
    private album: string | undefined;
    private year: string | undefined;
    private comment: string | undefined;
    private track: string | undefined;
    private genre: Genre | string | undefined;
    private speed: number | undefined;
    private start_time: string | undefined;
    private end_time: string | undefined;

    constructor(reader: BinaryReader | BinaryStreamReader) {
        if (reader.ReadString(3) == "ID3") {
            this.ReadTAGv2(reader);
        }
        //reader.Seek(SeekOrigin.End, 512);
        /*if (reader.ReadString(3) == "TAG")
            this.ReadTag(reader);*/
    }

    public static FromURI(URI: string): Song {
        return Req.ArrayBuffer(Path.Append(Path.BaseURI, URI), (e) => {
            return new Song(new BinaryReader(e));
        });
    }

    private ReadEnhancedTag(reader: BinaryReader | BinaryStreamReader) {
        this.title = reader.ReadString(60);
        this.artist = reader.ReadString(60);
        this.album = reader.ReadString(60);
        this.speed = reader.ReadByte();
        this.genre = reader.ReadString(30);
        this.start_time = reader.ReadString(6);
        this.end_time = reader.ReadString(6);
    }

    private ReadTAGv1(reader: BinaryReader | BinaryStreamReader) {
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
            this.genre = reader.ReadByte() as Genre;
    }

    private ReadFrame(reader: BinaryReader | BinaryStreamReader) {
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

    private ReadTAGv2(reader: BinaryReader | BinaryStreamReader) {
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