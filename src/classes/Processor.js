
const fs = require('fs'); // Importa la librería fs para leer y escribir archivos
const path = require('path'); // Asegurémonos de importar el módulo path
const { exec } = require('child_process'); // Importa la librería child_process para ejecutar comandos

class Processor {
    constructor() {
        this.results = []; // Array de resultados
        this.errors = [];  // Array de errores
    }

    processOperations(json) {
        try {
            const operations = json.operaciones;
            operations.forEach((operation, index) => {
                try {
                    const result = this.resolveOperation(operation);
                    this.results.push({ index, operation, result });
                } catch (error) {
                    this.errors.push({ operation, error: error.message });
                }
            });
        } catch (error) {
            console.error('Error procesando operaciones:', error.message);
        }
    }

    resolveOperation(operation) {
        const { operacion, valor1, valor2 } = operation;

        const value1 = typeof valor1 === 'object' ? this.resolveOperation(valor1) : valor1;
        const value2 = typeof valor2 === 'object' ? this.resolveOperation(valor2) : valor2;

        switch (operacion.toLowerCase()) {
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
                return Math.sin(this.toRadians(Number(value1)));
            case 'coseno':
                return Math.cos(this.toRadians(Number(value1)));
            case 'tangente':
                return Math.tan(this.toRadians(Number(value1)));
            case 'mod':
                return Number(value1) % Number(value2);
            default:
                throw new Error(`Operación no reconocida: ${operacion}`);
        }
    }

    toRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    generateGraph(data, outputPath) {
        let dotContent = 'digraph G {\nnode [shape=ellipse];\n';
        function buildNode(operation, parentId, config) {
            const nodeId = `node_${Math.random().toString(36).substr(2, 9)}`;
            const color = config.fondo || 'white';
            const fontColor = config.fuente || 'black';
            const shape = config.forma || 'ellipse';
    
            dotContent += `"${nodeId}" [label="${operation.operacion}\\n(${operation.result})", style=filled, fillcolor=${color}, fontcolor=${fontColor}, shape=${shape}];\n`;
    
            if (parentId) {
                dotContent += `"${parentId}" -> "${nodeId}";\n`;
            }
    
            if (operation.valor1 && typeof operation.valor1 === 'object') {
                buildNode(operation.valor1, nodeId, config);
            }
            if (operation.valor2 && typeof operation.valor2 === 'object') {
                buildNode(operation.valor2, nodeId, config);
            }
        }
    
        data.forEach((operation) => {
            const config = operation.configuraciones || {};
            buildNode(operation, null, config);
        });
    
        dotContent += '}';
        fs.writeFileSync(outputPath, dotContent);
        console.log(`Gráfico generado: ${outputPath}`);
    }

    generateGraphImage(dotFilePath, imageOutputPath) {
        exec(`dot -Tpng ${dotFilePath} -o ${imageOutputPath}`, (error) => {
            if (error) {
                console.error('Error al generar la imagen:', error);
            } else {
                console.log(`----------------------------------------`);
                console.log(`Imagen generada CORRECTAMENTE EN: ${imageOutputPath}`);
            }
        });
    }

    getResults() {
        return this.results;
    }

    getErrors() {
        return this.errors;
    }
}

module.exports = Processor;
