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

    this.orderList = new OrderList(this.ordersRef, false, 'OrderApp-list');
    this.orderTimeline = new Timeline(this.ordersRef, false, this.orderList, 'OrderApp-timeline');

    this.activeOrderKey = false;

    this.init();

  }

  init() {

    this.build();

    // get ordersView child key
    this.activeOrdersViewRef = this.ordersViewsRef.child(moment().format('YYYY-MM-DD'));

    // init orderList
    this.orderList.ordersViewRef = this.activeOrdersViewRef;
    this.orderList.init();

    // init timeline
    this.orderTimeline.ordersViewRef = this.activeOrdersViewRef;
    this.orderTimeline.init();

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

    this.element.header = this.buildHeaderElement();

    this.element.inner.appendChild(this.orderList.element);
    this.element.inner.appendChild(this.orderTimeline.element);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.element.inner.append(this.actionButtons);

    this.element.floatingActionButton = this.buildFloatingActionButton();

    if (window.innerWidth < 720)
      this.element.toggle('is-timelineHidden');

  }

  buildHeaderElement() {

    const element = document.createElement('header');
    element.className = 'OrderApp-header navbar-fixed';
    this.element.inner.appendChild(element);

    element.nav = document.createElement('nav');
    element.nav.className = 'grey darken-4';
    element.appendChild(element.nav);

    element.nav.wrapper = document.createElement('div');
    element.nav.wrapper.className = 'nav-wrapper';
    element.nav.appendChild(element.nav.wrapper);

    element.nav.brandLogo = document.createElement('a');
    element.nav.brandLogo.className = 'brand-logo';
    element.nav.brandLogo.innerHTML = 'Du Lago App';
    element.nav.wrapper.appendChild(element.nav.brandLogo);

    element.nav.timelineTrigger = document.createElement('a');
    element.nav.timelineTrigger.className = 'sidenav-trigger';
    element.nav.timelineTrigger.style.float = 'right';
    element.nav.timelineTrigger.style.display = 'block';
    element.nav.timelineTrigger.href = '#';
    element.nav.timelineTrigger.innerHTML = '<i class="material-icons">view list</i>';
    element.nav.timelineTrigger.addEventListener('click', event => {

      event.preventDefault();

      this.element.classList.toggle('is-timelineHidden');

    });
    element.nav.wrapper.appendChild(element.nav.timelineTrigger);

    return element;

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
    order.once('value', snap => this.activeOrdersViewRef.child(order.key).set(snap.val().createdTime));

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

}