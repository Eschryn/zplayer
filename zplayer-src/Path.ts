class Path {
    static get BaseURI(): string {
        if (document != null) 
            return document.baseURI as string;

        return "";
    }

    public static Append(Path: string, File: string) {
        return this.GetPath(Path) + File.trim();
    }

    public static GetPath(URI: string): string {
        if (URI.startsWith("http")) {
            let index = URI.length;
            for (; index >= 0 && URI[index] != "/"; index--);
            return URI.substr(0, ++index);
        }
        return "";
    }
}