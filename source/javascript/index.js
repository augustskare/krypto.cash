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

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'UA-109745092-1', 'auto');
		ga('send', 'pageview');
	});
}
