// Mi Token.js uwu
class Token {
    constructor(type, value, line, column) {
        this.type = type; // Tipo del token (e.g., "Palabra reservada", "Número").
        this.value = value; // Valor del token.
        this.line = line; // Línea donde se encontró.
        this.column = column; // Columna donde se encontró.
    }
}

module.exports = Token; // Exportar la clase Token.
