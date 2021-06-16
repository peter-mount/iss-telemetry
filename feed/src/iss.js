import ls from "lightstreamer-client";
import RabbitConsumer from "./amqp/rabbitConsumer";
import TelemetryFeed from "./telemetryFeed";
import TimeFeed from "./timeFeed";

class ISS {
  constructor() {
  }

  connect() {
    this.client = new ls.LightstreamerClient("https://push.lightstreamer.com", "ISSLIVE");

    this.client.connectionOptions.setSlowingEnabled(false);

    // The class to consume the data
    //this.consumer = new ConsoleConsumer();
    this.consumer = new RabbitConsumer();

    this.telemetry = new TelemetryFeed(this.client, this.consumer);
    this.time = new TimeFeed(this.client, this.consumer);

    this.client.addListener(s => this.statusChange(s));

    console.log("Connecting");
    this.client.connect();

    console.log(this.client.getStatus());
  }

  statusChange(newStatus) {
    console.log("Client status:", newStatus);
  }

}

export default ISS;
