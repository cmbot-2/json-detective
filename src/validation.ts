export type Validation = { valid: true } | { valid: false; message: string };

export function validateJson(text: string): Validation {
  if (!text.trim()) return { valid: false, message: 'Enter a JSON value to begin.' };
  try {
    JSON.parse(text);
    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Check the JSON syntax.';
    // Engines report different error formats. Keep their explanation, adding a
    // readable location when only a UTF-16 character offset is available.
    const offset = /\bposition\s+(\d+)/i.exec(message);
    if (offset && !/\bline\s+\d+/i.test(message)) {
      const prefix = text.slice(0, Number(offset[1]));
      const lines = prefix.split(/\r\n|\r|\n/);
      return { valid: false, message: `Line ${lines.length}, column ${lines.at(-1)!.length + 1}: ${message}` };
    }
    return { valid: false, message };
  }
}
