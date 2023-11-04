import { commands, ExtensionContext, languages, workspace, window } from "vscode";
import { TychePanel } from "./panels/TychePanel";
import { PropertyCodelensProvider } from "./lenses/PropertyCodelensProvider";
import { WebSocketServer } from "ws";

export function activate(context: ExtensionContext) {
  languages.registerCodeLensProvider({ language: "python" }, new PropertyCodelensProvider(context.extensionUri));

  context.subscriptions.push(commands.registerCommand("gen-vis.view-visualization", () => {
    TychePanel.render(context.extensionUri);
  }));

  context.subscriptions.push(commands.registerCommand("gen-vis.hypothesis-run-property", (document, range) => {
    TychePanel.runProperty(document, range, context.extensionUri);
  }));

  context.subscriptions.push(commands.registerCommand("gen-vis.toggle-coverage", () => {
    TychePanel.toggleCoverage();
  }));

  const config = workspace.getConfiguration("tyche");
  const server = new WebSocketServer({ port: config.get("websocketPort") });
  server.on("connection", (socket) => {
    socket.on("message", (message) => {
      TychePanel.loadJSONStringFromCommand(context.extensionUri, message.toString());
    });
  });
  context.subscriptions.push({ dispose() { server.close(); } });

  window.onDidChangeVisibleTextEditors(() => {
    TychePanel.decorateCoverage();
  });
}
