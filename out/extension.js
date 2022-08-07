'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.showHelp = exports.buildAndRunWithoutDebug = exports.activate = void 0;
const vscode = require("vscode");
// Channels
// They have to be cached or vs creates a new channel every time 😒
// If we end up with a lot of changes an array might be better.
var helpChannel;
var formatterhannel;
var qb64BuildChannel;
var outlineChannel;
// Gets the selected editor text is nothing is selected return empty string.
function getSelectedText() {
    let editor = vscode.window.activeTextEditor;
    return editor ? editor.document.getText(editor.selection) : "";
}
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ scheme: "file", language: "QB64" }, new Qb64ConfigDocumentSymbolProvider()));
    // Register Commands here
    context.subscriptions.push(vscode.commands.registerCommand('extension.showHelp', () => { showHelp(context); }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.buildAndRunWithoutDebug', () => { buildAndRunWithoutDebug(context, true); }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.buildOnly', () => { buildAndRunWithoutDebug(context, false); }));
}
exports.activate = activate;
function buildAndRunWithoutDebug(context, runApp) {
    let outputChannnel;
    try {
        if (qb64BuildChannel) {
            outputChannnel = qb64BuildChannel;
        }
        else {
            qb64BuildChannel = vscode.window.createOutputChannel("QB64: Compile");
            outputChannnel = qb64BuildChannel;
        }
        let fileName = vscode.window.activeTextEditor.document.uri.fsPath;
        let exeName = fileName.replace(".bas", ".exe");
        let shellCmd = "qb64.exe -c " + fileName + " -o " + exeName + " -x -w";
        outputChannnel.appendLine("***********************************");
        outputChannnel.appendLine("Working Folder: " + vscode.workspace.workspaceFolders[0].uri.fsPath);
        outputChannnel.appendLine("Compile File: " + fileName);
        outputChannnel.appendLine("Output File: " + exeName);
        outputChannnel.appendLine("Build Command: " + shellCmd);
        new vscode.ProcessExecution(shellCmd);
        outputChannnel.appendLine("After Build");
        //new vscode.Task(vscode.ShellExecution(shellCmd));
        //let x = new vscode.ShellExecution(shellCmd);
        // ShellExecute()
        if (runApp) {
            new vscode.ShellExecution(exeName);
        }
    }
    catch (error) {
        outputChannnel.appendLine("ERROR: " + error);
    }
}
exports.buildAndRunWithoutDebug = buildAndRunWithoutDebug;
function showHelp(context) {
    const BASE_URL = "https://github.com/QB64Official/qb64/wiki/";
    let outputChannnel;
    try {
        if (helpChannel) {
            outputChannnel = helpChannel;
        }
        else {
            helpChannel = vscode.window.createOutputChannel("QB64: Help");
            outputChannnel = helpChannel;
        }
        let code = getSelectedText();
        if (code.length < 1) {
            return;
        }
        // Handle cases where it's easy to select too much text or the text doesn't match the wiki page.
        if (code.toLowerCase().startsWith("end ")) {
            code = "End";
        }
        else if (code.toLowerCase().startsWith("end ")) {
            code = "If...Then";
        }
        else if (code.toLowerCase().startsWith("sub ")) {
            code = "Sub";
        }
        else if (code.toLowerCase().startsWith("function ")) {
            code = "Function";
        }
        let url = BASE_URL + encodeURIComponent(code);
        outputChannnel.appendLine(`Open URL: ${url}`);
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
        // openDefaultBrowswer(url);
    }
    catch (error) {
        outputChannnel.appendLine("ERROR: " + error);
    }
}
exports.showHelp = showHelp;
// Code Formatter
// Seems like a good place to find includes and make the double click to open work.
vscode.languages.registerDocumentFormattingEditProvider('QB64', {
    provideDocumentFormattingEdits(document) {
        let retvalue = [];
        let line;
        let outputChannnel;
        if (formatterhannel) {
            outputChannnel = formatterhannel;
        }
        else {
            formatterhannel = vscode.window.createOutputChannel("QB64: Formatter");
            outputChannnel = formatterhannel;
        }
        for (let i = 0; i < document.lineCount; i++) {
            line = document.lineAt(i);
            let lineText = line.text.trimEnd();
            if (lineText.endsWith(";") && lineText.toLowerCase().indexOf("print") < 0 && lineText.indexOf("print") < 0) {
                // Time to remove the ";" that is not needed at the end of the line
                do {
                    lineText = lineText.substring(0, lineText.length - 1).trimEnd();
                } while (lineText.endsWith(";"));
            }
            if (lineText != line.text) {
                outputChannnel.appendLine(`Line: ${i}|C| ${line.text.trimEnd()}`);
                outputChannnel.appendLine(`Line: ${i}|N| ${lineText}`);
                retvalue.push(vscode.TextEdit.replace(line.range, lineText));
            }
        }
        return retvalue;
    }
});
// Setup the Outline window
class Qb64ConfigDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve, reject) => {
            let symbols = [];
            let nodes = [symbols];
            let inside_marker = false;
            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i);
                if (line.text.toLowerCase().startsWith("sub ") || line.text.toLowerCase().startsWith("function ")) {
                    let isSub = line.text.toLowerCase().startsWith("sub ");
                    let tokens = line.text.split(" ");
                    let marker_symbol = new vscode.DocumentSymbol(tokens[1].trim(), isSub ? "Sub" : "Function", isSub ? vscode.SymbolKind.Method : vscode.SymbolKind.Function, line.range, line.range);
                    nodes[nodes.length - 1].push(marker_symbol);
                    if (!inside_marker) {
                        nodes.push(marker_symbol.children);
                        inside_marker = true;
                    }
                }
                else if (line.text.toLowerCase().startsWith("end sub") || line.text.toLowerCase().startsWith("end function")) {
                    if (inside_marker) {
                        nodes.pop();
                        inside_marker = false;
                    }
                }
            }
            resolve(symbols);
        });
    }
}
//# sourceMappingURL=extension.js.map