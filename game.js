/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ (() => {

eval("\n\nlet DEBUG = true;\nlet canvas;\nlet context;\nlet cW;\nlet cH;\n\nlet dragging = false;\n\nfunction mMove(e) {\n    if (dragging) {\n        point.pX = e.offsetX * cW / canvas.clientWidth | 0;\n        point.pY = e.offsetY * cH / canvas.clientHeight | 0;\n    };\n}\n\nfunction mDown(e) {\n    dragging = true;\n}\n\nfunction mUp(e) {\n    dragging = false;\n}\n\nfunction clearContext() {\n    context.fillStyle = '#b27e56';\n    context.fillRect(0, 0, cW, cH);\n}\n\n// Init\nwindow.onload = function() {\n    canvas = document.getElementById('game');\n    context = canvas.getContext('2d');\n    cW = canvas.width;\n    cH = canvas.height;\n\n    window.requestAnimationFrame(gameLoop);\n};\n\n// GameLoop\nfunction gameLoop(timeStamp) {\n    update();\n    draw();\n\n    window.requestAnimationFrame(gameLoop);\n}\n\nfunction update() {\n\n}\n\nfunction draw() {\n    clearContext();\n}\n\n\n//# sourceURL=webpack://quizEngine/./src/js/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/index.js"]();
/******/ 	
/******/ })()
;