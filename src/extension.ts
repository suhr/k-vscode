import vscode from 'vscode';

type Cmd = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void

let terminal: vscode.Terminal;

export function activate(context: vscode.ExtensionContext) {
    // taken and lightly changed from prollings/apl_backtick_symbols
	let pending = false;

    const cmds: [string, Cmd][] = [
        ['language-k.createTerminal', createTerminal],
        ['language-k.loadScript', loadScript],
        ['language-k.executeSelection', executeSelection],
        ['language-k.executeLine', executeLine],
        ['language-k.executeLineAdvance', executeLineAdvance]
    ];
    for(const [n, f] of cmds) { vscode.commands.registerTextEditorCommand(n, f) }
}

export function deactivate(_: vscode.ExtensionContext) {
    if (terminal != null) { terminal.dispose() }
}

function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        const config = vscode.workspace.getConfiguration('k');

        terminal = vscode.window.createTerminal("K REPL", config.executablePath);
        terminal.show();
    }
}

function loadScript(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    createTerminal()

    terminal.sendText(`\\l ${t.document.fileName}`)
}
function executeSelection(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    createTerminal()
    
    let line = t.document.getText(t.selection).trim().replace(/\n+/, ";");
    terminal.sendText(line, true);
}
function executeLine(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    createTerminal()

    let line = t.document.lineAt(t.selection.active.line).text
    terminal.sendText(line, !line.endsWith('\n'))
}
function executeLineAdvance(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    executeLine(t, e)
    vscode.commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine"})
}
