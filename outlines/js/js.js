/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Stefan Schulz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global define, brackets, Worker */
define(function (require, exports, modul) {
    "use strict";
	var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
		prefs = require('../../preferences'),
		outliner,
		JsWorker,
		$root,
		callBack;

	exports.init = function (outLiner, $ele) {
		var modulePath = ExtensionUtils.getModulePath(modul);

		$root = $ele;
		outliner = outLiner;

		var path = "jsScopeWorker.js"
		if (prefs.get('outline/js/experimentalParser') ){
			path = 'jsWorker.js';
		}
		JsWorker = new Worker(modulePath + path);
		JsWorker.onmessage = function (e) {
			if (e.data.type === 'log') {
				console.log(e.data.value[0], e.data.value[1]);
			} else if (e.data.type === 'data') {
				console.log('dataCallBack', e.data)
				callBack(e.data);
			}
		};
		JsWorker.addEventListener('error', function(e) {
			console.log('outline worker error: ' + e.message);
		}, false);
	};
	exports.update = function (code, cb) {
		callBack = cb;
		JsWorker.postMessage(code);
		//dataTree = updateHtml(html, 'text/x-brackets-html');
		//render(dataTree);
	};
});
