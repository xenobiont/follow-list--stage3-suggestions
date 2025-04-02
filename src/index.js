import {
	mergeMap,
	fromEvent,
	startWith,
	map,
	mergeWith,
	shareReplay,
	tap,
} from 'rxjs';

// UTILITY FUNCTIONS

function getRandomUser(usersList) {
	return usersList[Math.floor(Math.random() * usersList.length)];
}

function getRandomOffset() {
	return Math.floor(Math.random() * 500);
}

function renderSuggestion(suggestedUser, selector) {
	const suggestion_el = document.querySelector(selector);

	if (suggestedUser === null) {
		suggestion_el.style.visibility = 'hidden';
	} else {
		suggestion_el.style.visibility = 'visible';

		const username_el = suggestion_el.querySelector('.username');
		username_el.href = suggestedUser.html_url;
		username_el.textContent = suggestedUser.login;

		const img_el = suggestion_el.querySelector('img');
		img_el.src = suggestedUser.avatar_url;
	}
}


 // YOUR CODE HERE
