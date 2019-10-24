import { HTMLSinglePlayer } from './HTMLSinglePlayer.js';
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
//# sourceMappingURL=ZPlayer.js.map