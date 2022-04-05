import http from 'http';
import express from 'express';
import path from 'path';
import {Server} from 'socket.io';
import LuckyNumbersGame from './luckyNumbersGame'

const port : number = Number(process.env.PORT) || 3001;

class App{
    private server: http.Server;
    private port: number;

    private io: Server
    private game: LuckyNumbersGame

    constructor(port: number){
        this.port = port;

        const app = express();
        app.use(express.static(path.join(__dirname, '../client')));
    
        this.server = new http.Server(app);
        this.io = new Server(this.server);

        this.game = new LuckyNumbersGame()
        


        this.io.on('connection', (socket) => {
            console.log('New user connected ', socket.id);
            socket.emit('message', 'Welcome to the chat' + socket.id);

            this.game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 10)

            socket.emit(
                'message',
                'Hello ' +
                    socket.id +
                    ', your lucky number is ' +
                    this.game.LuckyNumbers[socket.id]
            )

            socket.broadcast.emit('message', "Everyone say hello to me" + socket.id);

            socket.on('message', function (message: any) {
                console.log(message)
            })

            socket.on('disconnect', () => {
                console.log('User disconnected ', socket.id);
            });
        })

       
        setInterval(() => {
            let randomNumber: number = Math.floor(Math.random() * 10)
            let winners: string[] = this.game.GetWinners(randomNumber)
            if (winners.length) {
                winners.forEach((w) => {
                    this.io.to(w).emit('message', '*** You are the winner ***')
                })
            }
            this.io.emit('random', randomNumber)
        }, 1000)
        


    }

    public start(){
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

new App(port).start();