var term    = require( 'terminal-kit' ).terminal

while (true) {
    term
    .saveCursor()
    .red('ho')
    .nextLine(5)
    .restoreCursor()
}