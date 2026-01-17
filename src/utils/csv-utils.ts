// TODO look up mdn FileReader
export function parseCsv(contents: string): string[][] {
  return contents.split("\n").map((line) => parseCsvLine(line));
}

export function parseCsvLine(
  line: string,
  quotationChar: string = '"',
  separator: string = ","
): string[] {
  let i = 0;
  let field = "";
  let row = [];
  while (i < line.length) {
    [field, i] = parseCsvField(line, i, quotationChar, separator);
    row.push(field);
  }

  return row;
}

function parseCsvField(
  line: string,
  index: number,
  quotationChar: string = '"',
  separator: string = ","
): [string, number] {
  let i = index;
  if (line[index] === quotationChar) {
    return parseCsvQuotedField(line, index, quotationChar);
  }
  return parseCsvUnquotedField(line, index, separator);
}

export function parseCsvQuotedField(
  line: string,
  index: number,
  quotationChar: string = '"'
): [string, number] {
  let i = index + 1;
  while (line[i] !== quotationChar) i++;
  return [line.slice(index + 1, i), i + 2];
}

export function parseCsvUnquotedField(
  line: string,
  index: number,
  separator: string = ","
): [string, number] {
  let i = index;
  while (line[i] !== separator && i < line.length) i++;
  return [line.slice(index, i), i + 1];
}
