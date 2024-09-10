// colorize.ts

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";

type Color = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';

function colorize(message: string, color: Color): string {
  const colors: Record<Color, string> = {
    red: RED,
    green: GREEN,
    yellow: YELLOW,
    blue: BLUE,
    magenta: MAGENTA,
    cyan: CYAN,
    white: WHITE
  };

  return `${colors[color] || RESET}${message}${RESET}`;
}

export default colorize;
