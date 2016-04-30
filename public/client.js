/* eslint-env browser */
const request = new XMLHttpRequest();
const userInput = document.getElementById('user');
let loader;

userInput.onkeyup = function (event) {
	if (event.keyCode === 13) {
		getTimeFromInputUser();
	}
};

document.getElementById('get-time-button').onclick = getTimeFromInputUser;

window.onpopstate = init;

init();

function init() {
	const user = document.location.pathname.substr(1);
	if (!user) {
		// Todo
		return;
	}

	getTime(user);
}

function getTimeFromInputUser() {
	const user = userInput.value.trim();
	if (!user) {
		return;
	}

	history.pushState({}, '', user);
	getTime(user);
}

function getTime(user) {
	request.abort();
	request.open('POST', '/');
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	request.send(JSON.stringify({
		user
	}));

	if (loader) {
		loader.remove();
	}
	loader = document.createElement('img');
	loader.id = 'loader';
	loader.className = 'loader';
	loader.alt = 'loader';
	loader.src = 'loader.gif';
	document.body.appendChild(loader);

	let avatar = document.getElementById('avatar');
	if (!avatar) {
		avatar = document.createElement('img');
		avatar.id = 'avatar';
		avatar.alt = 'Avatar';
		document.body.appendChild(avatar);
	}

	avatar.src = 'loader.gif';
	setTimeout(() => {
		avatar.src = 'https://github.com/' + user + '.png?size=40';
	});
}

request.onload = function () {
	if (request.status >= 200 && request.status < 400) {
		// Success!
		const data = JSON.parse(request.responseText);

		const time = data.time;
		const timeSpan = document.getElementById('time');
		if (time) {
			timeSpan.innerHTML = time;
		} else {
			timeSpan.innerHTML = '';
		}

		const error = data.error;
		const errorSpan = document.getElementById('error');
		if (error) {
			errorSpan.innerHTML = error;
		} else {
			errorSpan.innerHTML = '';
		}

		document.getElementsByTagName('body')[0].className = 'time-' + data.hours;
		loader.remove();
	} else {
		// We reached our target server, but it returned an error

	}
};
