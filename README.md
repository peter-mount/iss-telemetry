# iss-telemetry

This is a pair of docker containers which receive telemetry from the International Space Station and submits them to a
local RabbitMQ instance for processing.

I then use these to submit into Graphite for display in Grafana.

# feed

This is the main container which receives the realtime telemetry.

# issec2lla

This is an optional container which transforms the stations state vector from Earth Centric to
Longitude/Latitude/Altitude format so that the stations current position on a map.

# grafana

This folder contains the dashboard definitions I use to display. These are here for reference/backup.
