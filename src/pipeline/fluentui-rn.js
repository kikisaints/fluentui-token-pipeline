"use strict"

const StyleDictionary = require("style-dictionary")

const Utils = require("./utils")

const getNameForCss = (path, prefix) =>
	Utils.getModifiedPathForNaming(path, prefix)
		.join("")
		.toLowerCase()		

StyleDictionary.registerTransform({
	name: "fluentui/name/rnkebab",
	type: "name",
	transformer: (prop, options) => getNameForCss(prop.path, options.prefix),
})

StyleDictionary.registerTransform({
	name: "fluentui/rnalias/css",
	type: "value",
	matcher: (prop) => "resolvedAliasPath" in prop,
	transformer: (prop, options) => 
	{
		const value = prop.value
		if (typeof value === "number")
		{
			return value;
		}
		return `"${prop.value}"`;
	},
})

StyleDictionary.registerTransform({
	name: "fluentui/size/rncss",
	type: "value",
	matcher: (prop) => prop.attributes.category === "size",
	transformer: (prop, options) =>
	{
		/*
			Transforms an array of top/right/bottom/left values into a CSS margin or padding string.
			Single values are also allowed. All numbers are interpreted as pixels.

			100
				-->
			100px

			[ 100, 200, 300, 400 ]
				-->
			100px 200px 300px 400px
		*/
		const value = prop.value
		if (typeof value === "number")
		{
			const MaxCornerRadius = 15
			return (value > MaxCornerRadius) ? MaxCornerRadius.toString() : value.toString()
		}
		else if (Array.isArray(value) && value.length === 4)
			return `${value[0]}px ${value[1]}px ${value[2]}px ${value[3]}px`
		else
			console.warn(`Unrecognized size value: "${value}". Use a single number or an array [top, right, bottom, left].`)
	},
})

StyleDictionary.registerTransform({
	name: "fluentui/color/rn",
	type: "value",
	matcher: (prop) => prop.attributes.category === "color",
	transformer: (prop, options) =>
	{
		const value = prop.value
		return `'${value}'`
	},
})

StyleDictionary.registerFormat({
	name: "fluentui/rn/res",
	formatter: (dictionary, config) =>
	{
		return `export default {
${dictionary.allProperties.map((prop) =>
	{
		if (prop.attributes.aliasResourceName)
		{
			return `	<StaticResource x:Key="${prop.name}" ResourceKey="${prop.attributes.aliasResourceName}" />`
		}
		else
		{
			const xamlType = prop.attributes.xamlType || "x:String"
			return `    ${prop.name}: ${Utils.escapeXml(prop.value)},`
		}
	}).join("\n")}
};`
	},
})


StyleDictionary.registerTransformGroup({
	name: "fluentui/rnflat",
	transforms: ["fluentui/attribute", "fluentui/name/rnkebab", "time/seconds", "fluentui/rnalias/css", "fluentui/size/rncss", "fluentui/color/rn"],
})
