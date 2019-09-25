# MMM-domoticz
Domoticz module for <a href="https://magicmirror.builders/">MagicMirror2</a>.

![alt tag](https://github.com/flopp999/MMM-domoticz/blob/master/mmm-domoticz.png)

# Installation
enter ##magicmirror-folder##/modules and type "git clone https://github.com/flopp999/MMM-domoticz.git"

# config.js
In config.js, add the following lines and change it to match your setup and sensors.

		{
			module: 'MMM-domoticz', //folder
			header: 'Domoticz',
			position: 'top_left',
			config: {
				apiBase: "http://127.0.0.1", //Domoticz IP
				apiPort: "8080", //Port
				sensors: [
					{
						idx: "65", //Device IDX
						symbolon: "fa fa-user", //font-awesome icon if device is On
						symboloff: "fa fa-user-o", //font-awesome icon if device is Off (this will also be used if it is a temperature-de
						hiddenon: true, //true = hide if device is on (default: false)
						hiddenoff: false, //frue = hide if device is off (default: false)
						customTitle: "Bedroom lamp",
          				},
					{
						idx: "539",
						symbolon: "fa fa-circle-o-notch fa-spin",
						symboloff: "fa fa-circle-o-notch",
					},
					{
						idx: "539",
						symbolon: "fa fa-circle-o-notch fa-spin",
						symboloff: "fa fa-circle-o-notch",
						hiddenoff: false,
					},
					{
						idx: "88",
						symbolon: "fa fa-tachometer",
						symboloff: "fa fa-tachometer",
					},
				],
			}
		},
