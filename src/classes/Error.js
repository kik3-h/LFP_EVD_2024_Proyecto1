// Error.js
class Error {
    constructor(value, description, line, column) {
        this.value = value; // Valor que generó el error.
        this.description = description; // Descripción del error.
        this.line = line; // Línea del error.
        this.column = column; // Columna del error.
    }
}

module.exports = Error;