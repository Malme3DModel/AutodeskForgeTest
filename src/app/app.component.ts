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
export const ACCESS_TOKEN = "TOKEN_HERE";
export const DOCUMENT_URN = "URN_HERE";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
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
