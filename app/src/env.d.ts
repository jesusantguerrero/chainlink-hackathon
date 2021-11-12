/* eslint-disable node/no-extraneous-import */
/// <reference types="vite/client" />

import { ethers } from "ethers";

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  // eslint-disable-next-line no-var
  // eslint-disable-next-line no-unused-vars
  var ethereum: ethers.providers.ExternalProvider;
}
