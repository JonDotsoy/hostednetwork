import minimist from "minimist";
import _ from "lodash";
import pkg from "../package.json"
import { start as startHostednetwork, stop as stopHostednetwork, info as infoHostednetwork, setting as settingHostednetwork } from "./hostednetwork";

let Verbose = false;

export let cli = function(argv) {
	let {
		_: [action],
		help,
		verbose,
		version,
		"out-json-tabs": outJsonTabs,
		// Configs to hostednetwork
		ssid,
		key,
		mode,
		"key-usage": keyUsage,
	} = minimist(argv, {
		"alias": {
			"help": "h",
			"version": "v",
			"verbose": "V",
		},
		"default": {
			"out-json-tabs": true,
			"ssid": _.get(process, "env.HOSTEDNETWORK_SSID", "hostednetwork"),
			"key": _.get(process, "env.HOSTEDNETWORK_PASS", "12345.6"),
			"mode": _.get(process, "env.HOSTEDNETWORK_MODE", "allow"),
			"key-usage": _.get(process, "env.HOSTEDNETWORK_KEYUSAGE", "persistent"),
		},
		"boolean": ["help"],
	});

	let JSONtoString = (e) => JSON.stringify(e, null, outJsonTabs);

	let endAction = "help";

	let configsToHostednetwork = { ssid, key, mode, keyUsage };

	if (verbose) {
		Verbose = true;
	}

	if (help) {
		endAction = "help";
	} else
	if (version) {
		endAction = "version";
	} else {
		endAction = action;
	}

	switch (endAction) {
		case "start":
			Verbose && console.log({message: "Set setting"});
			settingHostednetwork(configsToHostednetwork)
				.then(function ({message}) {
					Verbose && console.log({message});
					Verbose && console.log({message: "Showing hosted network"});
					return startHostednetwork(configsToHostednetwork);
				})
				.then(function({message}) {
					Verbose && console.log({message});
					Verbose && console.log({message:"Is started the hosted network"});
					!Verbose && console.log("Is started the hosted network");
				})
				.catch(function(err) {
					Verbose && console.error(err);
					!Verbose && console.error(err.message);
				});
			break;
		case "stop":
			Verbose && console.log({message:"Stopping the hosted network"})
			stopHostednetwork(configsToHostednetwork)
			.then(function({message}) {
				Verbose && console.log({message});
				Verbose && console.log({message: "Is stoppedla red hospedada the hosted network"});
				!Verbose && console.log("Is stoppedla red hospedada the hosted network");
			})
			break;
		case "info":
			infoHostednetwork(configsToHostednetwork)
				.then(function(info) {
					Verbose && console.log(JSONtoString(info));
					if (!Verbose) {
						let outLog = "";
						_.map(info, function (microInfo, titleInfo) {
							outLog += `${titleInfo}\n${"-".repeat(_.size(titleInfo))}\n`;

							_.map(microInfo, function (value, nameValue) {
								outLog += `\t${nameValue}${" ".repeat(30 - _.size(nameValue))}: ${value}\n`;
							});
						});
						console.log(outLog);
					}
				});
			break;
		case "version":
			if (Verbose) {
				console.log(Version());
			} else {
				console.log(`hostednetwork v${Version()}`);
			}
			break;
		case "help":
		default:
			console.log(Verbose ? JSONtoString(Help()) : Help().toString());
			break;
	}
}

export let Help = function() {
	let out = {
		version: `${Version()}`,
		usage: `hostednetwork [OPTIONS] [COMMAND]`,
		options: {},
		commands: {
			start: "Initializes the hotspot service.",
			stop: "Stops the hotspot service.",
			info: "Shows the configuration of the service.",
			help: "Shows commands help.",
		},
	};

	out.toString = function() {
		let { version, usage, options, commands } = this;
		let strgs = ``;
		let optionsStr = "";
		let commandsStr = "";

		_.map(commands, function(description, command) {
			optionsStr += `\t${command}\t${description}\n`;
		});

		strgs += `Version: v${version}\n`;

		strgs += `Usage: ${usage}\n`;

		return `Version: ${version}
Usage: ${usage}

Commands:
${optionsStr}`;

		return optionsStr;
	};

	return out;
}

export let Version = () => pkg.version;
