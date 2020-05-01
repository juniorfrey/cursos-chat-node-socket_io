const socket = io();
        
// respuestas del servidor
socket.on('usuario_conectado',(datos)=>{
    $("#user_log").text(datos.user + ' dice:');
})

socket.on('new_message',(datos)=>{
    $("#ctn_mensajes").append('<p class="text-description"><strong id="user_log">'+datos.user+'</strong><br>'+datos.mensaje+'</p>')
});

socket.on('new_message2',(datos)=>{
    $("#ctn_mensajes").append('<p class="text-description"><strong>'+datos.user+'</strong><br>'+datos.mensaje+'</p>')
})

function loguear(){
    var user = $('#txt_user').val();
    var pass = $('#txt_pass').val();
    socket.emit('Datos_usuario',{correo:user,username:pass});
}

function enviar_mensaje(){
    var mensaje = $("#txt_mensaje").val();
    var user = $('#txt_user').val();
    var destino = $("#txt_destino").val();
    
    if(destino === ""){
        socket.emit('mensaje',{mensaje:mensaje,user:user});
    }else{
        socket.emit('mensaje_destinatario',{mensaje:mensaje,user:user, destinatario:destino});
    }
    $("#txt_mensaje").val('');
    $("#txt_destino").val('');
    $("#txt_mensaje").focus();
}