Universidad de San Carlos de Guatemala.

Facultad de Ingenieria en Ciencias y Sistemas.

Escuela de Vacaciones de Diciembre 2024

Lenguajes Formales y de Programación

Ingeniera Mariana Sic

Auxiliar Elder Pum

Estudiante: ENRIQUE ALEXANDEER TEBALAN HERNANDEZ    3160499720903

Carnet: 202230026

PROYECTO 1

Version:
Nombre: Analizador Lexico
Lenguaje: JavaScript
Visual Studio Code
Node js v22
Html

# Manual Técnico
---

### Estructura del proyecto
    project-folder/
├── src/
│   ├── classes/
│   │   ├── AFD.js
│   │   ├── Processor.js
│   │   ├── Error.js
│   └── menu.js
    ├── reports/
    │   ├── tokens.html
    │   ├── errors.html
    │   ├── results.html
    │   ├── operations.dot
    │   ├── graph.png
├── package.json
└── README.md
### Herramientas:
    Node.js: Para ejecutar el programa.

    Graphviz: Para compilar el archivo DOT y generar gráficos.

## Clases Utilizadas
### menu.js
    Esta clase es la que arranca el programa, ya que contiene el menu y se comunica con la mayoria de clases que existen.
### Tokens
    La clase token contiene todas las descripciones y caracaterisiticas que tendran una unidad lexica. 
### AFD
    La clase que contiene la logica del AUTOMATA FINITO DETERMINANTE, este hace uso de listas de objetos token y tambien crea una lista especial para errores, esto sirve para generar la tabla de simbolos de un lenguaje de entrada.
### lexema.js
    Analiza la lista de tokens para guardar los lexemas existente dentro de esa lista.

### Processor
    en esta clase se lleva a cabo los calculos matematicos de las operaciones del archivo a leer.

## Creación del Automata por medio de una Expresion Regular
    La creación del automata por meedio del método del árbol.

![Expresion Regular](/Imagenes/metodo.png "Método de Árbol")

## Automata Final
![Automata](/Imagenes/Automata.png "Automata")

## Codigo del Automata
```javaScript
PALABRAS_RESERVADAS = {
        '"operaciones"': "PALABRA_RESERVADA",
        '"operacion"': "PALABRA_RESERVADA",
        '"valor1"': "VARIABLE",
        '"valor2"': "VARIABLE",
        '"suma"': "OPERADOR",
        '"resta"': "OPERADOR",
        '"potencia"': "OPERADOR",
        '"raiz"': "OPERADOR",
        '"inverso"': "OPERADOR",
        '"coseno"': "OPERADOR",
        '"seno"': "OPERADOR",
        '"tangente"': "OPERADOR",
        '"multiplicacion"': "OPERADOR",
        '"division"': "OPERADOR",
        '"mod"': "OPERADOR",
        '"configuraciones"': "PALABRA_RESERVADA",
        '"fondo"': "PALABRA_RESERVADA",
        '"fuente"': "PALABRA_RESERVADA",
        '"forma"': "PALABRA_RESERVADA",
        'if', 'else', 'while', 'for', 'function', 'return', 
        'var', 'let', 'const', 'class', 'extends', 'new', 
        'try', 'catch', 'finally', 'throw', 'break', 'continue', 
        'switch', 'case', 'default', 'typeof', 'instanceof', 'this', 
        'super', 'import', 'export', 'true', 'false', 'null', 'undefined'
    };
    AFD
    ANALIZADOR LEXICO
   analyze(input) { // Método para analizar el código fuente
        let state = 0; // Estado inicial
        let buffer = ''; // Buffer para almacenar los caracteres
        let line = 1; // Contador de líneas
        let column = 1; // Contador de columnas
        

        for (let i = 0; i < input.length; i++) { // Recorrer el código fuente caracter por caracter 
            const char = input[i]; // Obtener el caracter actual

            if (char === '\n') { // Si el caracter es un salto de línea
                line++;
                column = 1;
                continue;
            }

            if (char.trim() === '') { // Si el caracter es un espacio en blanco
                column++;
                continue;
            }

            switch (state) { // Evaluar el estado actual del autómata finito determinista kjaskda
                case 0:
                    if (/[a-zA-Z]/.test(char)) { // Si el caracter es una letra del alfabeto (ojo que la ñ no existe aca)
                        //si el caracter es una ñ se agrega a la lista de errores 
                        if(char === 'ñ' || char === 'Ñ' || char === 'll' || char === 'LL'){
                            this.contadorErrores++;
                            this.errors.push({ value: char, description: 'Error léxico', line, column });
                            }else {
                                buffer += char;
                                state = 1;
                            }
                    } else if (/\d/.test(char)) { // Si el caracter es un número
                        //si el numero es menor a cero detectar como error o si tiene un signo menor antes del numero
                        if(char < 0 || char === '-'){
                            this.contadorErrores++;
                            this.errors.push({ value: char, description: 'Error léxico en dígitos', line, column });
                        }else{
                        buffer += char;
                        state = 2;
                    }
                    } else if (/[{}[\]():,+\-*/]/.test(char)) { // Si el caracter es un símbolo especial
                        this.tokens.push({ type: 'Símbolo', value: char, line, column }); // Agregar el token a la lista de tokens
                    } else if (char === '"' || char === "'") { // Si el caracter es una comilla doble o simple (para cadenas de texto jsjs)
                        buffer += char; // Agregar el caracter al buffer
                        state = 3;
                    } else {
                        this.contadorErrores++;
                        this.errors.push({ value: char, description: 'Carácter no reconocido', line, column }); // Agregar el error a la lista de errores
                    }
                    break;

                case 1: // Identificadores
                    if (/[a-zA-Z0-9]/.test(char)) { // Si el caracter es una letra o número (ojo que la ñ no existe aca)
                        buffer += char;
                    } else {
                        this.tokens.push({ type: 'Identificador', value: buffer, line, column });
                        buffer = '';
                        state = 0;
                        i--;
                    }
                    break;

                case 2: // Números
                    if (/\d/.test(char) || char === '.') { // Si el caracter es un número o un punto 
                        buffer += char;
                    } else {
                        this.tokens.push({ type: 'Número', value: buffer, line, column }); // Agregar el token a la lista de tokens
                        buffer = '';
                        state = 0;
                        i--;
                    }
                    break;

                case 3: // Cadenas
                    buffer += char;
                    if (char === '"' || char === "'") { // Si el caracter es una comilla doble o simple 
                        this.tokens.push({ type: 'Cadena', value: buffer, line, column });
                        buffer = '';
                        state = 0;
                    }
                    break;
            }

            column++;
        }

        if (buffer) { // Si el buffer no está vacío
            if (state === 1) {
                this.tokens.push({ type: 'Identificador', value: buffer, line, column }); // Agregar el token a la lista de tokens
            }else if (state === 2) {
                    this.tokens.push({ type: 'Número', value: buffer, line, column }); // Agregar el token a la lista de tokens
            }else if (state === 3) {
                this.tokens.push({ type: 'Cadena', value: buffer, line, column }); // Agregar el token a la lista de tokens
            }else{
                this.contadorErrores++;
                this.errors.push({ value: buffer, description: 'Carácteres no reconocidos', line, column }); // Agregar el error a la lista de errores
            }
        }
    }
```

## Creación de Archivo de Errores
```javaScript
    //esto al elegir opcion 4
function generateReports() {
    if (!jsonData) {
        console.log('       Primero debe abrir un archivo JSON.');
        return;
    }else{
        console.log('       Archivo JSON cargado exitosamente.');
    }

    // Procesar operaciones
    const operations = jsonData.operaciones || []; // Obtener las operaciones del archivo JSON
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
        const configurations = jsonData.configuraciones ? jsonData.configuraciones[0] : {}; // Obtener las configuraciones del archivo JSON
        processor.generateGraph(results, dotPath, configurations); // Generar el archivo DOT

        // Convertir DOT a PNG
        const imagePath = `${reportsPath}/graph.png`;
        exec(`dot -Tpng ${dotPath} -o ${imagePath}`, (error) => { // Ejecutar el comando dot para convertir el archivo DOT a PNG
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
```

## Creación de la grafica como imagen
```javaScript
    generateGraph(results, dotPath, configurations) { // Generar archivo DOT
        // Extraer configuraciones 
        const backgroundColor = configurations.fondo || "white"; // Color de fondo
        const fontColor = configurations.fuente || "black";
        const shape = configurations.forma || "ellipse";

        // Crear contenido del archivo DOT
        let dotContent = `digraph Operations {
            graph [bgcolor="${backgroundColor}"];
            node [fontcolor="${fontColor}" shape="${shape}"];
        `;
        // Recorrer resultados
        results.forEach((res, index) => {
            const operationLabel = `Operacion_${index + 1}`;
            dotContent += `    ${operationLabel} [label="${res.operation.operacion} (${res.result})"];\n`;

            // Valor 1
            if (typeof res.operation.valor1 === 'object') {
                const subLabel1 = `Nodo_${index}_Valor1`;
                dotContent += `    ${subLabel1} [label="${res.operation.valor1.operacion} (${res.result})"];\n`;
                dotContent += `    ${operationLabel} -> ${subLabel1};\n`;
            } else { // Si es un valor numérico
                dotContent += `    ${operationLabel}_Valor1 [label="${res.operation.valor1}"];\n`;
                dotContent += `    ${operationLabel} -> ${operationLabel}_Valor1;\n`;
            }

            // Valor 2
            if (typeof res.operation.valor2 === 'object') {
                const subLabel2 = `Nodo_${index}_Valor2`;
                dotContent += `    ${subLabel2} [label="${res.operation.valor2.operacion} (${res.result})"];\n`;
                dotContent += `    ${operationLabel} -> ${subLabel2};\n`;
            } else {// Si es un valor numérico
                dotContent += `    ${operationLabel}_Valor2 [label="${res.operation.valor2}"];\n`;
                dotContent += `    ${operationLabel} -> ${operationLabel}_Valor2;\n`;
            }
        });

        dotContent += "}";

        // Guardar contenido en el archivo DOT
        fs.writeFileSync(dotPath, dotContent);
    }
```

## Atributos de un token
```javaScript
    constructor(type, value, line, column) {
        this.type = type; // Tipo del token (e.g., "Palabra reservada", "Número").
        this.value = value; // Valor del token.
        this.line = line; // Línea donde se encontró.
        this.column = column; // Columna donde se encontró.
    }
```
## Atributos de un Lexema
```javaScript
    constructor(type, value) {
        this.type = type; // Tipo de lexema.
        this.value = value; // Valor del lexema.
    }
```
