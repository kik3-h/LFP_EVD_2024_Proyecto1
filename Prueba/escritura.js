// Importamos fs
const fs = require('fs');

// Abrimos el archivo y lo leemos utilizando readFile
fs.readFile('archivo.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo: ', err);
        return;
    }
    console.log(data);
    console.log('Archivo leido correctamente');

    let contenido = data;
    contenido += '\nLFP - 2024';

    // Escribimos el contenido del archivo en otro archivo
    fs.writeFile('archivo3.txt', contenido, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Archivo creado');
    });
});