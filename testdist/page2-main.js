var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function getDefaultExportFromCjs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function getDefaultExportFromNamespaceIfPresent(e){return e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function getDefaultExportFromNamespaceIfNotNamed(e){return e&&Object.prototype.hasOwnProperty.call(e,"default")&&1===Object.keys(e).length?e.default:e}function getAugmentedNamespace(e){if(e.__esModule)return e;var t=e.default;if("function"==typeof t){var r=function a(){if(this instanceof a){var e=[null],r;return e.push.apply(e,arguments),new(Function.bind.apply(t,e))}return t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(e).forEach((function(t){var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,n.get?n:{enumerable:!0,get:function(){return e[t]}})})),r}function reqworks(){return"It works!"}var t,r=getDefaultExportFromCjs({reqworks:reqworks});function add(e,t){return e+t}function minus(e,t){return e-t}var n,o=getDefaultExportFromCjs({add:add,minus:minus});function preloaded(){console.log("This is preloaded function!")}