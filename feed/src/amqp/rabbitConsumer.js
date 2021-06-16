import Consumer from "../consumer";
import MQ from "./mq";

/**
 * RabbitConsumer submits the message to RabbitMQ
 *
 * This requires the mqUri environment variable to be set with the MQ uri
 *
 * Optionally, the following environment variables:
 *
 * dataTopic - the topic to send data to, defaults to "amq.topic"
 *
 * graphiteTopic - if set sends data to graphite via rabbitMQ
 */
class RabbitConsumer extends Consumer {
  constructor() {
    super();

    this.mq = new MQ(process.env.mqUri);

    this.dataTopic = process.env.dataTopic ? process.env.dataTopic : "amq.topic";
    console.log("Using", this.dataTopic, "topic for data");

    this.graphiteTopic = process.env.graphiteTopic;
    if (this.graphiteTopic) {
      console.log("Using", this.graphiteTopic, "topic for graphite");
    }
  }

  consume(msg) {
    try {
      msg = super.consume(msg);

      this.mq.publish(this.dataTopic, msg.key, msg);

      if (this.graphiteTopic && ('data' in msg && 'value' in msg.data)) {
        // This uses the "stat value timestamp" format which you need to
        // enable in graphite when using rabbit (it defaults to "value timestamp"
        // for the payload but I prefer keeping the key in there as well as
        // in the routingKey
        this.graphite(msg.key, msg.data.value, msg.time.unix);
      }
    } catch (e) {
      console.error(e);
    }

    return msg;
  }

  graphite(key, value, ts) {
    if (this.graphiteTopic) {
      this.mq.publish(this.graphiteTopic, key, [key, value, ts].join(' '));
    }
  }
}

export default RabbitConsumer;
