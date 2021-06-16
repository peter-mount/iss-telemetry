import pika
from ec2lla import eci2lla
from astropy.time import Time

connection = pika.BlockingConnection(pika.ConnectionParameters(host='51.15.78.179',
                                                               credentials=pika.PlainCredentials(username='iss',
                                                                                                 password='ZSmgkmTWSf3Tm4LS')))
channel = connection.channel()

metric_x = 'iss.telemetry.uslab.uslab000032'
metric_y = 'iss.telemetry.uslab.uslab000033'
metric_z = 'iss.telemetry.uslab.uslab000034'

x = 0.0
y = 0.0
z = 0.0
t = [0, 0, 0]


def publishMetric(channel, n, v, ts):
    s = "{0} {1} {2}".format(n, v, ts)
    channel.basic_publish(exchange='graphite', routing_key=n, body=s)
    # print(s)


def convertXYZtoLLS(ch, method, properties, body):
    global x, y, z, t, channel
    s = body.split()
    sr = method.routing_key  # use routing key as it's a string
    sv = float(s[1]) * 1000  # Telemetry is in km
    st = int(s[2])  # unix time of the metric
    if sr == metric_x:
        x = sv
        t[0] = st
    if sr == metric_y:
        y = sv
        t[1] = st
    if sr == metric_z:
        z = sv
        t[2] = st
    if t[0] == t[1] and t[1] == t[2]:
        dt = Time(t[0], format='unix', scale='utc')
        lon, lat, alt = eci2lla(x, y, z, dt)
        publishMetric(ch, "iss.pos.lon", lon.to_value(), t[0])
        publishMetric(ch, "iss.pos.lat", lat.to_value(), t[0])
        publishMetric(ch, "iss.pos.alt", alt.to_value(), t[0])


# Press the green button in the gutter to run the script.
# if __name__ == '__main__':

# Create a queue for just the J2000 position state vectors.
# This queue will convert them to lat,lon,alt
result = channel.queue_declare(queue='iss.statevector')
queue_name = result.method.queue
channel.queue_bind(queue=queue_name, exchange='graphite', routing_key=metric_x)
channel.queue_bind(queue=queue_name, exchange='graphite', routing_key=metric_y)
channel.queue_bind(queue=queue_name, exchange='graphite', routing_key=metric_z)
channel.basic_consume(queue=queue_name, on_message_callback=convertXYZtoLLS, auto_ack=True)

channel.start_consuming()
