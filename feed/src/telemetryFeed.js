import ls from "lightstreamer-client";
import Subscription from "./subscription";
import telemetry from "./Telemetry_identifiers";
import ISSTime from "./time";

class TelemetryFeed extends Subscription {

  issTime = new ISSTime();

  constructor(client, consumer) {
    super("telemetry", client, consumer);

    let classes = ["TimeStamp", "Value"];

    this.subscribe(new ls.Subscription("MERGE", telemetry.identifiers, classes));
  }

  onItemUpdate(update) {
    // Get value, try to convert to float
    let value=update.getValue("Value");
    try {
      value = parseFloat(value);
    } catch(e) {
      // Ignore, keep string value
    }

    this.consumer.consume({
      feed: 'iss',          // Source feed
      type: 'telemetry',    // Telemetry record
      data: {
        name: update.getItemName(),
        value: value
      },
      raw: update          // The raw message
    });
  }

}

export default TelemetryFeed;
