class OrderApp {

  constructor(element, ordersRef) {

    this.element = element;
    this.ordersRef = ordersRef;
    this.orderList = [];

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

    this.createOrderButton = document.createElement('a');
    this.createOrderButton.className = 'waves-effect waves-light btn orange light-1';
    this.createOrderButton.innerHTML = 'Criar pedido';
    this.createOrderButton.addEventListener('click', () => {
      this.createOrder();
    });
    this.actionButtons.append(this.createOrderButton);

    this.floatingActionButton = this.buildFloatingActionButton();
    this.actionButtons.appendChild(this.floatingActionButton);

  }

  buildFloatingActionButton() {

    const element = document.createElement('div');
    element.className = 'fixed-action-btn';

    // btn element
    element.btn = document.createElement('a');
    element.btn.className = 'btn-floating btn-large orange light-1';
    element.appendChild(element.btn);
    // icon
    element.btn.icon = document.createElement('i');
    element.btn.icon.className = 'large material-icons';
    element.btn.icon.innerHTML = 'add';
    element.btn.append(element.btn.icon);

    // list element
    element.list = document.createElement('ul');
    element.appendChild(element.list);

    // fist link option
    element.list.first = document.createElement('li');
    element.list.first.btn = document.createElement('a');
    element.list.first.btn.className = 'btn-floating red ';
    element.list.first.btn.icon = document.createElement('i');
    element.list.first.btn.icon.innerText = 'P';
    // element.list.first.btn.icon.className = 'material-icons';
    // element.list.first.btn.icon.innerHTML = 'insert_chart';
    element.list.first.btn.appendChild(element.list.first.btn.icon);
    element.list.first.appendChild(element.list.first.btn);
    element.list.appendChild(element.list.first);
    element.list.first.btn.addEventListener('click', event => {
      this.createOrder();
    });

    element.instance = M.FloatingActionButton.init(element);

    return element;

  }

  createOrder() {

    this.ordersRef.push(true);

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushOrder(orderRef) {

    if (orderRef) {

      let order = new Order(orderRef);
      this.orderList.push(order);
      this.element.orderListElement.insertBefore(order.element, this.element.orderListElement.firstChild);

    }

  }

}