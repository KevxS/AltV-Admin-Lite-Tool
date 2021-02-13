$(document).ready(function(){
    $("#actionList").css("display", "none");
    $("#playerList").css("display", "none");
    alt.emit("WEBVIEW:getAllData");
});

function sendAction(adminAction) {
    alt.emit("WEBVIEW:sendAdminAction", adminAction);
}

alt.on("WEBVIEW:sendAllData", sendAllData);

function sendAllData(adminTag, playerList, actionList) {
    $("#playerList").html(playerList);
    $("#actionList").html(actionList);
    $("#playerList").css("display", "block");
}

function OpenAction(id) {
    alt.emit("WEBVIEW:setSelPlayerId", id);
    $("#playerList").css("display", "none");
    $("#actionList").css("display", "block");
}


