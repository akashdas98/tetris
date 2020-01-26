/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const board = document.querySelector('canvas');\nconst boardCtx = board.getContext('2d');\nconst scale = 30;\n\nboard.height = 20 * scale;\nboard.width = 10 * scale;\n\n/*for(let i = scale; i < board.width; i += scale) {\n    boardCtx.strokeStyle = 'red';\n    boardCtx.beginPath();\n    boardCtx.moveTo(i, 0);\n    boardCtx.lineTo(i, board.height);\n    boardCtx.stroke();\n}*/\n\nfunction createPiece(updateMatrix) {\n    let pivot;\n    let matrix;\n    function setPivot(x, y) {\n        pivot = {x, y};\n        matrix = updateMatrix(pivot);\n    }\n    function draw() {\n        boardCtx.fillStyle = '#ffffff';\n        matrix.forEach(Tile => {\n            boardCtx.fillRect(Tile.x * scale, Tile.y * scale, scale, scale);\n        });\n    }\n    return {draw, setPivot};\n};\n\nfunction createTPiece(x, y) {\n    function updateMatrix(pivot) {\n        return [\n            {x: pivot.x, y: pivot.y - 1},\n            {x: pivot.x - 1, y: pivot.y},\n            {x: pivot.x, y: pivot.y},\n            {x: pivot.x + 1, y: pivot.y},\n        ];\n    }\n    const TPiece = createPiece(updateMatrix);\n    TPiece.setPivot(x, y);\n    return TPiece;\n}\n\nfunction createIPiece(x, y) {\n    function updateMatrix(pivot) {\n        return [\n            {x: pivot.x - 1.5, y: pivot.y + 0.5},\n            {x: pivot.x - 0.5, y: pivot.y + 0.5},\n            {x: pivot.x + 0.5, y: pivot.y + 0.5},\n            {x: pivot.x + 1.5, y: pivot.y + 0.5},\n        ];\n    }\n    const IPiece = createPiece(updateMatrix);\n    IPiece.setPivot(x, y);\n    return IPiece;\n}\n\nconst I = createIPiece(1.5, -0.5);\nI.draw();\nI.setPivot(2.5, 2.5);\nI.draw();\n\nconst T = createTPiece(5, 8);\nT.draw();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });