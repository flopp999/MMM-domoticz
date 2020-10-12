/* global Module */

/* Magic Mirror
 * Module: Domoticz
 *
 * By Mathias Arvidsson
 */

Module.register("MMM-domoticz",{

	defaults: {
		units: config.units,
		updateInterval: 5000,
		animationSpeed: 1000,
		timeFormat: config.timeFormat,
		lang: config.language,

		initialLoadDelay: 0,
		retryDelay: 2500,

		apiBase: "http://127.0.0.1",
		apiPort: "8080",
		sensors: [
			{
				idx: "1",
				symbolon: "fa fa-user",
				symboloff: "fa fa-user-o",
				hiddenon: false,
				hiddenoff: false,
				customTitle: "",
			},
		],
	},

	firstEvent: false,
	getStyles: function() {
	    return ['font-awesome.css'];
	},
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},



	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.loaded = false;
		this.status1 = false;
		this.title = "Loading...";
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.sensors = [];
		for (var c in this.config.sensors) {
			var sensor = this.config.sensors[c];
			var newSensor = {idx:sensor.idx, symbolon:sensor.symbolon, symboloff:sensor.symboloff, hiddenon:sensor.hiddenon, hiddenoff:sensor.hiddenoff, customTitle:sensor.customTitle, status:"", sname:"",type:""};
			console.log(sensor.idx);
			this.sensors.push(newSensor);
		}
console.log(this.sensors);
	},



	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Loading...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		var tableWrap = document.createElement("table");
		tableWrap.className = "small";

		for (var c in this.sensors) {
			var sensor = this.sensors[c];
			if((sensor.status=="Klar" && sensor.hiddenon)||(sensor.status=="Av" && sensor.hiddenoff)) continue;
			var sensorWrapper = document.createElement("tr");
			sensorWrapper.className = "normal";

			var symbolTD = document.createElement('td');
			symbolTD.className = "symbol";
			var symbol = document.createElement('i');
			var symbolClass = sensor.symboloff
			if(sensor.status=="On") symbolClass = sensor.symbolon
			symbol.className = symbolClass;
			symbolTD.appendChild(symbol);
			sensorWrapper.appendChild(symbolTD);

			var titleTD = document.createElement('td');
			titleTD.className = "title bright";
			if(sensor.status=="Off") titleTD.className = "title light";
			titleTD.innerHTML = sensor.sname;
			if(typeof sensor.customTitle !== 'undefined') titleTD.innerHTML = sensor.customTitle;
			sensorWrapper.appendChild(titleTD);

			var statusTD = document.createElement('td');
			statusTD.className = "time light";
			statusTD.innerHTML = sensor.status;
			sensorWrapper.appendChild(statusTD);

			tableWrap.appendChild(sensorWrapper);
		}
		wrapper.appendChild(tableWrap);
		return wrapper;
	},


	updateDomo: function() {
		var i = 0;
		for (var c in this.sensors) {
			console.log("this is c: " + c);
			var sensor = this.sensors[c];
			var url = this.config.apiBase + ":" + this.config.apiPort + "/json.htm?type=devices&rid="  + sensor.idx;
			var self = this;

			var domoRequest = new XMLHttpRequest();
			domoRequest.open("GET", url, true);
			domoRequest.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						self.processJson(JSON.parse(this.response));
						console.log("Loaded data");
					} else {
						Log.error(self.name + ": Could not load data.");
						console.log("Did not load data");
					}
				}
			};
			domoRequest.send();
			i++;
		}
	},

	processJson: function(data) {
		console.log("****Parsing data: " + c + " " + data.result[0].Name);
		if (!data) {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			return;
		}
		for (var c in this.sensors) {
			var sensor = this.sensors[c];
			if(sensor.idx == data.result[0].idx){
				this.sensors[c].sname = data.result[0].Name;
				this.sensors[c].status = data.result[0].Data;
				this.sensors[c].type = data.result[0].Type;
			}
		}
		
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	scheduleUpdate: function(delay) {
		console.log("Updating..");
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateDomo();
		}, nextLoad);
	}
});
