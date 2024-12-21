// src/classes/Processor.js
const fs = require('fs');
const { exec } = require('child_process');

class Processor {
    constructor() {
        this.results = [];
        this.errors = [];
        this.contadorErrores = 0;
    }

    processOperations(operations) {
        operations.forEach((operation, index) => {
            let line = 1; // Contador de líneas
            let column = 1; // Contador de columnas
            try {
                const result = this.resolveOperation(operation);
                this.results.push({ index, operation, result });
            } catch (err) {
                this.contadorErrores++;
                this.errors.push({ index, operation, description: err.message, line, column });
            }
        });
    }

    resolveOperation(operation) {
        if (!operation || !operation.operacion) {
            throw new Error('Operación no definida o faltante.');
        }

        const { operacion, valor1, valor2 } = operation;

        const v1 = typeof valor1 === 'object' ? this.resolveOperation(valor1) : valor1;
        const v2 = typeof valor2 === 'object' ? this.resolveOperation(valor2) : valor2;

        switch (operacion.toLowerCase()) {
            case 'suma':
                return Number(v1) + Number(v2);
            case 'resta':
                return Number(v1) - Number(v2);
            case 'multiplicacion':
                return Number(v1) * Number(v2);
            case 'division':
                if (Number(v2) === 0 || Number(v1) === 0) {
                    this.contadorErrores++
                   // this.errors.push({index, operation, description: 'Error División por cero detectada xd.',line, column });
                    throw new Error('División por cero ERRor.');
                }
                return Number(v1) / Number(v2);
            case 'potencia':
                return Math.pow(Number(v1), Number(v2));
            case 'raiz':
                if (Number(v1) < 0) {
                    this.contadorErrores++;
                    throw new Error('Raíz cuadrada de un número negativo.');
                }
                return Math.pow(Number(v1), 1 / Number(v2));
            default:
                this.contadorErrores++;
                throw new Error(`Operación desconocida: ${operacion}`);
        }
    }

    generateGraph(results, dotPath, configurations) {
        // Extraer configuraciones
        const backgroundColor = configurations.fondo || "white";
        const fontColor = configurations.fuente || "black";
        const shape = configurations.forma || "ellipse";

        // Crear contenido del archivo DOT
        let dotContent = `digraph Operations {
            graph [bgcolor="${backgroundColor}"];
            node [fontcolor="${fontColor}" shape="${shape}"];
        `;

        results.forEach((res, index) => {
            const operationLabel = `Operacion_${index + 1}`;
            dotContent += `    ${operationLabel} [label="${res.operation.operacion} (${res.result})"];\n`;

            // Valor 1
            if (typeof res.operation.valor1 === 'object') {
                const subLabel1 = `Nodo_${index}_Valor1`;
                dotContent += `    ${subLabel1} [label="${res.operation.valor1.operacion} (${res.result})"];\n`;
                dotContent += `    ${operationLabel} -> ${subLabel1};\n`;
            } else {
                dotContent += `    ${operationLabel}_Valor1 [label="${res.operation.valor1}"];\n`;
                dotContent += `    ${operationLabel} -> ${operationLabel}_Valor1;\n`;
            }

            // Valor 2
            if (typeof res.operation.valor2 === 'object') {
                const subLabel2 = `Nodo_${index}_Valor2`;
                dotContent += `    ${subLabel2} [label="${res.operation.valor2.operacion} (${res.result})"];\n`;
                dotContent += `    ${operationLabel} -> ${subLabel2};\n`;
            } else {
                dotContent += `    ${operationLabel}_Valor2 [label="${res.operation.valor2}"];\n`;
                dotContent += `    ${operationLabel} -> ${operationLabel}_Valor2;\n`;
            }
        });

        dotContent += "}";

        // Guardar contenido en el archivo DOT
        fs.writeFileSync(dotPath, dotContent);
    }

    getResults() {
        return this.results;
    }

    getErrors() {
        return this.errors;
    }
    getContadorErrores(){
        return this.contadorErrores;
    }
}

module.exports = Processor;
