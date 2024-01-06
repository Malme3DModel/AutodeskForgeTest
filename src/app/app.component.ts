import { Component } from "@angular/core";
import {
  ViewerOptions,
  ViewerInitializedEvent,
  DocumentChangedEvent,
  SelectionChangedEventArgs,
  Extension
} from "ng2-adsk-forge-viewer";

import { MyExtension } from "./my-extension";

// Insert a token and a document URN here
// Then refresh the app
export const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6Ijd6M2gifQ.eyJzY29wZSI6WyJ2aWV3YWJsZXM6cmVhZCJdLCJjbGllbnRfaWQiOiJFa2dpRTRiSlZYcnp6QWVBdzliR2N3UDB3T1VVa3VHViIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiJBVXVzZEtmcGJIUTg1MHdNTmUwQ0d1d3dyV2ZvV2dRR09Nd2NIR2Q5RGpvTUZsVFRGaEVSZGRDeHJObFRLNkNpIiwiZXhwIjoxNzA0NTMyMDg1fQ.UVDiMO3OimcOMOVpUBrqzMAq02UC4nDl0x3ll9MIjcBt_8RL9BGo9MzTlgPC08w-3U0YHeUtQj75s130N4Wdu1MwK9auYVSeMcmY5SI_CZe2OOFO0z9sOHgKBB_aYLQeteGeMsmu2ouWM87xoGMIkBMZQoZLzWpHVyEJIeFsZPnX7xzGmYqfBP_8r_8gWwta_6G5dV45KK-x_UqhLrTUZ32hbCb4eBId9BnHT3vbNL6cze5dwWiTwef27-Sz81LMTbTJwV3VkJDwubjdOkjPUHw15QDkXpJHeDpiujDsXuNO_s0Y_owZ8amzyxkqTl1zMYiXMoBFXDhubdFQlPc8iA";
export const DOCUMENT_URN = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2UtY29kZXBlbi1tb2RlbHMvcmFjLWFkdmFuY2VkLXNhbXBsZS1wcm9qZWN0LnJ2dA";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  name = "Angular Forge Viewer";
  public viewerOptions!: ViewerOptions;
  public documentId!: string;

  public ngOnInit() {
    this.viewerOptions = {
      initializerOptions: {
        env: "AutodeskProduction",
        getAccessToken: (
          onGetAccessToken: (token: string, expire: number) => void
        ) => {
          const expireTimeSeconds = 60 * 30;
          onGetAccessToken(ACCESS_TOKEN, expireTimeSeconds);
        },
        api: "derivativeV2",
        enableMemoryManagement: true
      },
      viewerConfig: {
        extensions: ["Autodesk.DocumentBrowser", MyExtension.extensionName],
        theme: "bim-theme"
      },
      onViewerScriptsLoaded: () => {
        // Register a custom extension
        Extension.registerExtension(MyExtension.extensionName, MyExtension);
      },
      onViewerInitialized: (args: ViewerInitializedEvent) => {
        args.viewerComponent.DocumentId = DOCUMENT_URN;
      },
      // showFirstViewable: false,
      // headlessViewer: true,
      // Set specific version number
      //version: "7.41"
    };
  }

  public selectionChanged(event: SelectionChangedEventArgs) {
    console.log(event.dbIdArray);
  }
}
