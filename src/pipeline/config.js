"use strict"

const _ = require("lodash")
const jsonfile = require("jsonfile")

const FluentUIAliases = require("./fluentui-aliases")
const FluentUIColorRamps = require("./fluentui-color-ramp")
const FluentUIComputed = require("./fluentui-computed")
require("./fluentui-shared")
require("./fluentui-css")
require("./fluentui-rn")
require("./fluentui-html")
require("./fluentui-ios")
require("./fluentui-winui")

// ------------------------------------------------------------
// Configure pipeline input and output here
// ------------------------------------------------------------

/*
	List at least one input JSON file, relative to the root of the repo.

	To see the pipeline merge multiple JSON files together, try adding "src/tokens/example-red-accent.json" to the array.
*/
const inputTokenFiles = ["src/tokens/project-tokens.json"]

/*
	Specify the path to where output files should be generated, relative to the root of the repo.
	Additional folders will be included within that one.
*/
const outputPath = "build"

// ------------------------------------------------------------

let tokens = {}
inputTokenFiles.forEach((inputFile) => _.merge(tokens, jsonfile.readFileSync(inputFile)))
/*tokens = FluentUIColorRamps.buildColorRamps(tokens)*/
tokens = FluentUIAliases.resolveAliases(tokens)
tokens = FluentUIComputed.resolveComputedTokens(tokens)

module.exports = {
	properties: tokens,

	platforms: {
		debug: {
			transformGroup: "js",
			buildPath: `${outputPath}/debug/`,
			files: [{ destination: "fluentuitokens-debug.json", format: "json" }],
		},

		reference: {
			transformGroup: "fluentui/html",
			buildPath: `${outputPath}/reference/`,
			files: [{ destination: "fluentuitokens.html", format: "fluentui/html/reference" }],
		},

		ios: {
			transformGroup: "fluentui/swift",
			// buildPath to change files directly in fluentUI-tokens-demo iOS app: "../fluentUI-tokens-demo/FluentUITokensDemo/Common/Styles/"
			buildPath: `${outputPath}/ios/`,
			files: [
				{ destination: "FluentUITokens.swift", format: "ios-swift/class.swift", className: "FluentUITokens" },
				{ destination: "FluentUIColorTokens.swift", format: "ios-swift/class.swift", className: "FluentUIColorTokens", filter: "isColor" },
				{ destination: "FluentUISizeTokens.swift", format: "ios-swift/class.swift", className: "FluentUISizeTokens", filter: "isSize" },
				{ destination: "FluentUIFontTokens.swift", format: "ios-swift/class.swift", className: "FluentUIFontTokens", filter: "isFont" },
			],
		},

		css: {
			transformGroup: "fluentui/css",
			buildPath: `D:/Projects/tokentest/src/`,
			files: [{ destination: "fluentuitokens.css", format: "css/variables" }],
		},

		cssflat: {
			transformGroup: "fluentui/cssflat",
			buildPath: `${outputPath}/web/`,
			files: [{ destination: "fluentuitokens-flat.css", format: "css/variables" }],
		},
		
		rnflat: {
			transformGroup: "fluentui/rnflat",
			buildPath: `D:/Projects/rnwtest/`,
			files: [{ destination: "theme.style.js", format: "fluentui/rn/res" }],
		},

		winui: {
			transformGroup: "fluentui/winui",
			buildPath: `D:/projects/github/xamltokens/`,
			files: [{ destination: "FluentUITokens.xaml", format: "fluentui/xaml/res" }],
		},
	},
}
