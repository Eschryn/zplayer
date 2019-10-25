export class StyleInjector {
    public static Inject(file: string) {
        var elem = document.createElement("link") as HTMLLinkElement;
        elem.rel = "stylesheet";
        elem.href = file
        document.head.appendChild(elem);
    }
}