'use strict';
const devTime = require('dev-time');
const moment = require('moment-timezone');
const bodyParser = require('body-parser');
const express = require('express');

function formatTime(time) {
	return moment.utc(time).utcOffset(time).format('HH:mm - D MMM. YYYY');
}

function getTimezoneHours(time) {
	return moment.utc(time).utcOffset(time).format('HH');
}

const app = express();

app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000, () => {
	console.log('Server running on 3000');
});

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/*', (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.post('/', (req, res) => {
	const user = req.body.user;

	if (!user) {
		res.status(404).send();
		return;
	}

	devTime(user)
		.then(data => {
			res.json({
				time: formatTime(data),
				hours: getTimezoneHours(data)
			});
		})
		.catch(err => {
			res.json({
				error: err.message
			});
		});
});
