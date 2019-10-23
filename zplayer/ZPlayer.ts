function CreatePlayer(elem: HTMLElement): HTMLSinglePlayer {
    return new HTMLSinglePlayer(elem);
}

let playerTags = document.getElementsByTagName("player");
for (const playerTag in playerTags) {
    if (playerTags.hasOwnProperty(playerTag)) {
        const element = playerTags[playerTag];
        let t = CreatePlayer(element as HTMLElement);
        console.log(t);
        let attr = element.getAttribute("file");
        if (attr !== null)
            t.File = attr;
    }
}

var zplayScrip = document.getElementById("zplayer") as HTMLScriptElement;
var elem = document.createElement("link") as HTMLLinkElement;
elem.rel = "stylesheet";
elem.href = "zplayer/zplayer-base.css"
document.head.appendChild(elem);