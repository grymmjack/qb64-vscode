"use strict";
import * as fs from "fs";
import * as vscode from "vscode";
import * as logFunctions from "./logFunctions";
import * as commonFunctions from "./commonFunctions";
import { workerData } from "worker_threads";

export class TokenInfo {
	private outputChannnel: any = null;
	public readonly keyword: string = "";
	public readonly keywordNoPrfix: string = "";
	public readonly token: string = "";
	public readonly offlinehelp: string = "";
	public readonly onlineHelp: string = "";
	public readonly WordFormatted: string = ""; // Should be read only or have a private setter.
	public readonly isKeyword: boolean = true;

	constructor(token?: string, outputChannnelToUse?: any) {
		if (!token || token.length < 1) {
			const editor = vscode.window.activeTextEditor;
			let word: string = "";
			word = editor ? editor.document.getText(editor.selection) : "";
			if (word.length > 0) {
				token = word.split(" ")[0];
			} else {
				token = commonFunctions.getQB64Word(editor);
			}
		}

		if (outputChannnelToUse) {
			this.outputChannnel = outputChannnelToUse;
		} else {
			this.outputChannnel = logFunctions.getChannel(logFunctions.channelType.help);
		}

		logFunctions.writeLine("Starting Hover", this.outputChannnel);
		this.token = token;
		this.keyword = token;
		const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("qb64")
		const path = require('path');

		let helpPath: string = config.get("installPath");
		let helpFile = path.join(helpPath, "internal", "help", `${this.keyword}.md`).replaceAll("\\", "/");
		if (fs.existsSync(helpFile)) {
			this.offlinehelp = helpFile;
			this.onlineHelp = `https://github.com/QB64Official/qb64/wiki/${encodeURIComponent(this.keyword)}`
			this.keywordNoPrfix = this.keyword.startsWith("_") ? this.keyword.slice(1) : this.keyword;
			this.WordFormatted = this.getWordFormatted(config);
			return
		}

		//logFunctions.writeLine(`Keyword ${this.keyword} not found adding "_" and trying again`, this.outputChannnel);
		this.keyword = `_${token}`;
		helpFile = path.join(helpPath, "internal", "help", `${this.keyword}.md`).replaceAll("\\", "/");
		if (fs.existsSync(helpFile)) {
			this.offlinehelp = helpFile;
			this.onlineHelp = `https://github.com/QB64Official/qb64/wiki/${encodeURIComponent(this.keyword)}`
			this.keywordNoPrfix = this.keyword.slice(1);
			this.WordFormatted = this.getWordFormatted(config);
			return
		}

		logFunctions.writeLine(`Keyword ${this.keyword} markdown not found not. Tring helpify `, this.outputChannnel);
		this.keyword = `${token}`;
		logFunctions.writeLine(`helpify file ${helpFile}`, this.outputChannnel);
		helpFile = path.join(helpPath, "internal", "help", `${this.helpify()}.md`).replaceAll("\\", "/");
		if (fs.existsSync(helpFile)) {
			logFunctions.writeLine(`helpify file ${helpFile}`, this.outputChannnel);
			this.offlinehelp = helpFile;
			this.onlineHelp = `https://github.com/QB64Official/qb64/wiki/${encodeURIComponent(this.keyword)}`
			this.keywordNoPrfix = this.keyword;
			this.WordFormatted = this.getWordFormatted(config);
			return
		}

		this.keyword = token;
		this.isKeyword = false;
		this.WordFormatted = token;

		logFunctions.writeLine(`keywordInfo.token: ${this.token}`, this.outputChannnel);
		logFunctions.writeLine(`keywordInfo.keyword: ${this.keyword}`, this.outputChannnel);
		logFunctions.writeLine(`keywordInfo.keywordNoPrfix: ${this.keywordNoPrfix}`, this.outputChannnel);
		logFunctions.writeLine(`keywordInfo.offlinehelp: ${this.offlinehelp}`, this.outputChannnel);
		logFunctions.writeLine(`keywordInfo.isKeyword: ${this.isKeyword}`, this.outputChannnel);

	}

	/**
	 * Gets the hovertext to show
	 * @returns 
	 */
	public getHoverText(): string {
		let retvalue = ""
		if (this.isKeyword) {
			if (this.offlinehelp.length > 0) {
				retvalue = fs.readFileSync(this.offlinehelp).toString();
			} else {
				retvalue = "Press F1 for help"
			}
		}
		return retvalue;
	}

	/**
	 * Opens the help.  Either online or offline
	 */
	public showHelp() {
		try {
			const config = vscode.workspace.getConfiguration("qb64");
			if (this.offlinehelp.length > 0) {
				if (config.get("isOpenHelpInEditModeEnabled")) {
					logFunctions.writeLine(`Open ${this.offlinehelp} in edit mode`, this.outputChannnel);
					vscode.workspace.openTextDocument(this.offlinehelp).then(d => vscode.window.showTextDocument(d));
				} else {
					logFunctions.writeLine(`Open ${this.offlinehelp} in view mode`, this.outputChannnel);
					vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(this.offlinehelp));
				}
			} else if (config.get("isOpenOnLineHelpEnabled")) {
				logFunctions.writeLine(`Open URL: ${this.onlineHelp} `, this.outputChannnel);
				vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(this.onlineHelp));
			}
		} catch (error) {
			logFunctions.writeLine(`ERROR in showHelp: ${error}`, this.outputChannnel);
			vscode.window.showErrorMessage(`"ERROR: ${error}`)
		}
	}

	/**
	 * Takes a keyword and makes it match the markdown file.
	 */
	private helpify(): string {
		let word = this.keyword.trim().toLowerCase();

		logFunctions.writeLine(`Helpify Before: ${word}`, this.outputChannnel);

		if (word == "end") {
			word = "End"
		} else if (word == "if" || word == "then") {
			word = "If...Then"
		} else if (word == "for" || word == "next") {
			word = "FOR...NEXT"
		} else if (word == "sub") {
			word = "Sub-(explanatory)"
		} else if (word == "function") {
			word = "Function"
		} else if (word == "select" || word == "case") {
			word = "SELECT-CASE"
		} else if (word == "do" || word == "loop") {
			word = "DO...LOOP"
		} else if (word == "declare") {
			word = "DECLARE-LIBRARY";
		}
		return word;
	}

	/**
	 * Gets the the formatted version of the token
	 * @param config WorkspaceConfiguration used to check the user selected formattting settings
	 * @returns 
	 */
	private getWordFormatted(config: vscode.WorkspaceConfiguration) {
		if (!this.isKeyword) {
			return this.token;
		}

		switch (config.get("formatMode")) {
			case "Lower Case":
				return this.token.toLowerCase();

			case "Upper Case":
				return this.token.toUpperCase();

			case "Mixed Case":
				if (this.token.startsWith("_")) {
					return this.token.substring(0, 2).toUpperCase() + this.token.substring(2).toLowerCase();
				} else {
					return this.token.substring(0, 1).toUpperCase() + this.token.substring(1).toLowerCase();
				}

			case "No Change":
			default:
				return this.token;
		}

	}

}