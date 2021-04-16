export default class XPrinter {
  private count: number;
  private previousValue: any;

  constructor() {
    this.count = 0;
  }

  print(value: any) {
    if (this.count > 0) this.clear();

    this.count++;
    this.previousValue = value;

    process.stdout.cursorTo(0);
    process.stdout.clearLine(1);
    process.stdout.write(JSON.stringify(value, null, 2));
  }

  clear() {
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);

    Object.keys(this.previousValue).forEach(() => {
      process.stdout.moveCursor(0, -1);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
    });

    process.stdout.moveCursor(0, -1);
    process.stdout.cursorTo(0);
    process.stdout.clearLine(1);
  }
}

function test() {
  let stuffToPrint = {
    block: 1000,
    balance: 20,
  };
  let printer = new XPrinter();
  printer.print(stuffToPrint);

  setTimeout(function () {
    stuffToPrint = {
      block: 999,
      balance: 20,
    };

    printer.print(stuffToPrint);
  }, 1000);

  setTimeout(function () {
    stuffToPrint = {
      block: 998,
      balance: 9,
    };
    printer.print(stuffToPrint);
  }, 2000);
}
