class Order {

  constructor(orderRef, socket, autoInit) {

    this.orderRef = orderRef;
    this.orderKey = this.orderRef.key;

    this.socket = socket || false;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.consumer = new OrderConsumer(this.orderRef);
    this.items = new OrderItemList(this.orderRef);
    this.billing = new OrderBilling(this.orderRef);
    this.delivery = new OrderDelivery(this.orderRef);

    this.build();

    // action listener
    this.orderRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

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

    this.element.contentElement.appendChild(this.consumer.element);
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
    element.deleteButton.className = 'waves-effect waves-red btn-flat';
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
    element.delay = false;
    this.orderRef.child('printouts').on('value', snap => {

      let time = 1000;

      if (element.delay) {
        clearInterval(element.delay);
        time = 5000;
      }

      element.delay = setInterval(() => {

        element.innerHTML = 'impresso ' + moment(snap.val().printingTime).fromNow();

      }, 5000);

    });
    this.element.contentElement.appendChild(element);

    return element;

  }

  focus() {

    this.consumer.focus();

  }

  delete() {

    this.orderRef.set(null);

  }

  static print(orderRef, socket) {

    if (socket) {

      orderRef.once('value', snap => {

        console.log(snap.val());

        console.log('enviando dados para impressao via socket...');
        socket.emit('print order', snap.val());

        orderRef.child('printouts').set({
          printingTime: moment().format()
        });

      });

    }

  }

  static create(ordersRef) {

    let createdTime = moment().toISOString();

    const orderRef = ordersRef.push({
      createdTime: createdTime,
      delivery: false
    }).ref;
    orderRef.child('items').push({
      itemPrice: 0.00,
      quantity: 1
    });

    return orderRef;

  }

}