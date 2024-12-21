const readline = require('readline');
const fs = require('fs');
const path = require('path');
const AFD = require('./classes/AFD');
const Processor = require('./classes/Processor');
const { exec } = require('child_process'); // Importar el módulo child_process para ejecutar comandos del sistema
const afd = new AFD();
const processor = new Processor();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});



function showMenu() {
    console.log('===================================================================');
    console.log('       ¡ MENU PRINCIPAL ! ');
    console.log('1. Abrir archivo JSON');
    console.log('2. Analizar el archivo');
    console.log('3. Mostrar errores');
    console.log('4. Generar reportes');
    console.log('0. Salir');
    console.log('===================================================================');
    console.log('                                                    by: kik3.h ');
    rl.question('Seleccione una opción: ', handleOption);
}

function handleOption(option) {
    switch (option) {
        case '1': // Abrir archivo JSON
            rl.question('Ingrese la ruta del archivo JSON: ', (relativePath) => {
                openFile(relativePath);
                showMenu();
            });
            break;
        case '2': // Analizar el archivo
            analyzeFile();
            showMenu();
            break;
        case '3': // Mostrar errores
            showErrors();
            showMenu();
            break;
        case '4': // Generar reportes
            generateReports();
            showMenu();
            break;
        case '0': // Salir
            console.log('Saliendo del programa...');
            rl.close();
            break;
        default:
            console.log('Opción no válida.');
            showMenu();
    }
}

let jsonData = null;

function openFile(relativePath) {
    try {
        const absolutePath = path.resolve(relativePath); // Obtener la ruta absoluta del archivo 
        const content = fs.readFileSync(absolutePath, 'utf-8'); // Leer el contenido del archivo
        jsonData = JSON.parse(content); // Convertir el contenido a un objeto JSON
        console.log('Archivo cargado exitosamente.');
    } catch (err) {
        console.log(`Error al abrir el archivo: ${err.message}`);
    }
}

function analyzeFile() {
    if (!jsonData) {
        console.log('Primero debe abrir un archivo JSON.');
        return;
    }
    const operations = JSON.stringify(jsonData.operaciones, null, 2); // Convertir las operaciones a una cadena JSON con formato
    console.log('Contenido del archivo analizado:', operations);

    // Análisis léxico del contenido
    afd.analyze(operations); 
   // const operations2 = jsonData.operaciones || [];
  //  processor.processOperations(operations2);
    console.log('Análisis léxico completado.');
}

function showErrors() {
    if (!jsonData) {
        console.log('Primero debe abrir un archivo JSON.');
        return;
    }else{
        console.log('Archivo JSON cargado exitosamente.');
    }

        // Convertir las operaciones a una cadena JSON con formato
        const operations = JSON.stringify(jsonData.operaciones, null, 2); // Convertir las operaciones a una cadena JSON con formato
        afd.analyze(operations);
        const operations2 = jsonData.operaciones || [];
        processor.processOperations(operations2);
        const errors = afd.getErrors();
        const errors2 = processor.getErrors();
        const contador1 = afd.getContadorErrores();
        const contador2 = processor.getContadorErrores();

            // Verificar si existen errores y mostrar el contador de los mismos
    if (errors.length > 0 || errors2.length > 0) {
            console.log('Se encontraron errores:');
            console.log('Errores léxicos: ', contador1);
            console.log('Errores sintácticos: ', contador2);

            // Mostrar y generar reporte de errores léxicos
        if (errors.length > 0) {
            console.log('Errores léxicos:');
            errors.forEach(err => console.log(err));
            generateErrorReport(errors, 'errorReportLexicos.html');
        }

        console.log('----------------------- ');

        // Mostrar y generar reporte de errores sintácticos
        if (errors2.length > 0) {
            console.log('Errores sintácticos:');
            errors2.forEach(err => console.log(err));
            generateErrorReport(errors2, 'errorReportSintacticos.html');
        }

        return;
    } else {
        console.log('No se encontraron errores.');
    }
}

//esto al elegir opcion 4
function generateReports() {
    if (!jsonData) {
        console.log('       Primero debe abrir un archivo JSON.');
        return;
    }else{
        console.log('       Archivo JSON cargado exitosamente.');
    }

    // Procesar operaciones
    const operations = jsonData.operaciones || [];
    processor.processOperations(operations);
    
    // Generar reportes
    const tokens = afd.getTokens();
    const afdErrors = afd.getErrors();
    const processorErrors = processor.getErrors();
    const results = processor.getResults();

     if (!results || results.length === 0) {
         console.log('No hay resultados para generar reportes.');
         return;
     }

    const reportsPath = './reports';
    if (!fs.existsSync(reportsPath)) { // Si la carpeta reports no existe
        fs.mkdirSync(reportsPath); // Crear la carpeta reports
    }

    // Generar tokens.html
    let tokensHtml = `
        <html>
        <head><title>Reporte de Tokens</title></head>
        <body>
        <h1>Tabla de Tokens</h1>
        <table border="1" style="width: 100%; text-align: center; background-color: #d4f1f4;">
            <tr><th>#</th><th>Tipo</th><th>Valor</th><th>Línea</th><th>Columna</th></tr>
            ${tokens.map((t, i) => `<tr><td>${i + 1}</td><td>${t.type}</td><td>${t.value}</td><td>${t.line}</td><td>${t.column}</td></tr>`).join('')}
        </table>
        </body>
        </html>`;
    fs.writeFileSync(`${reportsPath}/tokens.html`, tokensHtml);

    // Generar errors.html
    let errorsHtml = `
        <html>
        <head><title>Reporte de Errores</title></head>
        <body>
        <h1>Tablas de Errores</h1>
        <table border="1" style="width: 100%; text-align: center; background-color: #f8d7da;">
            <tr><th>#</th><th>Valor</th><th>Descripción</th><th>Línea</th><th>Columna</th></tr>
            ${afdErrors.map((e, i) => `<tr><td>${i + 1}</td><td>${e.value}</td><td>${e.description}</td><td>${e.line}</td><td>${e.column}</td></tr>`).join('')}
        </table>
        <table border="1" style="width: 100%; text-align: center; background-color: #f8d7da;">
            <tr><th>#</th><th>Valor</th><th>Descripción</th><th>Línea</th><th>Columna</th></tr>
            ${processorErrors.map((e, i) => `<tr><td>${i + 1}</td><td>${e.value || '-'}</td><td>${e.description}</td><td>${e.line || '-'}</td><td>${e.column || '-'}</td></tr>`).join('')}
        </table>
        </body>
        </html>`;
    fs.writeFileSync(`${reportsPath}/errors.html`, errorsHtml);

        // Generar archivo DOT con configuraciones
        const dotPath = `${reportsPath}/operations.dot`;
        const configurations = jsonData.configuraciones ? jsonData.configuraciones[0] : {};
        processor.generateGraph(results, dotPath, configurations);

        // Convertir DOT a PNG
        const imagePath = `${reportsPath}/graph.png`;
        exec(`dot -Tpng ${dotPath} -o ${imagePath}`, (error) => {
            if (error) {
                console.error('Error al generar la imagen:', error.message);
            } else {
                console.log(`Gráfico generado correctamente en: ${imagePath}`);
            }
        });

        // Generar results.html con gráfico
        const resultsHtml = `
            <html>
            <head><title>Reporte de Resultados</title></head>
            <body>
            <h1>Resultados de las Operaciones</h1>
            <table border="1" style="width: 100%; text-align: center; background-color: #e7f3fe;">
                <tr><th>No.</th><th>Operación</th><th>Resultado</th></tr>
                ${results.map((res, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${JSON.stringify(res.operation)}</td>
                        <td>${res.result}</td>
                    </tr>`).join('')}
            </table>
            <h2>Gráfico Generado</h2>
            <img src="./graph.png" alt="Gráfico de operaciones" />
            </body>
            </html>`;
        fs.writeFileSync(`${reportsPath}/results.html`, resultsHtml);

        console.log('Reportes generados exitosamente en la carpeta "reports".');
}

    // Función para generar el reporte de errores en HTML
    function generateErrorReport(errors, fileName) {
        let htmlContent = `
            <html>
            <head><title>Reporte de Errores</title></head>
            <body>
                <h1>Errores Detectados</h1>
                <table border="1">
                    <tr>
                        <th>Descripción</th>
                        <th>Valor</th>
                        <th>Línea</th>
                        <th>Columna</th>
                    </tr>
        `;

        errors.forEach(error => {
            htmlContent += `
                <tr>
                    <td>${error.description}</td>
                    <td>${error.value}</td>
                    <td>${error.line || '-'}</td>
                    <td>${error.column || '-'}</td>
                </tr>
            `;
        });

        htmlContent += `
                </table>
            </body>
            </html>
        `;

        fs.writeFileSync(`./${fileName}`, htmlContent);
    }
showMenu();