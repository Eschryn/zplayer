import { HTMLSinglePlayer } from './HTMLSinglePlayer.js';
import { StyleInjector } from './StyleInjector.js';

let playerTags = document.getElementsByTagName("player");
for (const playerTag in playerTags) {
    if (playerTags.hasOwnProperty(playerTag)) {
        const element = playerTags[playerTag];
        let t = new HTMLSinglePlayer(element as HTMLElement);
    }
}

StyleInjector.Inject("zplayer/zplayer-base.css");