import { commands, ExtensionContext, languages, workspace } from "vscode";
import { HaskellCodelensProvider } from "./lenses/HaskellCodelensProvider";
import { GenVisPanel } from "./panels/GenVisPanel";
import { PythonCodelensProvider } from "./lenses/PythonCodelensProvider";

export function activate(context: ExtensionContext) {
  languages.registerCodeLensProvider({ language: "haskell" }, new HaskellCodelensProvider(context.extensionUri));
  languages.registerCodeLensProvider({ language: "python" }, new PythonCodelensProvider(context.extensionUri));

  context.subscriptions.push(commands.registerCommand("gen-vis.view-visualization", () => {
    GenVisPanel.render(context.extensionUri, true);
  }));

  context.subscriptions.push(commands.registerCommand("gen-vis.pick-new-data", () => {
    GenVisPanel.pickNewData();
  }));

  context.subscriptions.push(commands.registerCommand("gen-vis.refresh-data", () => {
    GenVisPanel.refreshData();
  }));

  context.subscriptions.push(commands.registerCommand("gen-vis.select-generator-inline", (document, range) => {
    GenVisPanel.selectGeneratorInline(document, range, context.extensionUri);
  }));

  context.subscriptions.push(commands.registerCommand("gen-vis.hypothesis-run-property", (document, range) => {
    GenVisPanel.hypothesisRunProperty(document, range, context.extensionUri);
  }));

  workspace.onDidSaveTextDocument((document) => {
    if (GenVisPanel.currentPanel && GenVisPanel.currentPanel.isViewing(document)) {
      GenVisPanel.currentPanel.refreshDataForActiveVisualization();
    }
  });
}
