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
    this.priceAmount = new OrderPriceAmount(this.orderRef);
    this.delivery = new OrderDelivery();

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

    this.element.contentElement = document.createElement('div');
    this.element.contentElement.className = 'Order-inner card-content';
    this.element.appendChild(this.element.contentElement);

    this.element.contentElement.appendChild(this.consumer.element);
    this.element.contentElement.appendChild(this.items.element);
    this.element.contentElement.appendChild(this.priceAmount.element);

    this.buildActionsElement();

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'Order-inner card-action';
    this.element.appendChild(this.element.actionsElement);

    this.element.printOrderButtonElement = document.createElement('button');
    this.element.printOrderButtonElement.className = 'waves-effect waves-light-blue btn light-blue';
    this.element.printOrderButtonElement.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    this.element.printOrderButtonElement.addEventListener('click', () => {

      Order.print(this.orderRef, this.socket);

    });
    this.element.actionsElement.appendChild(this.element.printOrderButtonElement);

    this.element.deleteOrderButtonElement = document.createElement('button');
    this.element.deleteOrderButtonElement.className = 'waves-effect waves-red btn-flat';
    this.element.deleteOrderButtonElement.innerHTML = '<i class="material-icons left">delete</i>Excluir';
    this.element.deleteOrderButtonElement.addEventListener('click', () => {

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
    this.element.actionsElement.appendChild(this.element.deleteOrderButtonElement);

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

        console.log('enviando dados para impressao via socket...');
        socket.emit('print order', snap.val());

      });

    }

  }

  static create(ordersRef) {

    let createdTime = moment().toISOString();

    const orderRef = ordersRef.push({
      createdTime: createdTime
    }).ref;
    orderRef.child('items').push({
      itemPrice: 0.00,
      quantity: 1
    });

    return orderRef;

  }

}