class Order {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.orderKey = this.orderRef.key;

    this.element = document.createElement('div');

    this.consumer = new OrderConsumer(this.orderRef);
    this.items = new OrderItemList(this.orderRef);
    this.payment = new OrderPayment(this.orderRef);
    this.delivery = new OrderDelivery();

    this.init();

  }

  init() {

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
    this.element.contentElement.appendChild(this.payment.element);

    this.buildActionsElement();

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'Order-inner card-action';
    this.element.appendChild(this.element.actionsElement);

    this.element.deleteOrderButtonElement = document.createElement('button');
    this.element.deleteOrderButtonElement.className = 'waves-effect waves-red btn-flat';
    this.element.deleteOrderButtonElement.innerHTML = '<i class="material-icons left">delete</i>Excluir';
    this.element.deleteOrderButtonElement.addEventListener('click', () => {

      this.delete();

    });
    this.element.actionsElement.appendChild(this.element.deleteOrderButtonElement);

    this.element.printOrderButtonElement = document.createElement('button');
    this.element.printOrderButtonElement.className = 'waves-effect waves-light-blue btn light-blue';
    this.element.printOrderButtonElement.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    this.element.printOrderButtonElement.addEventListener('click', () => {

      this.delete();

    });
    this.element.actionsElement.appendChild(this.element.printOrderButtonElement);

  }

  focus() {

    this.consumer.focus();

  }

  delete() {

    this.orderRef.set(null);

  }

  static create(ordersRef) {

    const orderRef = ordersRef.push().ref;
    orderRef.child('items').push({
      itemPrice: 0.00,
      quantity: 1
    });

    return orderRef;

  }

}