class TimelineItem {

  constructor(orderRef, orderList, autoInit = false) {

    this.orderRef = orderRef;
    this.orderList = orderList;
    this.isOpened = false;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.build();

    this.orderRef.child('isDeleted').on('value', snap => {

      const self = this;

      if (snap.val()) {

        self.element.classList.add('is-deleting');

        setTimeout(() => {
          self.element.classList.remove('is-deleting');
          self.element.classList.add('is-deleted');
        }, 1300);

      }

    });

    this.orderRef.child('isArchived').on('value', snap => {
      if (snap.val())
        this.archive();
      else
        this.unarchive();
    });

    this.element.content.addEventListener('click', event => {

      const self = this;

      this.orderList.open(this.orderRef.key);

      setTimeout(() => {

        let scrollType = !event.shiftKey ? 'smooth' : 'instant';

        try {

          let orderElement = self.orderList.orders[self.orderRef.key].element;

          orderElement.scrollIntoView({
            behavior: scrollType
          });

        } catch (e) {

          console.log(e);

        }

      }, 10);

    });

    this.element.content.addEventListener('dblclick', event => console.log(event));

    const self = this;

    setInterval(() => {

      if (self.orderList.currentOrdersView[self.orderRef.key])
        self.element.classList.add('is-opened');
      else
        self.element.classList.remove('is-opened');

    }, 500);

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

    this.element.content.customerName = this.buildCustomerNameElement();
    this.element.content.tagList = this.buildTagListElement();
    this.element.content.createdTime = this.buildCreatedTimeElement();
    this.element.actions.printButton = this.buildPrintButtonElement();
    this.element.actions.deleteButton = this.buildArchiveButtonElement();

  }

  buildTagListElement() {

    const tagList = new TagList(this.orderRef);
    this.element.content.appendChild(tagList.element);
    return tagList.element;

  }

  buildCustomerNameElement() {

    const element = document.createElement('div');
    element.className = 'TimelineItem-customerName';
    this.element.content.appendChild(element);

    element.span = document.createElement('span');
    this.orderRef.child('customer/customerName').on('value', snap => element.span.innerHTML = snap.val());
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
    this.orderRef.child('printouts').on('value', snap => {
      if (snap.val())
        element.icon.classList.remove('pulse');
      else
        element.icon.classList.add('pulse');
    });
    element.appendChild(element.icon);

    return element;

  }

  buildArchiveButtonElement() {

    const element = document.createElement('button');
    element.className = 'TimelineItem-actionButton TimelineItem-actionButton--archive';
    element.addEventListener('click', () => {
      this.orderRef.child('isArchived').once('value', snap => this.orderRef.child('isArchived').set(!snap.val()));
      this.orderList.close(this.orderRef.key);
    });
    this.element.actions.appendChild(element);

    element.icon = document.createElement('span');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'archive';
    this.orderRef.child('isArchived').on('value', snap => {
      if (snap.val())
        element.icon.innerHTML = 'unarchive';
      else
        element.icon.innerHTML = 'archive';
    });
    element.appendChild(element.icon);

    return element;

  }

  archive() {
    this.orderList.close(this.orderRef.key);
    this.element.classList.add('is-archived');
  }

  unarchive() {
    this.element.classList.remove('is-archived');
  }

}