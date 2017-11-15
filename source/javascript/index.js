import {h, render} from 'preact';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

import 'css/style';

const interopDefault = m => m && m.default || m;
let app = interopDefault(require('./app'));

if (typeof app === 'function') {
	let root = document.body.firstElementChild;

	let init = () => {
		let app = interopDefault(require('./app'));
		root = render(h(app), document.body, root);
	};

	if (module.hot) {
		module.hot.accept('./app', init);
		require('preact/debug');
	}

	init();
}

if (PRODUCTION) {
	window.addEventListener('load', () => {
		if (navigator.serviceWorker) {
			const registration = runtime.register();
		}
	});
}
