class OrderList {

  constructor(app, optionalClass = '', autoInit = true) {

    this.app = app;
    this.optionalClass = optionalClass;

    // define database instances
    this.ordersRef = this.app.ordersRef;
    this.ordersViewRef = this.app.ordersViewRef || this.app.activeOrdersViewRef;

    this.element = document.createElement('div');
    this.orders = {};
    this.currentOrdersView = {};
    this.isLoaded = false;

    if (this.ordersRef && this.ordersViewRef && autoInit)
      this.init();

  }

  init() {

    this.build();

    // define global listeners
    this.ordersViewRef.on('child_added', snap => this.pushOrder(this.ordersRef.child(snap.key), snap.val()));
    this.ordersRef.on('child_removed', snap => this.removeOrder(this.ordersRef.child(snap.key)));

    // faz algo após a lista de dados ser baixada
    this.ordersViewRef.once('value', snap => {

      // this.buildView(!this.isLoaded);
      // this.isLoaded = true;

    });

  }

  build() {

    this.element.className = 'OrderList';
    this.element.classList.add(this.optionalClass);

    // inner
    this.element.inner = document.createElement('div');
    this.element.inner.className = 'OrderList-inner';
    this.element.appendChild(this.element.inner);

  }

  buildView(initializeOrders) {

    this.element.inner.innerHTML = '';

    const view = Object.values(this.orders);

    // ordena decrescente
    view.sort((a, b) => {
      if (a.createdTime.isBefore(b.createdTime))
        return 1;
      if (b.createdTime.isBefore(a.createdTime))
        return -1;
      return 0;
    });

    view.forEach(order => this.appendOrderToView(order));

    if (initializeOrders)
      view.forEach(order => order.init());

  }

  pushOrder(orderRef, data) {

    if (data) {

      if (!this.orders[orderRef.key]) {

        if (orderRef && !this.orders[orderRef.key])
          this.orders[orderRef.key] = new Order(orderRef, this, false);

        this.orders[orderRef.key].ordersViewItemRef = this.ordersViewRef.child(orderRef.key);
        this.orders[orderRef.key].createdTime = moment(data.createdTime);

        this.orders[orderRef.key].orderRef.child('isDeleted').on('value', snap => {
          if (!!snap.val())
            this.orders[orderRef.key].ordersViewItemRef.set(false);
        });

        if (this.isLoaded) {
          this.appendOrderToView(this.orders[orderRef.key], true);
          this.orders[orderRef.key].init();
        }

      }

    }

  }

  removeOrder(orderRef) {

    if (orderRef)
      if (this.orders[orderRef.key]) {
        this.ordersViewRef.child(orderRef.key).set(null);
        delete this.orders[orderRef.key];
      }

  }

  appendOrderToView(order, before) {

    if (before)
      this.element.inner.insertBefore(order.element, this.element.inner.firstChild);
    else
      this.element.inner.appendChild(order.element);

  }

  isOpened(orderKey) {

    return !!this.currentOrdersView[orderKey];

  }

  open(orderKey = '', getFocus = false) {

    const self = this;

    setTimeout(() => {

      const order = self.orders[orderKey];

      if (order && !self.isOpened(orderKey)) {

        self.element.inner.insertBefore(order.element, self.element.inner.firstChild);
        self.currentOrdersView[orderKey] = order;
        order.init();

        if (getFocus)
          order.focus();

      }

    }, 10);

  }

  close(orderKey = '') {

    const order = this.orders[orderKey];

    if (order && this.currentOrdersView[orderKey]) {
      this.element.inner.removeChild(order.element);
      delete this.currentOrdersView[orderKey];
      order.destroy();
    }

  }

}
