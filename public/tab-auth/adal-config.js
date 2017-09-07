// Copyright (c) Microsoft Corporation. All rights reserved.​

// ADAL.js configuration
let config = {
    // The id of the AAD app
    clientId: "b0397c0b-add2-4156-9900-dc48745ba85b",
    // AAD app config should have this as a valid redirect uri
    redirectUri: window.location.origin + "/tab-auth/silent-end.html",
    cacheLocation: "localStorage",
    navigateToLoginRequestUrl: false,
};
