import ISSTime from "./time";

/**
 * Base class for consuming ISS events
 */
class Consumer {

  issTime = new ISSTime();

  /**
   * Consume the message.
   *
   * Implementations must call super.consume(msg) to ensure msg contains
   * the required additional fields.
   *
   * It must return the converted message
   *
   * @param msg
   * @returns {*}
   */
  consume(msg) {
    if (!('key' in msg)) {
      // Get the routing key: feed.type.name
      const
        ru = msg.raw.ru,
        name = msg.raw.getItemName(),
        nameLow = name.toLowerCase(),
        path = [
          msg.feed,
          msg.type,
          //ru ? 'ru' : 'us'
        ];
      if (name.length > 6) {
        path.push(nameLow.slice(0, -6));
      }
      path.push(nameLow);
      msg.key = path.join('.');
    }

    if (!('time' in msg)) {
      const
        rawTimestamp = msg.raw.getValue("TimeStamp"),
        timestamp = parseFloat(rawTimestamp),
        utc = this.issTime.issToUTC(timestamp),
        now = new Date(utc);

      msg.time = {
        //timestamp: rawTimestamp,
        time: now.toJSON(), // JSON timestamp
        iss: timestamp,     // ISS timestamp
        java: utc,          // Java timestamp
        unix: Math.floor(utc / 1000)    // Unix timestamp,
      };
    }
    return msg;
  }

}

export default Consumer;
