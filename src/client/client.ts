interface User{
    name: string;
    age: number;
}

class Client {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io()
        this.socket.on('connect', function () {
            console.log('connect')
            document.body.innerHTML = ''
        })

        this.socket.on('disconnect', function (message: any) {
            console.log('disconnect ' + message)
            document.body.innerHTML +=
                'Disconnected from Server : ' + message + '<br/>'
            //location.reload();
        })
        this.socket.on('message', (message: any) => {
            console.log(message)
            document.body.innerHTML += message + '<br/>'
            this.socket.emit('message', 'Thanks for having me')
        })

        this.socket.on('random', function (message: any) {
            console.log(message)
            document.body.innerHTML += message + '<br/>'
        })
    }
}

const client = new Client()