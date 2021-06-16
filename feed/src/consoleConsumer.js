import Consumer from "./consumer";

/**
 * ConsoleConsumer just logs the message to the console - used for debugging
 */
class ConsoleConsumer extends Consumer {
  consume(msg) {
    try {
      msg = super.consume(msg);
      console.log(JSON.stringify(msg));
    } catch (e) {
      console.error(e);
    }
    return msg;
  }
}

export default ConsoleConsumer;
