
const fs = require('fs'); //importa la libreria fs para leer y escribir archivos
const { exec } = require('child_process');  //importa la libreria child_process para ejecutar comandos en la terminal

class Processor { //clase Processor
    constructor() {
        this.results = [];  //array de resultados
        this.errors = []; //array de errores
    }

    processOperations(jsonContent) { //metodo para procesar las operaciones del archivo JSON
        const data = JSON.parse(jsonContent);   //parsea el contenido del archivo JSON
        if (!data.operaciones) { //si no hay operaciones en el archivo
            this.errors.push({ description: "No se encontraron operaciones en el archivo." });
            return;
        }

        data.operaciones.forEach((operation, index) => { //por cada operacion en el archivo JSON 
            try {
                const result = this.resolveOperation(operation); //resuelve la operacion 
                this.results.push({ index, operation, result }); //agrega el resultado al array de resultados 
            } catch (error) { // por si hay un error
                this.errors.push({
                    description: `Error en la operación ${index + 1}: ${error.message}`,
                });
            }
        });
    }

    resolveOperation(operation) { //metodo para resolver las operaciones 
        const { operacion, valor1, valor2 } = operation; //obtiene la operacion, valor1 y valor2 de la operacion 

        // Resolver valores anidados
        const value1 = typeof valor1 === 'object' ? this.resolveOperation(valor1) : valor1; //resuelve el valor1 de la operacion
        const value2 = typeof valor2 === 'object' ? this.resolveOperation(valor2) : valor2;

        switch (operacion.toLowerCase()) { //tipos de operaciones 
            case 'suma':
                return Number(value1) + Number(value2);
            case 'resta':
                return Number(value1) - Number(value2);
            case 'multiplicacion':
                return Number(value1) * Number(value2);
            case 'division':
                if (Number(value2) === 0) throw new Error("División entre cero.");
                return Number(value1) / Number(value2);
            case 'potencia':
                return Math.pow(Number(value1), Number(value2));
            case 'raiz':
                return Math.pow(Number(value1), 1 / Number(value2));
            case 'inverso':
                if (Number(value1) === 0) throw new Error("Inverso de cero no definido.");
                return 1 / Number(value1);
            case 'seno':
                return Math.sin(Number(value1));
            case 'coseno':
                return Math.cos(Number(value1));
            case 'tangente':
                return Math.tan(Number(value1));
            case 'mod':
                return Number(value1) % Number(value2);
            default:
                throw new Error(`Operación no reconocida: ${operacion}`);
        }
    }

    generateGraph(data, outputPath) { //metodo para generar el grafo por la libreria graphviz 
        let dotContent = 'digraph G {\nnode [shape=ellipse];\n'; //contenido del archivo DOT

        function buildNode(operation, parentId, config) { //funcion para construir los nodos del grafo
            const nodeId = `node_${Math.random().toString(36).substr(2, 9)}`; //id del nodo
            const color = config.fondo || 'white'; //color de fondo
            const fontColor = config.fuente || 'black'; //color de fuente
            const shape = config.forma || 'ellipse'; //forma del nodo

            dotContent += `"${nodeId}" [label="${operation.operacion}\\n(${operation.result})", style=filled, fillcolor=${color}, fontcolor=${fontColor}, shape=${shape}];\n`;  //agrega el nodo al archivo DOT

            if (parentId) {
                dotContent += `"${parentId}" -> "${nodeId}";\n`; //agrega la relacion entre nodos
            }

            if (operation.valor1 && typeof operation.valor1 === 'object') { //si el valor1 es un objeto
                buildNode(operation.valor1, nodeId, config); //construye el nodo
            }
            if (operation.valor2 && typeof operation.valor2 === 'object') { //si el valor2 es un objeto
                buildNode(operation.valor2, nodeId, config);
            }
        }

        data.forEach((operation) => { //por cada operacion en el archivo JSON
            const config = operation.configuraciones || {}; // Configuración por nodo (color, forma, fuente)
            buildNode(operation, null, config); //construye el nodo
        });

        dotContent += '}';

        fs.writeFileSync(outputPath, dotContent); //escribe el archivo DOT
        console.log(`Gráfico generado: ${outputPath}`); //muestra mensaje de grafo generado
    }

    generateGraphImage(dotFilePath, imageOutputPath) {
        exec(`dot -Tpng ${dotFilePath} -o ${imageOutputPath}`, (error) => { //ejecuta el comando dot para generar la imagen
            if (error) {
                console.error('Error al generar la imagen:', error); //si hay un error muestra mensaje de error 
            } else {
                console.log(`Imagen generada: ${imageOutputPath}`); //muestra mensaje de imagen generada
            }
        });
    }

    getResults() { 
        return this.results; //retorna los resultados 
    }

    getErrors() {
        return this.errors;     //retorna los errores
    }
}

module.exports = Processor; // sisi exporta la clase y sus metodos
