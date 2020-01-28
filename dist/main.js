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

eval("const board = document.querySelector('canvas');\nconst boardCtx = board.getContext('2d');\nconst scale = 30;\n\nboard.height = 20 * scale;\nboard.width = 10 * scale;\n\n/*for(let i = scale; i < board.width; i += scale) {\n    boardCtx.strokeStyle = 'red';\n    boardCtx.beginPath();\n    boardCtx.moveTo(i, 0);\n    boardCtx.lineTo(i, board.height);\n    boardCtx.stroke();\n}*/\n\nfunction matrixMultiply(a, b) {\n    let c = [\n        a[0][0] * b[0] + a[0][1] * b[1],\n        a[1][0] * b[0] + a[1][1] * b[1]\n    ]\n    return c;\n}\n\nfunction createPiece(matrix, pivot, id, color) {\n    let orientation = 0;\n    function setPivot(x, y) {\n        pivot = [x, y];\n    }\n    function getPivot() {\n        return pivot;\n    }\n    function getMatrix() {\n        return matrix;\n    }\n    function getColor() {\n        return color;\n    }\n    function getOrientation() {\n        return orientation;\n    }\n    function draw() {\n        boardCtx.fillStyle = color;\n        boardCtx.strokeStyle = '#000000';\n        matrix.forEach(tile => {\n            boardCtx.globalAlpha = 1;\n            boardCtx.fillRect((tile[0] + pivot[0]) * scale, (tile[1] + pivot[1])* scale, scale, scale);\n            boardCtx.globalAlpha = 0.5;\n            boardCtx.strokeRect((tile[0] + pivot[0]) * scale, (tile[1] + pivot[1])* scale, scale, scale);\n        });\n    }\n    function rotate(dir) {\n        if(id == 'O') return;\n        let rotation;\n        if(dir == 0) {\n            rotation = [\n                [0, 1],\n                [-1, 0]\n            ];\n            orientation = orientation == 0? 3 : orientation - 1;\n        } else {\n            rotation = [\n                [0, -1],\n                [1, 0]\n            ];\n            orientation = (orientation + 1) % 4;\n        }\n        matrix = matrix.map(tile => {\n            return matrixMultiply(rotation, tile);\n        });\n    }\n    return {\n        draw, \n        setPivot, \n        getPivot, \n        getMatrix, \n        rotate, \n        getColor,\n    };\n}\n\nfunction createTPiece(x, y) {\n    const id = 'T';\n    const color = '#ff00ff';\n    let matrix = [\n        [0, - 1],\n        [- 1, 0],\n        [0, 0],\n        [1, 0],\n    ];\n    const TPiece = createPiece(matrix, [x, y], id, color);\n    return TPiece;\n}\n\nfunction createIPiece(x, y) {\n    const id = 'I';\n    const color = '#00ffff';\n    let matrix = [\n        [- 1.5, 0.5],\n        [- 0.5, 0.5],\n        [0.5, 0.5],\n        [1.5, 0.5],\n    ];\n    const IPiece = createPiece(matrix, [x, y], id, color);\n    return IPiece;\n}\n\nfunction createJPiece(x, y) {\n    const id = 'J';\n    const color = '#0000ff';\n    let matrix = [\n        [- 1, 0],\n        [0, 0],\n        [1, 0],\n        [-1, -1],\n    ];\n    const JPiece = createPiece(matrix, [x, y], id, color);\n    return JPiece;\n}\n\nfunction createLPiece(x, y) {\n    const id = 'L';\n    const color = '#ff7f00';\n    let matrix = [\n        [-1, 0],\n        [0, 0],\n        [1, 0],\n        [1, -1],\n    ];\n    const LPiece = createPiece(matrix, [x, y], id, color);\n    return LPiece;\n}\n\nfunction createSPiece(x, y) {\n    const id = 'S';\n    const color = '#00ff00';\n    let matrix = [\n        [-1, 0],\n        [0, 0],\n        [0, -1],\n        [1, -1],\n    ];\n    const SPiece = createPiece(matrix, [x, y], id, color);\n    return SPiece;\n}\n\nfunction createOPiece(x, y) {\n    const id = 'O';\n    const color = '#ffff00';\n    let matrix = [\n        [-1, 0],\n        [0, 0],\n        [-1, -1],\n        [0, -1],\n    ];\n    const OPiece = createPiece(matrix, [x, y], id, color);\n    return OPiece;\n}\n\nfunction createZPiece(x, y) {\n    const id = 'Z';\n    const color = '#ff0000';\n    let matrix = [\n        [-1, -1],\n        [0, 0],\n        [0, -1],\n        [1, 0],\n    ];\n    const ZPiece = createPiece(matrix, [x, y], id, color);\n    return ZPiece;\n}\n\nfunction createNewGame() {\n    let history = 99;\n    let currentPiece;\n    let nextPiece = generateRandomPiece();\n    \n    function randomizer() {\n        let random = Math.floor(Math.random() * 7);\n        if(random === history) {\n            random = Math.floor(Math.random() * 7);\n        }\n        history = random;\n        return random;\n    }\n    \n    function generateRandomPiece() {\n        const random = randomizer();\n        let piece;\n        switch(random) {\n            case 0:\n                piece = createTPiece(5, 1);\n                //piece.draw();\n                break;\n            case 1:\n                piece = createIPiece(4.5, -0.5);\n                //piece.draw();\n                break;\n            case 2:\n                piece = createJPiece(5, 1);\n                //piece.draw();\n                break;\n            case 3:\n                piece = createLPiece(5, 1);\n                //piece.draw();\n                break;\n            case 4:\n                piece = createSPiece(5, 1);\n                //piece.draw();\n                break;\n            case 5:\n                piece = createOPiece(5, 1);\n                //piece.draw();\n                break;\n            case 6:\n                piece = createZPiece(5, 1);\n                //piece.draw();\n                break;    \n        }\n        return piece;\n    }\n\n    function spawn() {\n        currentPiece = nextPiece;\n        nextPiece = generateRandomPiece();\n        currentPiece.draw();\n    }\n\n    function drop() {\n        let interval = setInterval(() => {\n            currentPiece.getMatrix().forEach(tile => {\n                console.log(tile[1] + currentPiece.getPivot()[1]);\n                if(tile[1] + currentPiece.getPivot()[1] >= 18) {\n                    clearInterval(interval);\n                }\n            });\n            boardCtx.clearRect(0, 0, board.width, board.height);\n            currentPiece.setPivot(currentPiece.getPivot()[0], currentPiece.getPivot()[1] + 1)\n            currentPiece.draw();\n        }, 800);\n    }\n\n    return {\n        spawn,\n        drop,\n    };\n}\n\nlet game = createNewGame();\ngame.spawn();\ngame.drop();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });