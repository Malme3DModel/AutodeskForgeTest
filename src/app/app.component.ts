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
export const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6Ijd6M2gifQ.eyJzY29wZSI6WyJidWNrZXQ6Y3JlYXRlIiwiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSJdLCJjbGllbnRfaWQiOiJsU3pZNmFWNENhaDk1RmJWN2M2R1dnSWhoRzhvTjhsaiIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9hand0ZXhwNjAiLCJqdGkiOiI3VFdyNlpOeTV2a1QzaHJWOHU0VEVuNWk0QzdMVFNoTTNhbGl4aTlxMm14eFZySjJueFFCNDQ5cUdZc1F6NlB3IiwiZXhwIjoxNzA0NTI4NTM3fQ.cu7hRPdU8B8i-joi3pbaKzTUtQCrVN76_yM4BswyD2Pzocwx4tDfSjLEro8alPsYJuuFC0isXzD-bw-hiB99fjoI36GLvVg7QjK93y0tOEBomOXS5XULeClSoRMb4Peb5ktUNc-cXZpX6vnGWGj8O4F2T1S8mxEgySGgDGN3sA1OHOknIhzaVmIVEw4jQxSyBOQh14s7AxpBxU4zHwP-W-614PKj0FHGnqPIEe198F3a0JAdb_wHJux7cm2xDSFsLJ91igITMIkNgL-a3MrM2fca8u6BAuvwtSwS3_YOSVjleUufPb50egGyrLbqiXj-yvGxhNvFI5A9h7ZrTRjU0Q";
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
