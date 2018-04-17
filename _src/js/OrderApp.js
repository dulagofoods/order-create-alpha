class OrderApp {
  /*
  TODO vincular o gerenciador com agenda de contatos
   */

  constructor(element, databaseRef, socket) {

    this.element = element;
    this.databaseRef = databaseRef;
    this.socket = socket;

    this.ordersRef = this.databaseRef.ref('orders');
    this.ordersViewsRef = this.databaseRef.ref('ordersViews');

    this.orderList = new OrderList(this.ordersRef, false, 'OrderApp-list');
    this.orderTimeline = new Timeline(this.ordersRef, false, this.orderList, 'OrderApp-timeline');
    this.agenda = new Agenda(this.databaseRef, this.orderList, 'OrderApp-agenda');

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
      if (event.keyCode === 113 && event.shiftKey) {
        // shift + f2
        this.addNewOrderToList();
      } else if (event.keyCode === 114 && event.shiftKey) {
        // shift + f3
        event.preventDefault();
        console.log('pesquisando...');
      }
    });

  }

  build() {

    if (window.innerWidth < 601)
      this.element.classList.remove('is-timelineVisible');

    if (window.innerWidth > 1200)
      this.element.classList.add('is-agendaVisible');

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'OrderApp-inner';
    this.element.append(this.element.inner);

    this.element.header = this.buildHeaderElement();

    this.element.inner.appendChild(this.orderList.element);
    this.element.inner.appendChild(this.orderTimeline.element);
    this.element.inner.appendChild(this.agenda.element);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.element.inner.append(this.actionButtons);

    this.element.floatingActionButton = this.buildFloatingActionButton();

    if (window.innerWidth < 720)
      this.element.classList.toggle('is-timelineHidden');

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

    // brand
    element.nav.brandLogo = document.createElement('a');
    element.nav.brandLogo.className = 'brand-logo';
    element.nav.brandLogo.innerHTML = 'Du Lago App';
    element.nav.wrapper.appendChild(element.nav.brandLogo);

    // menu
    element.nav.menu = document.createElement('ul');
    element.nav.menu.className = 'right';
    element.nav.wrapper.appendChild(element.nav.menu);

    // agenda trigger
    element.nav.menu.agendaTrigger = document.createElement('li');
    element.nav.menu.appendChild(element.nav.menu.agendaTrigger);

    element.nav.menu.agendaTrigger.link = document.createElement('a');
    element.nav.menu.agendaTrigger.link.className = 'waves-effect waves-light';
    element.nav.menu.agendaTrigger.link.innerHTML = '<i class="material-icons">import_contacts</i>';
    element.nav.menu.agendaTrigger.link.addEventListener('click', () => this.element.classList.toggle('is-agendaVisible'));
    element.nav.menu.agendaTrigger.appendChild(element.nav.menu.agendaTrigger.link);

    // timeline trigger
    element.nav.menu.timelineTrigger = document.createElement('li');
    element.nav.menu.appendChild(element.nav.menu.timelineTrigger);

    element.nav.menu.timelineTrigger.link = document.createElement('a');
    element.nav.menu.timelineTrigger.link.className = 'waves-effect waves-light';
    element.nav.menu.timelineTrigger.link.innerHTML = '<i class="material-icons">view_list</i>';
    element.nav.menu.timelineTrigger.link.addEventListener('click', () => this.element.classList.toggle('is-timelineVisible'));
    element.nav.menu.timelineTrigger.appendChild(element.nav.menu.timelineTrigger.link);

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

    this.activeOrderKey = Order.create(this.ordersRef, this.activeOrdersViewRef).key;

    try {

      M.toast({
        html: 'Pedido Criado!',
        displayLength: 2000
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

}