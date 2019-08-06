var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// DOM Binding
function dom(id) {
    var element = document.getElementById(id);
    if (!element) {
        throw new Error("Unable to bind DOM element: " + id);
    }
    return element;
}
function showIf(condition, ifTrue, ifFalse) {
    ifTrue.style.display = condition ? "inherit" : "none";
    if (ifFalse) {
        ifFalse.style.display = condition ? "none" : "inherit";
    }
}
var loginForm = dom("loginForm");
var chatDiv = dom("chatDiv");
var errorDiv = dom("errorDiv");
var logoutButton = dom("logoutButton");
var connectingDiv = dom("connectingDiv");
var connectedDiv = dom("connectedDiv");
var messageForm = dom("messageForm");
var messageInput = dom("messageInput");
var messageList = dom("messageList");
var directMessageForm = dom("directMessageForm");
var directMessageInput = dom("directMessageInput");
var toUserInput = dom("toUserInput");
var ViewModel = /** @class */ (function () {
    function ViewModel() {
    }
    ViewModel.prototype.loginFormSubmitted = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, resp, json, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 6]);
                        evt.preventDefault();
                        formData = new FormData(loginForm);
                        return [4 /*yield*/, fetch("/account/token", { method: "POST", body: formData })];
                    case 1:
                        resp = _a.sent();
                        if (resp.status !== 200) {
                            this.error = "HTTP " + resp.status + " error from server";
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, resp.json()];
                    case 2:
                        json = _a.sent();
                        if (json["error"]) {
                            this.error = "Login error: " + json["error"];
                            return [2 /*return*/];
                        }
                        else {
                            this.loginToken = json["token"];
                        }
                        // Update rendering while we connect
                        this.render();
                        // Connect, using the token we got.
                        this.connection = new signalR.HubConnectionBuilder()
                            .withUrl("/hubs/chat", { accessTokenFactory: function () { return _this.loginToken; } })
                            .build();
                        this.connection.on("ReceiveSystemMessage", function (message) { return _this.receiveMessage(message, "green"); });
                        this.connection.on("ReceiveDirectMessage", function (message) { return _this.receiveMessage(message, "blue"); });
                        this.connection.on("ReceiveChatMessage", function (message) { return _this.receiveMessage(message); });
                        return [4 /*yield*/, this.connection.start()];
                    case 3:
                        _a.sent();
                        this.connectionStarted = true;
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        this.error = "Error connecting: " + e_1;
                        return [3 /*break*/, 6];
                    case 5:
                        // Update rendering with any final state.
                        this.render();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ViewModel.prototype.directMessageFormSubmitted = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        evt.preventDefault();
                        return [4 /*yield*/, this.connection.send("SendToUser", toUserInput.value, directMessageInput.value)];
                    case 1:
                        _a.sent();
                        directMessageInput.value = "";
                        return [3 /*break*/, 4];
                    case 2:
                        e_2 = _a.sent();
                        this.error = "Error sending: " + e_2.toString();
                        return [3 /*break*/, 4];
                    case 3:
                        this.render();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ViewModel.prototype.messageFormSubmitted = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        evt.preventDefault();
                        return [4 /*yield*/, this.connection.invoke("Send", messageInput.value)];
                    case 1:
                        _a.sent();
                        messageInput.value = "";
                        return [3 /*break*/, 4];
                    case 2:
                        e_3 = _a.sent();
                        this.error = "Error sending: " + e_3.toString();
                        return [3 /*break*/, 4];
                    case 3:
                        this.render();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ViewModel.prototype.receiveMessage = function (message, color) {
        var li = document.createElement("li");
        if (color) {
            li.style.color = color;
        }
        li.textContent = message;
        messageList.appendChild(li);
    };
    ViewModel.prototype.logoutButtonClicked = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        evt.preventDefault();
                        if (!this.connection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connection.stop()];
                    case 1:
                        _a.sent();
                        this.connection = null;
                        _a.label = 2;
                    case 2:
                        // Just clear the token and re-render
                        this.loginToken = null;
                        this.render();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Update the state of DOM elements based on the view model
    ViewModel.prototype.render = function () {
        errorDiv.textContent = this.error;
        showIf(this.error, errorDiv);
        showIf(this.loginToken, chatDiv, loginForm);
        showIf(this.connectionStarted, connectedDiv, connectingDiv);
    };
    ViewModel.run = function () {
        var model = new ViewModel();
        // Bind events
        loginForm.addEventListener("submit", function (e) { return model.loginFormSubmitted(e); });
        logoutButton.addEventListener("click", function (e) { return model.logoutButtonClicked(e); });
        messageForm.addEventListener("submit", function (e) { return model.messageFormSubmitted(e); });
        directMessageForm.addEventListener("submit", function (e) { return model.directMessageFormSubmitted(e); });
    };
    return ViewModel;
}());
ViewModel.run();
//# sourceMappingURL=chat.js.map