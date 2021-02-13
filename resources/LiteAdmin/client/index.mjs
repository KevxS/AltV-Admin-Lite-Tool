import native from 'natives';
import alt from 'alt';

var hotkey = 220;
var isAdminMenuOpen = false;
var liteAdminMenu = undefined;
var adminTag = undefined;
var playerList = undefined;
var actionList = undefined;
var selPlayerId = undefined;

alt.on('keydown', (key) => {
    if(key === hotkey) {
        if (!isAdminMenuOpen) {
            alt.emitServer('Server:Admin:OpenMenu');
        } else {
            closeLiteAdminMenu(alt.Player.local);
        }
    }
});

alt.onServer('Player:Admin:OpenMenu', (tag, playerlist, actionlist) => {
    adminTag = tag;
    playerList = playerlist;
    actionList = JSON.parse(actionlist);
    openLiteAdminMenu(alt.Player.local);
});

function openLiteAdminMenu(player) {
    if(liteAdminMenu == undefined && adminTag != undefined && playerList != undefined && actionList != undefined && selPlayerId == undefined){
        isAdminMenuOpen = true;
        liteAdminMenu = new alt.WebView('http://resource/client/html/index.html');
        liteAdminMenu.focus();
        alt.showCursor(true);
        alt.toggleGameControls(false);

        liteAdminMenu.on('WEBVIEW:getAllData', () => {
            liteAdminMenu.emit('WEBVIEW:sendAllData', adminTag, playerList, actionList);
        });

        liteAdminMenu.on('WEBVIEW:setSelPlayerId', (id) => {
            selPlayerId = id;
        });

        liteAdminMenu.on('WEBVIEW:sendAdminAction', (action) => {
            alt.emitServer("Server:Admin:Action", action, selPlayerId);
            closeLiteAdminMenu(alt.Player.local);
        });
    }   
}

function closeLiteAdminMenu(player) {
    liteAdminMenu.unfocus();
    liteAdminMenu.destroy();
    alt.showCursor(false);
    alt.toggleGameControls(true);
    isAdminMenuOpen = false;
    liteAdminMenu = undefined;
    adminTag = undefined;
    playerList = undefined;
    actionList = undefined;
    selPlayerId = undefined;
}

//notify
const notify = {
    isLoaded: false,
    view: null
};
  
alt.on('connectionComplete', () => {
    notify.view = new alt.WebView('http://resource/client/view/index.html');
    notify.view.on('notify:loaded', () => notify.isLoaded = true);
});

alt.onServer('Player:Info:MSG', (msglabel ,text) => {
    if (msglabel == 1) {
        notify.view.emit('notify:send', {
            text: text,
            timeout: 5000,
            textColor: '#000000',
            backgroundColor: 'rgba(236,236,255,0.85)',
            lineColor: '#6c7ae0'
        });
    }
    if (msglabel == 2) {
        notify.view.emit('notify:send', {
            text: text,
            timeout: 7000,
            textColor: '#000000',
            backgroundColor: 'rgba(255, 164, 66,0.85)',
            lineColor: '#ff8e14'
        });
    }
    if (msglabel == 3) {
        notify.view.emit('notify:send', {
            text: text,
            timeout: 8000,
            textColor: '#ffffff',
            backgroundColor: 'rgba(232, 125, 125,0.85)',
            lineColor: '#ed4242'
        });
    }
});

alt.onServer('ADMIN:PLAYER:FREEZE', (bool) => {
    if (bool) {
        alt.toggleGameControls(false);
    } else {
        alt.toggleGameControls(true);
    }
});
