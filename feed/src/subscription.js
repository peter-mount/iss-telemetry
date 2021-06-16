class Subscription {
  constructor(id, client, consumer) {
    this.id = id;
    this.client = client;
    this.consumer = consumer;
  }

  debug(label, status) {
    if (status) {
      console.log(this.id + ": " + label + " " + JSON.stringify(status))
    } else {
      console.log(this.id + ": " + label)
    }
  }

  subscribe(subscription) {
    this.subscription = subscription;

    this.client.subscribe(this.subscription);

    this.subscription.addListener({
      onSubscription: () => this.onSubscription(),
      onUnsubscription: () => this.onUnsubscription(),
      onItemUpdate: update => this.onItemUpdate(update)
    });
  }

  onSubscription() {
    this.debug("subscribed");
  }

  onUnsubscription() {
    this.debug("unsubscribed");
  }

}

export default Subscription;
