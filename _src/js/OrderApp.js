class OrderApp {
  /*
  TODO vincular o gerenciador com agenda de contatos
  TODO corrigir orientação das ruas
  TODO adicionar linha do tempo
   */

  constructor(element, databaseRef, socket) {

    this.element = element;
    this.databaseRef = databaseRef;
    this.socket = socket;

    this.ordersRef = this.databaseRef.ref('orders');
    this.ordersViewsRef = this.databaseRef.ref('ordersViews');

    this.orderList = new OrderList(this.ordersRef);

    this.activeOrderKey = false;

    this.init();

  }

  init() {

    this.build();

    let ordersViewKey = moment().format('YYYY-MM-DD');
    this.orderList.ordersViewRef = this.ordersViewsRef.child(ordersViewKey);
    this.orderList.init();

    this.orderList.ordersViewRef.on('child_added', snap => {

      if (this.activeOrderKey === snap.key)
          this.orderList.orders[snap.key].focus();

    });

    window.addEventListener('keydown', event => {
      if (event.keyCode === 113 && event.shiftKey)
        this.addNewOrderToList();
    });

  }

  build() {

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'OrderApp-inner';
    this.element.append(this.element.inner);

    this.element.inner.appendChild(this.orderList.element);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.element.inner.append(this.actionButtons);

    this.floatingActionButton = this.buildFloatingActionButton();

  }

  buildFloatingActionButton() {

    const element = document.createElement('div');
    element.className = 'fixed-action-btn';
    this.actionButtons.appendChild(element);

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
      this.addNewOrderToList();
    });

    element.instance = M.FloatingActionButton.init(element);

    return element;

  }

  addNewOrderToList() {

    const order = Order.create(this.ordersRef);
    this.activeOrderKey = order.key;
    order.once('value', snap => this.orderList.addOrder(order, snap.val().createdTime));

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

}