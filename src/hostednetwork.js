import _ from "lodash";
import { exec as Exec } from "child_process";

export let setting = function({ ssid = "hostednetwork", key = "12345.6", mode = "allow", keyUsage = "persistent" } = {}) {
	return new Promise(function(resolve, reject) {
		Exec(`netsh wlan set hostednetwork key="${key}" ssid="${ssid}" mode="${mode}" keyUsage="${keyUsage}"`, {
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
					let out = {};
					let lastLineConfig = null;
					_.map(_.split(stdout, "\n"), function (line) {
						line = line.trim();
						if (_.size(line) > 0 && line.match(/^\-+$/) == null) {
							let matchTitle = line.match(/^(.+)\:(.+)/);
							if (matchTitle == null) {
								out[line.trim()] = {};
								lastLineConfig = line.trim();
							} else {
								if (lastLineConfig != null) {
									let {1:lineTitle, 2:lineValue} = matchTitle;
									out[lastLineConfig][lineTitle.trim()] = lineValue.trim();
								}
							}
						}
					});

					resolve(out);
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