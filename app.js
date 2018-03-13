// Requires
var express = require('express');



// Inicialización variables
var app = express();




// Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})