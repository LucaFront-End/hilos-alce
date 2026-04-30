// src/lib/wixClient.js
// Wix Headless client — centralised singleton
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const CLIENT_ID = 'a157e7f7-53aa-4b34-9bd7-8cd21ce04875';

export const wixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: CLIENT_ID }),
});
