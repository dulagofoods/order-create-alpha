class Order {

  constructor(orderRef, autoInit) {

    this.orderRef = orderRef;
    this.orderKey = this.orderRef.key;

    this.createdTime = null;
    this.data = {};

    this.socket = socket;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.customer = new OrderCustomer(this.orderRef);
    this.items = new OrderItemList(this.orderRef);
    this.billing = new OrderBilling(this.orderRef);
    this.delivery = new OrderDelivery(this.orderRef);

    this.build();

    // action listener
    this.orderRef.on('value', snap => {

      this.data = snap.val();
      this.isArchived = !!snap.val().isArchived;
      this.isDeleted = !!snap.val().isDeleted;

      // is deleted
      if (this.isDeleted) {

        this.data = null;
        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'Order card grey lighten-5';
    this.element.dataset.orderRefKey = this.orderKey;

    this.element.contentElement = document.createElement('div');
    this.element.contentElement.className = 'Order-inner card-content';
    this.element.appendChild(this.element.contentElement);

    this.element.contentElement.appendChild(this.customer.element);
    this.element.contentElement.appendChild(this.items.element);
    this.element.contentElement.appendChild(this.billing.element);
    this.element.contentElement.appendChild(this.delivery.element);

    this.element.contentElement = this.buildPrintStatusElement();

    this.element.actions = this.buildActionsElement();

  }

  buildActionsElement() {

    const element = document.createElement('div');
    element.className = 'Order-inner card-action';
    this.element.appendChild(element);

    element.printButton = document.createElement('button');
    element.printButton.className = 'waves-effect waves-light-blue btn light-blue';
    element.printButton.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    element.printButton.addEventListener('click', () => {

      Order.print(this.orderRef, this.socket);

    });
    element.appendChild(element.printButton);

    element.deleteButton = document.createElement('button');
    element.deleteButton.className = 'waves-effect waves-red btn-flat red-text';
    element.deleteButton.innerHTML = '<i class="material-icons left">delete</i>Excluir';
    element.deleteButton.addEventListener('click', () => {

      if (window.confirm('Tem certeza?')) {

        this.delete();

        try {

          M.toast({
            html: 'Pedido Excluido!'
          });

        } catch (e) {

          console.log('materialize error');

        }

      }

    });
    element.appendChild(element.deleteButton);

    return element;

  }

  buildPrintStatusElement() {

    const element = document.createElement('span');
    element.className = 'Order-printStatus font-green';
    element.updateInterval = false;
    this.orderRef.child('printouts').on('value', snap => {

      if (snap.val()) {

        let printouts = false;

        if (!snap.val().printingTime)
          printouts = Object.values(snap.val());

        if (element.updateInterval)
          clearInterval(element.updateInterval);

        function updateText() {

          if (printouts)
            element.innerHTML = 'impresso' +
              ' ' + moment(printouts[printouts.length - 1].printingTime).fromNow() +
              ' (' + printouts.length +
              ' vez' + (printouts.length > 1 ? 'es)' : ')');
          else if (snap.val())
            element.innerHTML = 'impresso ' + moment(snap.val().printingTime).fromNow();

        }

        setTimeout(() => updateText(), 10);
        element.updateInterval = setInterval(() => updateText(), 5000);

      } else if (element.updateInterval) {

        clearInterval(element.updateInterval);

      }

    });
    this.element.contentElement.appendChild(element);

    return element;

  }

  focus() {

    this.customer.focus();

  }

  delete() {

    this.orderRef.child('isDeleted').set(moment().format());

  }

  static print(orderRef, socket) {

    if (socket) {

      orderRef.once('value', snap => {

        console.log(snap.val());

        try {
          console.log('enviando dados para impressao via socket...');
          socket.emit('print order', snap.val());
          orderRef.child('printouts').push({
            printingTime: moment().format()
          });
          console.log('impressão enviada');
        } catch (e) {
          console.log('erro no socket');
        }

      });

    }

  }

  static create(ordersRef, ordersViewRef = false, options = {}) {

    let createdTime = moment().toISOString();

    const orderRef = ordersRef.push({
      billing: {
        priceAmount: 0.00,
        priceAmountUnlocked: false
      },
      createdTime: createdTime,
      customer: {
        customerName: ''
      },
      delivery: false,
      isArchived: false,
      isDeleted: false
    }).ref;
    orderRef.child('items').push({
      itemPrice: 0.00,
      quantity: 1
    });
    orderRef.child('billing/payments').push({
      isDefault: true,
      method: 'money',
      paidValue: 0.00,
      referenceValue: 0.00
    });

    if (ordersViewRef)
      setTimeout(() => ordersViewRef.child(orderRef.key).set({
        createdTime: createdTime
      }), 1);

    if (options.customer) {

      let customerData = options.customer.data;

      orderRef.child('customer').set({
        customerName: customerData.customerName,
        customerContact: customerData.customerContact,
      });

      if (customerData.defaultAddress) {
        orderRef.child('delivery').set(true);
        orderRef.child('address').set(customerData.defaultAddress);
      }

    }

    return orderRef;

  }

}
