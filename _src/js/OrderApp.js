class OrderApp {

  constructor(element, ordersRef, socket) {

    this.element = element;
    this.ordersRef = ordersRef;
    this.socket = socket;

    this.orderList = [];

    this.activeOrderKey = false;


    this.init();

  }

  init() {

    this.build();

    this.ordersRef.on('child_added', snap => {

      this.pushOrder(snap.ref);

    });

  }

  build() {

    this.innerElement = document.createElement('div');
    this.innerElement.className = 'OrderApp-inner';
    this.element.append(this.innerElement);

    this.element.orderListElement = document.createElement('div');
    this.element.orderListElement.className = 'OrderApp-orderList';
    this.innerElement.append(this.element.orderListElement);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.innerElement.append(this.actionButtons);

    this.floatingActionButton = this.buildFloatingActionButton();
    this.actionButtons.appendChild(this.floatingActionButton);

  }

  buildFloatingActionButton() {

    const element = document.createElement('div');
    element.className = 'fixed-action-btn';

    // btn element
    element.btn = document.createElement('a');
    element.btn.className = 'waves-effect waves-light btn-floating btn-large orange light-1';
    element.appendChild(element.btn);
    // icon
    element.btn.icon = document.createElement('i');
    element.btn.icon.className = 'large material-icons';
    element.btn.icon.innerHTML = 'add';
    element.btn.append(element.btn.icon);
    element.btn.addEventListener('click', event => {
      this.createOrder();
    });

    // list element
    // element.list = document.createElement('ul');
    // element.appendChild(element.list);

    // fist link option
    // element.list.first = document.createElement('li');
    // element.list.first.btn = document.createElement('a');
    // element.list.first.btn.className = 'btn-floating red ';
    // element.list.first.btn.icon = document.createElement('i');
    // element.list.first.btn.icon.className = 'material-icons';
    // element.list.first.btn.icon.innerHTML = 'insert_chart';
    // element.list.first.btn.appendChild(element.list.first.btn.icon);
    // element.list.first.appendChild(element.list.first.btn);
    // element.list.appendChild(element.list.first);

    element.instance = M.FloatingActionButton.init(element);

    return element;

  }

  createOrder() {

    this.activeOrderKey = Order.create(this.ordersRef).key;

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushOrder(orderRef) {

    let self = this;

    if (orderRef) {

      let order = new Order(orderRef, this.socket);
      this.orderList.push(order);
      this.element.orderListElement.insertBefore(order.element, this.element.orderListElement.firstChild);

      // seta o focus para o pedido
      setTimeout(function () {

        if (self.activeOrderKey === orderRef.key)
          order.focus();

      }, 1);

    }

  }

}