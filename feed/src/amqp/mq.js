import amqp from 'amqplib';

/**
 * This is loosely based on my earthquake twitter bot.
 *
 * It has issues with the underlying connection being closed but it works pretty
 * well otherwise.
 */
class MQ {

  constructor(uri) {
    this.init = true;
    this.pending = [];
    const t = this;

    //console.log('Connecting to', uri);
    amqp.connect(uri)
      .then(function (conn) {
        return conn.createChannel();
      })
      .then(function (ch) {
        ch.prefetch(1);
        t.channel = ch;
      })
      .then(() => {
        //console.log('Connected to',uri);
        t.init = false;
        t.pending.forEach(t => t());
      })
      .catch(e => {
        console.error('MQ:', e);
        process.exit(1);
      });
  }

  publish(topic, routingKey, msg) {
    // Convert to JSON if msg is not a string
    if (typeof msg != "string") {
      msg = JSON.stringify(msg);
    }
    this.channel.publish(topic, routingKey, new Buffer(msg));
  }

  enqueue(func) {
    if (this.init) {
      this.pending.push(func);
    } else {
      func();
    }
  }
}

export default MQ;
