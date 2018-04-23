class Order {

  constructor(orderRef = false, orderList = false, autoInit) {

    this.orderRef = orderRef;
    this.orderList = orderList;

    this.createdTime = null;
    this.isInited = false;
    this.data = {};

    this.socket = socket;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    if (!this.isInited) {

      this.isInited = true;

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

  }

  build() {

    this.element.className = 'Order card grey lighten-5';
    this.element.dataset.orderRefKey = this.orderRef.key;

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
    element.printButton.className = 'left waves-effect waves-green btn light-blue';
    element.printButton.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    element.printButton.addEventListener('click', () => {

      Order.print(this.orderRef, this.socket);

    });
    element.appendChild(element.printButton);

    element.saveButton = document.createElement('button');
    element.saveButton.className = 'left waves-effect waves-orange btn-flat orange-text';
    element.saveButton.innerHTML = '<span class="hide-on-med-and-down"><i class="material-icons left">save</i>Salvar</span>' +
      '<span class="hide-on-large-only"><i class="material-icons">save</i></span>';
    element.saveButton.addEventListener('click', () => {

      this.orderRef.once('value', snap => {

        let data = snap.val();
        let customerRefKey = data.customer.customerRefKey;

        try {

          data = {
            customerName: data.customer.customerName,
            customerContact: '',
            defaultAddress: data.address || {
              street: '',
              houseNumber: '',
              neighborhood: '',
              addressReference: ''
            }
          };

          if (customerRefKey) {
            AgendaCustomer.update(customerRefKey, data);
          } else {
            customerRefKey = AgendaCustomer.create(data).key;
            this.orderRef.child('customer/customerRefKey').set(customerRefKey);
          }

        } catch (e) {
          console.log(e);
        }

      })

    });
    element.appendChild(element.saveButton);

    element.deleteButton = document.createElement('button');
    element.deleteButton.className = 'left waves-effect waves-red btn-flat red-text';
    element.deleteButton.innerHTML = '<span><i class="material-icons">delete</i></span>';
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

    element.closeButton = document.createElement('button');
    element.closeButton.className = 'right waves-effect waves-light btn-flat';
    element.closeButton.innerHTML = '<span class="hide-on-med-and-down"><i class="material-icons left">close</i>Fechar</span>' +
      '<span class="hide-on-large-only"><i class="material-icons">close</i></span>';
    element.closeButton.addEventListener('click', () => this.orderList.close(this.orderRef.key));
    element.appendChild(element.closeButton);

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

  destroy() {

    this.orderRef.off();
    this.isInited = false;

    while (this.element.firstChild)
      this.element.removeChild(this.element.firstChild);

  }

  static parseValue(value = 0, toString = false) {

    try {
      value = parseFloat(value);
      value = isNaN(value) ? parseFloat(0) : value;
    } catch (e) {
      value = parseFloat(0);
    }

    if (toString)
      return parseFloat(value).toFixed(2);
    else
      return parseFloat(value);

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

  static create(ordersRef = false, ordersViewRef = false, options = {}) {

    if (ordersRef || databaseRef) {

      ordersRef = ordersRef ? ordersRef : databaseRef.ref('orders');
      ordersViewRef = ordersViewRef ? ordersViewRef : databaseRef.ref('ordersViews').child(moment().format('YYYY-MM-DD'));

      let createdTime = moment().toISOString();

      // push new order
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

      // add default items
      orderRef.child('items').push({
        itemPrice: 0.00,
        quantity: 1
      });

      // add default payments
      OrderPaymentItem.create(orderRef.child('billing'));

      if (ordersViewRef)
        setTimeout(() => ordersViewRef.child(orderRef.key).set({
          createdTime: createdTime
        }), 1);

      if (options.customer) {

        let customerKey = options.customer.customerRef.key;
        let customerData = options.customer.data;

        orderRef.child('customer').set({
          customerRefKey: customerKey,
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

    return false;

  }

}
