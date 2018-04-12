class OrderList {

  constructor(ordersRef, ordersViewRef = null, optionalClass = '') {

    this.ordersRef = ordersRef;
    this.ordersViewRef = ordersViewRef;
    this.optionalClass = optionalClass;

    this.element = document.createElement('div');

    this.orders = {};

    this.isLoaded = false;

    if (this.ordersRef && this.ordersViewRef)
      this.init();

  }

  init() {

    this.build();

    this.ordersViewRef.on('child_added', snap => this.pushOrder(this.ordersRef.child(snap.key), snap.val()));

    this.ordersRef.on('child_removed', snap => this.removeOrder(this.ordersRef.child(snap.key)));

    // faz algo aqui após a lista ser baixada
    this.ordersViewRef.once('value', snap => {

      this.buildView(!this.isLoaded);
      this.isLoaded = true;

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

  addOrder(orderRef, createdTime) {

    if (this.ordersViewRef)
      this.ordersViewRef.child(orderRef.key).set(createdTime);

  }

  pushOrder(orderRef, createdTime) {

    console.log(createdTime);

    if (orderRef)
      this.orders[orderRef.key] = new Order(orderRef);

    this.orders[orderRef.key].createdTime = moment(createdTime);

    if (this.isLoaded) {
      this.appendOrderToView(this.orders[orderRef.key], true);
      this.orders[orderRef.key].init();
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

}