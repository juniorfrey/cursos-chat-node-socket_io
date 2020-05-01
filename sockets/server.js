const express = require('express');
const app = express();

const http = require('http');

/* configuraciòn del servidor */
const server = http.createServer(app);
server.listen(3000, ()=>{
    console.log("Corriendo en el puerto 3000");
});

app.use(express.static('public'));

/* Sockets  */
const socketIio = require('socket.io');
const io = socketIio.listen(server);

// inicializamos los array
UserOnId = Array();
IdsOnUser = Array();

io.on('connection',(socket)=>{
    console.log('Usuario conectado con id: ' + socket.id);

    /* Emits */
    socket.on('Datos_usuario',(datos)=>{

        /* ingresamos el valor en el objeto UserOnId */
        UserOnId[socket.id] = datos.correo;
        /* Validamos si ya existe el objeto con el usuario creado */
        if(IdsOnUser[datos.correo] == null){
            /*Ingresamos valores en el objeto IdsOnUser */
            IdsOnUser[datos.correo] = new Array();
        }
        IdsOnUser[datos.correo].push(socket.id);

        console.log('Cantidad de usuarios en linea');
        console.log(Object.keys(IdsOnUser).length);

        // emit al enciado desde el servidor hacia el cliente
        io.emit('usuario_conectado',{user:datos.correo});
     });

     /* emit de mensajes del chat */
     socket.on('mensaje',(data)=>{
        io.emit('new_message',{mensaje:data.mensaje, user:data.user});
     });

     socket.on('mensaje_destinatario',(data)=>{
        destinatario = data.destinatario;
        id_online = IdsOnUser[destinatario];
        for (var j = 0; j < id_online.length; j++) {
            io.to(id_online[j]).emit('new_message2',{mensaje:data.mensaje, user:data.user});
        }
        io.to(socket.id).emit('new_message2',{mensaje:data.mensaje, user:data.user});
     });

     socket.on('disconnect',()=>{
         id_user = socket.id;

         if(UserOnId[id_user]){

            // atrapamos el usuario a desconectar
            usuario = UserOnId[id_user];
            // Borramos el usuario que ya no necesitamos
            delete UserOnId[id_user];
            // ahora atrapamos todos los ids de un usuario en una variable
            array_ids = IdsOnUser[usuario];

            for (let i = 0; i < array_ids.length; i++) {
                if (id_user == array_ids[i]) {
                    id_to_user = i;
                }
            }
            IdsOnUser[usuario].splice(id_to_user,1);
            // condicionamos para borrar los elementos del array
            if (IdsOnUser[usuario].length < 1) {
                delete IdsOnUser[usuario];
            }

            console.log('Cantidad de usuarios en linea');
            console.log(Object.keys(IdsOnUser).length);
        }
     })
})