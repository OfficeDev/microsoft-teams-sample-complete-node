var microsoftTeams;

// Set up the tab and stuff.
$(document).ready(function () {
    microsoftTeams.initialize();
    microsoftTeams.settings.registerOnSaveHandler(function (saveEvent) {
      microsoftTeams.settings.setSettings({ suggestedDisplayName: "Bot Info", contentUrl: createTabUrl(), entityId: "test123" });
      saveEvent.notifySuccess();
    });

    microsoftTeams.settings.setValidityState(true);
});

function createTabUrl() {
    return window.location.protocol + "//" + window.location.host + "/tabDisplay";
}