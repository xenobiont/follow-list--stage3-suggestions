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

const e_refreshButton = document.querySelector('.refresh');
const refreshClick$ = fromEvent(e_refreshButton, 'click');

const request$ = refreshClick$.pipe(
	// we use startWith to also trigger on page load;
	// no need to imitate a real event object, we just need some value (it will be remapped later in map operator anyway)
	startWith(null),
	// now we need to map each click to some url
	map(() => `https://api.github.com/users?since=${getRandomOffset()}`)
);

const response$ = request$.pipe(
	mergeMap((url) => fetch(url)),
	mergeMap((response) => response.json()),
	shareReplay(1)
);

/* stage 3
To implement independent renewal of suggestions, we need to: 
*/

const suggestionSelectorsByButtonsSelectors = {
	'.close1': '.suggestion1',
	'.close2': '.suggestion2',
	'.close3': '.suggestion3',
};

for (const [btnSel, suggestionSel] of Object.entries(
	suggestionSelectorsByButtonsSelectors
)) {
	const btnElement = document.querySelector(btnSel);

	fromEvent(btnElement, 'click')
		.pipe(
			startWith(null),
			mergeMap((_) => response$),
			map((usersList) => getRandomUser(usersList)),
			mergeWith(refreshClick$.pipe(map(() => null))), // mapTo
			/*
			we need 'mergeWith' refreshClick$ to immediately clear the list when 'refresh' button is pressed
			instead of waiting until request will be executed
			the difference is noticeable if we enable network throttling

			we also add corresponding check to renderSuggestion function to hide it
			if (suggestedUser === null)
			*/
			tap((suggestedUser) => renderSuggestion(suggestedUser, suggestionSel))
		)
		.subscribe();
}
