class TimelineItem {

  constructor(orderRef, autoInit) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.build();

    this.orderRef.on('value', snap => {
      if (!snap.val()) this.element.classList.add('is-deleted');
    });

    this.orderRef.child('archived').on('value', snap => {
      if (snap.val())
        this.archive();
      else
        this.unarchive();
    });

  }

  build() {

    this.element.className = 'TimelineItem';
    this.element.dataset.orderRefKey = this.orderRef.key;

    // content
    this.element.content = document.createElement('div');
    this.element.content.className = 'TimelineItem-content';
    this.element.appendChild(this.element.content);

    // actions
    this.element.actions = document.createElement('div');
    this.element.actions.className = 'TimelineItem-actions';
    this.element.appendChild(this.element.actions);

    this.element.content.consumerName = this.buildConsumerNameElement();
    this.element.content.createdTime = this.buildCreatedTimeElement();
    this.element.actions.printButton = this.buildPrintButtonElement();
    this.element.actions.deleteButton = this.buildArchiveButtonElement();

  }

  buildConsumerNameElement() {

    const element = document.createElement('div');
    element.className = 'TimelineItem-consumerName';
    this.element.content.appendChild(element);

    element.span = document.createElement('span');
    this.orderRef.child('consumerName').on('value', snap => element.span.innerHTML = snap.val());
    element.appendChild(element.span);

    return element;

  }

  buildCreatedTimeElement() {

    const element = document.createElement('div');
    element.className = 'TimelineItem-createdTime font-green';
    this.element.content.appendChild(element);

    element.span = document.createElement('span');
    this.orderRef.child('createdTime').once('value', snap => {
      element.span.innerHTML = moment(snap.val()).fromNow();
      setInterval(() => element.span.innerHTML = moment(snap.val()).fromNow(), 10000);
    });
    element.appendChild(element.span);

    return element;

  }

  buildPrintButtonElement() {

    const element = document.createElement('button');
    element.className = 'TimelineItem-actionButton TimelineItem-actionButton--print';
    element.addEventListener('click', () => Order.print(this.orderRef, socket));
    this.element.actions.appendChild(element);

    element.icon = document.createElement('span');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'print';
    element.appendChild(element.icon);

    return element;

  }

  buildArchiveButtonElement() {

    const element = document.createElement('button');
    element.className = 'TimelineItem-actionButton TimelineItem-actionButton--archive';
    element.addEventListener('click', () => {
      this.orderRef.child('archived').once('value', snap => this.orderRef.child('archived').set(!snap.val()));
    });
    this.element.actions.appendChild(element);

    element.icon = document.createElement('span');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'archive';
    this.orderRef.child('archived').on('value', snap => {
      if (snap.val())
        element.icon.innerHTML = 'unarchive';
      else
        element.icon.innerHTML = 'archive';
    });
    element.appendChild(element.icon);

    return element;

  }

  archive() {
    this.element.classList.add('is-archived');
  }

  unarchive() {
    this.element.classList.remove('is-archived');
  }

}