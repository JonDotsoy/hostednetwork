import _ from "lodash";
import { exec as Exec } from "child_process";

let correct_property = function (str) {
	str = String(str)

	if (str.search(/\"/gi) !== -1) {
		str = str.replace(/\"/ig, '\\\"')
	}

	if (str.search(/([^a-z0-9])/ig) !== -1) {
		str = `"${str}"`
	}

	return str
}

export let setting = function({ ssid = "net", key = "12345678", mode = "allow", keyUsage = "persistent" } = {}) {
	ssid = correct_property(ssid)
	key = correct_property(key)
	mode = correct_property(mode)
	keyUsage = correct_property(keyUsage)

	let com = `netsh wlan set hostednetwork ssid=${ssid} key=${key} mode=${mode} keyUsage=${keyUsage}`

	return new Promise(function(resolve, reject) {
		Exec(com, {
			encoding: "utf8",
		}, function (error, stdout, stderr) {
			if (error) {
				reject(error);
			} else {
				if (stderr) {
					reject(stderr);
				} else {
					resolve({
						status: "ok",
						message: stdout,
					});
				}
			}
		});
	});
}

export let start = function({} = {}) {
	return new Promise(function(resolve, reject) {
		Exec(`netsh wlan start hostednetwork`, {
			encoding: "utf8",
		}, function (error, stdout, stderr) {
			if (error) {
				reject(error);
			} else {
				if (stderr) {
					reject(stderr);
				} else {
					resolve({
						status: "ok",
						message: stdout,
					});
				}
			}
		});
	});
}

export let info = function({} = {}) {
	return new Promise(function(resolve, reject) {
		Exec(`netsh wlan show hostednetwork`, {
			encoding: "utf8",
		}, function (error, stdout, stderr) {
			if (error) {
				reject(error);
			} else {
				if (stderr) {
					reject(stderr);
				} else {
					resolve(stdout);
				}
			}
		});
	});
}

export let stop = function({} = {}) {
	return new Promise(function(resolve, reject) {
		Exec(`netsh wlan stop hostednetwork`, {
			encoding: "utf8",
		}, function (error, stdout, stderr) {
			if (error) {
				reject(error);
			} else {
				if (stderr) {
					reject(stderr);
				} else {
					resolve({
						status: "ok",
						message: stdout,
					});
				}
			}
		});
	});
}