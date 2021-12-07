"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = __importDefault(require("vscode"));
let terminal;
function activate(context) {
    // taken and lightly changed from prollings/apl_backtick_symbols
    let pending = false;
    const cmds = [
        ['language-k.createTerminal', createTerminal],
        ['language-k.loadScript', loadScript],
        ['language-k.executeSelection', executeSelection],
        ['language-k.executeLine', executeLine],
        ['language-k.executeLineAdvance', executeLineAdvance]
    ];
    for (const [n, f] of cmds) {
        vscode_1.default.commands.registerTextEditorCommand(n, f);
    }
}
exports.activate = activate;
function deactivate(_) {
    if (terminal != null) {
        terminal.dispose();
    }
}
exports.deactivate = deactivate;
function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        const config = vscode_1.default.workspace.getConfiguration('k');
        terminal = vscode_1.default.window.createTerminal("K REPL", config.executablePath);
        terminal.show();
    }
}
function loadScript(t, e) {
    createTerminal();
    terminal.sendText(`\\l ${t.document.fileName}`);
}
function executeSelection(t, e) {
    createTerminal();
    let line = t.document.getText(t.selection).trim().replace(/\n+/, ";");
    terminal.sendText(line, true);
}
function executeLine(t, e) {
    createTerminal();
    let line = t.document.lineAt(t.selection.active.line).text;
    terminal.sendText(line, !line.endsWith('\n'));
}
function executeLineAdvance(t, e) {
    executeLine(t, e);
    vscode_1.default.commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine" });
}
