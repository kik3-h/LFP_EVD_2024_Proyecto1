const readline = require('readline'); //importa la libreria readline para leer la entrada de datos por consola  
const fs = require('fs'); //importa la libreria fs para leer y escribir archivos 
const AFD = require('./classes/AFD'); //importa la clase AFD para analizar los tokens y errores 
const Processor = require('./classes/Processor');

const rl = readline.createInterface({ //crea una interfaz de lectura y escritura 
    input: process.stdin,
    output: process.stdout
});

const afd = new AFD();  //crea un objeto de la clase AFD
const path = require('path'); //importa la libreria path para manejar rutas de archivos
const processor = new Processor(); //
/*const chalk = require('chalk').default;
const BLUE = chalk.blueBright;
const RED = chalk.redBright;
const GREEN = chalk.greenBright;
const YELLOW = chalk.yellowBright;
const RESET = chalk.reset;*/

function showMenu() { //funcion para mostrar el menu
    console.log('=========================================================================');
    console.log('       \n* * * * * * * * Menú * * * * * * * *');
    console.log('       1. Abrir archivo JSON');
    console.log('       2. Analizar texto léxicamente');
    console.log('       3. Mostrar errores');
    console.log('       4. Generar reporte');
    console.log('       5. Procesar archivo JSON');
    console.log('       0. Salir');
    console.log('=========================================================================');
    rl.question('Seleccione una opción: ', handleOption); //pregunta al usuario que opcion desea seleccionar  
}

function handleOption(option) { //funcion para manejar las opciones del menu 
    switch (option) { 
        case '1':
            rl.question('Ingrese la ruta del archivo JSON: ', (relativePath) => { //pregunta al usuario la ruta del archivo JSON
                openFile(relativePath); //abre el archivo 
                showMenu(); //muestra el menu
            });
        break;

        case '2': // Analizar texto léxico
            rl.question('Ingrese el texto a analizar: ', (text) => {
                afd.analyze(text);
                console.log('\nAnálisis completado.');
                showMenu();
            });
        break;

        case '3':
            console.log('\nErrores detectados:'); //muestra los errores detectados 
            afd.getErrors().forEach((err, index) => { //por cada error muestra el valor, descripcion, linea y columna 
                console.log(`${index + 1}. ${err.value} - ${err.description} (Línea: ${err.line}, Columna: ${err.column})`); //muestra el error      
            });
            showMenu();
        break;

        case '4':
            generateReports(); //genera los reportes 
            console.log('\nReporte generado en la carpeta "reports".'); 
            showMenu();
        break;

        case '5': // Procesar archivo JSON
            rl.question('Ingrese la ruta del archivo JSON: ', (relativePath) => { //pregunta al usuario la ruta del archivo JSON 
                const content = openFile(relativePath); //abre el archivo
                if (content) {
                    processor.processOperations(content); //procesa las operaciones
                    console.log('\nOperaciones procesadas.');
                }
                showMenu();
            });
        break;

        case '6': // Generar gráfico de operaciones
            rl.question('Ingrese la ruta del archivo DOT: ', (dotPath) => {
                const imageOutputPath = './reports/graph.png';
                processor.generateGraphImage(dotPath, imageOutputPath);
                console.log(`Gráfico generado en ${imageOutputPath}`);
                showMenu();
            });
        break;

        case '0':
            console.log('Cerrando la aplicación...');
            rl.close();
            break;

        default:
            console.log('${RED}############################${RESET}');
            console.log('OPCION NO VALIDA NMMS.');
            console.log('${RED}############################${RESET}');
            showMenu();
    }
}

function openFile(relativePath) { // funcion para abrir el archivo JSON  
    try {
        const absolutePath = path.resolve(relativePath); // Convertir a ruta absoluta 
        const content = fs.readFileSync(absolutePath, 'utf-8'); // Leer el archivo 
        console.log('\nArchivo cargado exitosamente.');
        return content;
    } catch (err) {
        console.log(`\nError al abrir el archivo: ${err.message}`);
        return null;
    }
}

function ensureReportsFolder() {
    const reportsPath = path.resolve('./reports');
    if (!fs.existsSync(reportsPath)) { //si la carpeta reports no existe la crea
        console.log('Creando carpeta "reports"...');    
        fs.mkdirSync(reportsPath); //crea la carpeta reports
    }else{
        console.log('La carpeta "reports" ya existe.'); 
    }
}

function generateReports() { //funcion para generar los reportes 
    ensureReportsFolder(); // Me aseguro de que la carpeta exista
    const tokens = afd.getTokens();
    const errors = afd.getErrors();
    const results = processor.getResults();

    // Generar tabla de tokens
    const tokensHtml = `
        <html>
        <head><title>Reporte de Tokens</title></head>
        <body>
        <h1>Tabla de Tokens</h1>
        <table border="1">
            <tr><th>#</th><th>Tipo</th><th>Valor</th><th>Línea</th><th>Columna</th></tr>
            ${tokens.map((t, i) => `<tr><td>${i + 1}</td><td>${t.type}</td><td>${t.value}</td><td>${t.line}</td><td>${t.column}</td></tr>`).join('')} //por cada token muestra el indice, tipo, valor, linea y columna
        </table>
        </body>
        </html>
    `;
    fs.writeFileSync('./reports/tokens.html', tokensHtml); //escribe el archivo tokens.html

    // Generar tabla de errores
    const errorsHtml = `
        <html>
        <head><title>Reporte de Errores</title></head>
        <body>
        <h1>Tabla de Errores</h1>
        <table border="1">
            <tr><th>#</th><th>Valor</th><th>Descripción</th><th>Línea</th><th>Columna</th></tr>
            ${errors.map((e, i) => `<tr><td>${i + 1}</td><td>${e.value}</td><td>${e.description}</td><td>${e.line}</td><td>${e.column}</td></tr>`).join('')} //por cada error muestra el indice, valor, descripcion, linea y columna
        </table>
        </body>
        </html>
    `;
    fs.writeFileSync('./reports/errors.html', errorsHtml); //escribe el archivo errors.html

    // Generar tabla de resultados
    const resultsHtml = `
        <html>
        <head><title>Reporte de Resultados</title></head>
        <body>
        <h1>Resultados de las Operaciones</h1>
        <table border="1">
            <tr><th>#</th><th>Operación</th><th>Resultado</th></tr>
            ${results.map((res, i) => ` //por cada resultado muestra el indice, operacion y resultado
                <tr>
                    <td>${i + 1}</td>
                    <td>${JSON.stringify(res.operation)}</td> //muestra la operacion
                    <td>${res.result}</td>
                </tr>`).join('')}
        </table>
        <h2>Gráfico Generado</h2>
        <img src="./graph.png" alt="Gráfico de operaciones" />
        </body>
        </html>
    `;
    fs.writeFileSync('./reports/results.html', resultsHtml); //escribe el archivo results.html

    // Generar archivo JSON de errores
    fs.writeFileSync('./reports/errors.json', JSON.stringify(errors, null, 2)); //escribe el archivo errors.json
    console.log('Reportes generados en la carpeta "reports".');
}

function processFile(path) { //funcion para procesar el archivo JSON
    try {
        const content = fs.readFileSync(path, 'utf-8'); //lee el archivo
        processor.processOperations(content); //procesa las operaciones
        const results = processor.getResults(); //obtiene los resultados
        const errors = processor.getErrors(); //obtiene los errores

        console.log('\nResultados:');   
        results.forEach((res, index) => { //por cada resultado muestra el indice y el resultado
            console.log(`${index + 1}. Resultado: ${res.result}`); //muestra el resultado de la operacion
        });

        if (errors.length > 0) {
            console.log('\nErrores encontrados:');
            errors.forEach((err, index) => { //por cada error muestra la descripcion
                console.log(`${index + 1}. ${err.description}`); //muestra la descripcion del error
            });
        }

        // Generar gráfico DOT
        const dotPath = './reports/operations.dot';
        processor.generateGraph(results, dotPath); //genera el grafo de las operaciones
    } catch (err) {
        console.error('Error al procesar el archivo:', err.message);
    }
}

showMenu();