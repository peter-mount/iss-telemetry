/*
 * feed - a nodejs application to receive live ISS telemetry and submit it to a RabbitMQ instance for further consumption.
 */

import ISS from "./iss";

// On container shutdown exit quickly
const stop = () => {
  console.log('Terminated');
  process.exit(0);
};
process.on('SIGTERM', stop);
process.on('SIGINT', stop);

console.log("ISS live feed");

let iss = new ISS()
iss.connect()
