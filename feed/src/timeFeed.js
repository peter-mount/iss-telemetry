import ls from "lightstreamer-client";
import Subscription from "./subscription";
import ISSTime from "./time";

const
  SIGNAL_ERROR_MARGIN = 0.00153680542553047,
  SIGNAL_UNKNOWN = 0,
  SIGNAL_LOST = 1,
  SIGNAL_ACQUIRED = 2,
  SIGNAL_ERROR = 3,
  MSG = ["Unknown", "Lost", "Acquired", "Error"];

class TimeFeed extends Subscription {
  aosNum = SIGNAL_UNKNOWN;

  issTime = new ISSTime();

  constructor(client, consumer) {
    super("time", client, consumer);

    this.subscribe(new ls.Subscription(
      "MERGE",
      "TIME_000001",
      ["TimeStamp", "Value", "Status.Class", "Status.Indicator"]
    ));
  }

  onItemUpdate(update) {
    try {
      const
        timestampNow = this.issTime.nowISS(),
        rawTimestamp = update.getValue("TimeStamp"),
        timestamp = parseFloat(rawTimestamp),
        difference = timestampNow - timestamp,
        status = update.getValue("Status.Class")

      let state;

      if (difference > SIGNAL_ERROR_MARGIN) {
        state = SIGNAL_ERROR;
      } else {
        if (status === "24") {
          state = SIGNAL_ACQUIRED;
        } else {
          state = SIGNAL_LOST;
        }
      }

      const msg = this.consumer.consume({
        feed: 'iss',        // Source feed
        type: 'time',       // Type of message
        data: {
          class: status,     // Status class
          state: MSG[state], // Signal state
          name: "status",
          value: state,      // The state value for graphite
        },
        raw: update          // The raw message
      });

      // Only notify if we change state
      if (state !== this.aosNum) {
        //console.log(JSON.stringify(msg));
        console.log(msg.time.time, "Signal", msg.data.state, msg.time.iss);
        this.aosNum = state;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default TimeFeed;
