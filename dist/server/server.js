"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const luckyNumbersGame_1 = __importDefault(require("./luckyNumbersGame"));
const port = Number(process.env.PORT) || 3001;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.Server(this.server);
        this.game = new luckyNumbersGame_1.default();
        this.io.on('connection', (socket) => {
            console.log('New user connected ', socket.id);
            socket.emit('message', 'Welcome to the chat' + socket.id);
            this.game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 10);
            socket.emit('message', 'Hello ' +
                socket.id +
                ', your lucky number is ' +
                this.game.LuckyNumbers[socket.id]);
            socket.broadcast.emit('message', "Everyone say hello to me" + socket.id);
            socket.on('message', function (message) {
                console.log(message);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected ', socket.id);
            });
        });
        setInterval(() => {
            let randomNumber = Math.floor(Math.random() * 10);
            let winners = this.game.GetWinners(randomNumber);
            if (winners.length) {
                winners.forEach((w) => {
                    this.io.to(w).emit('message', '*** You are the winner ***');
                });
            }
            this.io.emit('random', randomNumber);
        }, 1000);
    }
    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
new App(port).start();
//# sourceMappingURL=server.js.map