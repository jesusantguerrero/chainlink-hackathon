/* eslint-disable node/no-extraneous-import */
/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}


declare module "myConfig" {
  global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
      ethereum: any;
      Web3: any;
    }
  }
}
