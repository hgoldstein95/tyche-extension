import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "@vscode/codicons/dist/codicon.css";
import "./index.scss";

let dataSourceURL: string | undefined;
let simplifiedMode = false;
if (document && document.location && document.location.search) {
  const searchParams = new URLSearchParams(document.location.search);
  simplifiedMode = searchParams.get("simplifiedMode") === "true";
  const maybeDataSourceUrl = searchParams.get("dataSourceURL");
  if (maybeDataSourceUrl) {
    dataSourceURL = decodeURI(maybeDataSourceUrl);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App dataSourceURL={dataSourceURL} simplifiedMode={simplifiedMode} />
  </React.StrictMode>,
  document.getElementById("root")
);
