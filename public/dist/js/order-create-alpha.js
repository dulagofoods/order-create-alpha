class Agenda {

  constructor(app = false, optionalClass, autoInit = true) {

    if (app) {

      this.app = app;
      this.optionalClass = optionalClass;

      // define database listeners
      this.customersRef = this.app.databaseRef.ref('customers');
      this.orderList = this.app.orderList;

      this.element = document.createElement('div');
      this.customers = {};
      this.isLoaded = false;
      this.isVisible = false;

      if (this.customersRef && autoInit)
        this.init();

    }

  }

  init() {

    this.isLoaded = true;

    this.build();

    this.customersRef.orderByChild('usageCounter').on('child_added', snap => {

      const customer = new AgendaCustomer(snap.ref, this);
      this.element.customersList.insertBefore(customer.element, this.element.customersList.firstChild);
      this.customers[snap.key] = customer;

    });

  }

  build() {

    this.element.className = 'Agenda';
    this.element.classList.add(this.optionalClass || '');

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Agenda-inner';
    this.element.appendChild(this.element.inner);

    this.element.header = document.createElement('nav');
    this.element.header.className = 'Agenda-header';
    this.element.inner.appendChild(this.element.header);

    this.element.searchBar = this.buildSearchBarElement();

    this.element.customersList = document.createElement('div');
    this.element.customersList.className = 'Agenda-customersList';
    this.element.inner.appendChild(this.element.customersList);

  }

  buildSearchBarElement() {

    const element = document.createElement('nav');
    element.className = 'nav-wrapper grey darken-2';
    this.element.header.appendChild(element);

    element.inputField = document.createElement('div');
    element.inputField.className = 'input-field';
    element.appendChild(element.inputField);

    element.input = document.createElement('input');
    element.input.id = 'search';
    element.input.type = 'search';
    element.input.placeholder = 'Busque pelo nome'
    element.input.required = true;
    element.input.addEventListener('input', () => this.search(element.input.value));
    element.inputField.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.className = 'label-icon';
    element.label.htmlFor = 'search';
    element.label.innerHTML = '<i class="material-icons">search</i>';
    element.inputField.appendChild(element.label);

    element.closeIcon = document.createElement('i');
    element.closeIcon.className = 'material-icons';
    element.closeIcon.innerHTML = 'close';
    element.closeIcon.addEventListener('click', () => {
      this.search('');
      element.input.value = '';
    });
    element.inputField.appendChild(element.closeIcon);

    return element;

  }

  search(queryString = '') {

    if (queryString.length > 1) {

      queryString = queryString.toLowerCase();

      let dataArray = Object.values(this.customers);

      let query = dataArray.filter(customer => {
        return customer.data.customerName.toLowerCase().includes(queryString);
      });

      while (this.element.customersList.firstChild)
        this.element.customersList.removeChild(this.element.customersList.firstChild);

      query.forEach(customer => {
        this.element.customersList.insertBefore(customer.element, this.element.customersList.firstChild);
      });

    } else {

      Object.values(this.customers).forEach(customer => {
        this.element.customersList.insertBefore(customer.element, this.element.customersList.firstChild);
      });

    }

  }

  toggle() {

    if (this.isVisible)
      this.inactive();
    else
      this.active();

  }

  active() {

    if (this.app.element)
      this.app.element.classList.add('is-agendaVisible');

    this.isVisible = true;

    if (!this.isLoaded)
      this.init();

  }

  inactive() {

    if (this.app.element)
      this.app.element.classList.remove('is-agendaVisible');

    this.isVisible = false;

  }

}

class AgendaCustomer {

  constructor(customerRef = false, agenda = false) {

    this.customerRef = customerRef;
    this.agenda = agenda;

    this.orderList = this.agenda.orderList;

    this.element = document.createElement('div');
    this.data = false;

    this.init();

  }

  init() {

    this.build();

    this.customerRef.on('value', snap => this.data = snap.val());

  }

  build() {

    this.element.className = 'AgendaCustomer';
    this.element.dataset.customerRefKey = this.customerRef.key;

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'AgendaCustomer-inner';
    this.element.appendChild(this.element.inner);

    // content
    this.element.content = document.createElement('div');
    this.element.content.className = 'AgendaCustomer-content';
    this.element.inner.appendChild(this.element.content);

    this.element.customerName = this.buildCustomerNameElement();
    this.element.address = this.buildAddressElement();

    // actions
    this.element.actions = document.createElement('div');
    this.element.actions.className = 'AgendaCustomer-actions';
    this.element.inner.appendChild(this.element.actions);

    this.element.createOrderButton = this.buildCreateOrderButtonElement();

  }

  buildCustomerNameElement() {

    const element = document.createElement('div');
    element.className = 'AgendaCustomer-customerName';
    this.element.content.appendChild(element);

    element.span = document.createElement('span');
    this.customerRef.child('customerName').on('value', snap => {
      element.span.innerHTML = snap.val();
    });
    element.appendChild(element.span);

    return element;

  }

  buildAddressElement() {

    const element = document.createElement('div');
    element.className = 'AgendaCustomer-address';
    this.element.content.appendChild(element);

    element.streetLine = document.createElement('span');
    element.streetLine.className = 'AgendaCustomer-streetLine';
    element.appendChild(element.streetLine);

    element.neighborhood = document.createElement('span');
    element.neighborhood.className = 'AgendaCustomer-neighborhood';
    element.appendChild(element.neighborhood);

    element.note = document.createElement('span');
    element.note.className = 'AgendaCustomer-note';
    element.appendChild(element.note);

    this.customerRef.child('defaultAddress').on('value', snap => {

      const address = snap.val();

      if (address) {

        if (address.street)
          element.streetLine.innerHTML = address.street;

        if (address.houseNumber)
          element.streetLine.innerHTML += ', ' + address.houseNumber;

        if (address.neighborhood)
          element.neighborhood.innerHTML = address.neighborhood;

      }

    });

    return element;

  }

  buildCreateOrderButtonElement() {

    const element = document.createElement('a');
    element.className = 'btn-small waves-effect waves-light light-blue';
    element.addEventListener('click', () => {

      let order = Order.create(false, false, {customer: this});
      if (order) {
        this.customerRef.child('usageCounter').once('value', snap => snap.ref.set(snap.val() + 1));
        this.customerRef.child('lastOrder').set(moment().format());
        this.customerRef.child('orders/' + order.key).set(true);
        this.orderList.open(order.key);
        if (window.innerWidth < 1200)
          this.agenda.inactive();
      }

      try {
        M.toast({
          html: 'Pedido Criado!',
          displayLength: 2000
        });
      } catch (e) {
        console.log('materialize error');
      }

    });
    this.element.actions.appendChild(element);

    element.icon = document.createElement('i');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'content_copy';
    element.appendChild(element.icon);

    return element;

  }

  static create(data) {

    if (databaseRef) {

      const customerRef = databaseRef.ref('customers').push(data).ref;
      customerRef.child('createdTime').set(moment().format());

      return customerRef;

    }

    return {key: null};

  }

  static update(customerKey, data) {

    if (databaseRef)
      return databaseRef.ref('customers').child(customerKey).update(data);

    return {key: null};

  }

}
class Grid {

  constructor(element) {

    this.element = element;

    this.itemList = [];

    // id manager
    this.itemCount = 0;

    this.defaultColumnsNumber = 3;
    this.defaultItemWidth = 240;
    this.defaultMarginSize = 16;

    this.currentMatrixView = [[]];

    this.resize();

  }

  resize() {

    const width = (this.defaultItemWidth * this.defaultColumnsNumber)
      + ((this.defaultColumnsNumber + 1) * this.defaultMarginSize);
    this.element.style.width = width + 'px';

    const height = Grid.getLargestColumnHeight(this.currentMatrixView)
      + ((this.currentMatrixView[0].length + 1) * this.defaultMarginSize);
    this.element.style.height = height + 'px';

  }

  addItem() {

    const item = new GridItem(this, this.itemCount++, true);

    this.element.appendChild(item.element);
    this.paymentList.push(item);

    console.clear();
    console.log('Items criados: ' + this.paymentList.length);
    console.log(Grid.getItemPosition(this.paymentList.length - 1, this.defaultColumnsNumber));

    this.reOderView();

  }

  reOderView() {

    this.updateCurrentMatrixView();

    for (let column = 0; column < this.currentMatrixView.length; column++) {

      for (let row = 0; row < this.currentMatrixView[column].length; row++) {

        const item = this.currentMatrixView[column][row];

        if (item) {

          let translateX = this.getTranslateX(column);
          let translateY = this.getTranslateY(column, row);

          item.resize(this.defaultItemWidth, 0);
          item.translate(translateX, translateY);

        }

      }

    }

    this.resize();

  }

  updateCurrentMatrixView() {

    console.log(this.paymentList);
    let itemList = this.paymentList.slice().reverse();
    this.currentMatrixView = Grid.getMatrixView(paymentList, this.defaultColumnsNumber);
    console.log(this.currentMatrixView);

  }

  getTranslateY(column, row) {

    let translate = 0;

    let count = 0;

    this.currentMatrixView[column].forEach(item => {

      if (count < row)
        if (item)
          translate += item.element.offsetHeight;

      count++;

    });

    if (row > 0)
      translate += row * this.defaultMarginSize;

    return translate;

  }

  getTranslateX(column) {

    let translate = this.defaultItemWidth * column;

    if (column > 0)
      translate += column * this.defaultMarginSize;

    return translate;

  }

  static getLargestColumnHeight(matrixView) {

    let largestColumnIndex = false;
    let largestColumnHeight = false;

    for (let col = 0; col < matrixView.length; col++) {

      let column = matrixView[col];
      let columnHeight = 0;

      column.forEach(item => {

        if (item)
          columnHeight += item.element.offsetHeight;

      });

      if (largestColumnHeight) {

        if (columnHeight > largestColumnHeight) {

          largestColumnIndex = col;
          largestColumnHeight = columnHeight;

        }

      } else {

        largestColumnIndex = col;
        largestColumnHeight = columnHeight;

      }

    }

    return largestColumnHeight;

  }

  static getMatrixView(itemList, columnsNumber) {

    let matrixView = [];

    // contrói a matriz
    for (let i = 0; i < columnsNumber; i++) {
      matrixView.push([]);
      for (let j = 0; j < paymentList.length / columnsNumber; j++)
        matrixView[i].push(false);
    }

    // passa por todos items e os coloca na melhor posiçao
    for (let i = 0; i < paymentList.length; i++) {

      const row = Grid.getRowPosition(i, columnsNumber);
      matrixView[Grid.getSmallestColumn(matrixView, row)][row] = paymentList[i];

    }

    return matrixView;

  }

  static getSmallestColumn(matrixView, row) {

    let smallestColumnIndex = 0;
    let smallestColumnHeight = 0;

    for (let col = 0; col < matrixView.length; col++) {

      if (row > 0) {

        let columnHeight = 0;

        matrixView[col].forEach(item => {
          if (item)
            columnHeight += item.element.offsetHeight;
        });

        if (columnHeight < smallestColumnHeight || smallestColumnHeight === 0) {
          smallestColumnHeight = columnHeight;
          smallestColumnIndex = col;
        }

      } else if (!matrixView[col][row]) {

        smallestColumnIndex = col;
        break;

      }

    }

    return smallestColumnIndex;

  }

  static getItemPosition(i, columnsNumber) {

    return {
      column: Grid.getColumnPosition(i, columnsNumber),
      row: Grid.getRowPosition(i, columnsNumber)
    }

  }

  // item column
  static getColumnPosition(i, columnsNumber) {

    return parseInt((i - (Grid.getRowPosition(i, columnsNumber) * columnsNumber)).toString(), 10);

  }

  // item row
  static getRowPosition(i, columnsNumber) {

    return parseInt(Math.abs(i / columnsNumber).toString(), 10);

  }

}
class GridItem {

  constructor(parentGrid, id, buildElement) {

    this.parentGrid = parentGrid;

    if (buildElement)
      this.build(id);

  }

  build() {

    this.element = document.createElement('div');
    this.element.className = 'Item';
    this.element.dataset.id = this.id;

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Item-inner';
    this.element.inner.innerHTML = this.id;
    this.element.appendChild(this.element.inner);

  }

  resize(width, height) {

    this.element.style.width = width + 'px';

  }

  translate(tx, ty) {

    tx = tx + 'px';
    ty = ty + 'px';

    this.element.style.transform = 'translate3d(' + tx + ', ' + ty + ',0)';

  }

}
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

  destroy() {

    this.orderRef.off();
    this.isInited = false;

    while (this.element.firstChild)
      this.element.removeChild(this.element.firstChild);

  }

}

class OrderApp {

  constructor(element, databaseRef, socket) {

    this.element = element;
    this.databaseRef = databaseRef;
    this.socket = socket;

    // define database instances
    this.ordersRef = this.databaseRef.ref('orders');
    this.ordersViewsRef = this.databaseRef.ref('ordersViews');
    this.activeOrdersViewRef = this.ordersViewsRef.child(moment().format('YYYY-MM-DD'));

    // define components instances
    this.orderList = new OrderList(this, 'OrderApp-list', true);
    this.timeline = new Timeline(this, 'OrderApp-timeline', true);
    this.agenda = new Agenda(this, 'OrderApp-agenda', false);

    this.activeOrderRef = false;

    this.init();

  }

  init() {

    this.build();

    this.orderList.ordersViewRef.on('child_added', snap => {

      if (this.activeOrderRef)
        if (this.activeOrderRef.key === snap.key)
          this.orderList.open(snap.key, true);

      this.activeOrderRef = false;

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

    this.timeline.active(this.element);

    if (window.innerWidth < 601)
      this.timeline.inactive(this.element);

    if (window.innerWidth > 1200)
      this.agenda.active(this.element);

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'OrderApp-inner';
    this.element.append(this.element.inner);

    this.element.header = this.buildHeaderElement();

    this.element.inner.appendChild(this.orderList.element);
    this.element.inner.appendChild(this.timeline.element);
    this.element.inner.appendChild(this.agenda.element);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.element.inner.append(this.actionButtons);

    this.element.floatingActionButton = this.buildFloatingActionButton();

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
    element.nav.menu.agendaTrigger.link.addEventListener('click', () => this.agenda.toggle());
    element.nav.menu.agendaTrigger.appendChild(element.nav.menu.agendaTrigger.link);

    // timeline trigger
    element.nav.menu.timelineTrigger = document.createElement('li');
    element.nav.menu.appendChild(element.nav.menu.timelineTrigger);

    element.nav.menu.timelineTrigger.link = document.createElement('a');
    element.nav.menu.timelineTrigger.link.className = 'waves-effect waves-light';
    element.nav.menu.timelineTrigger.link.innerHTML = '<i class="material-icons">view_list</i>';
    element.nav.menu.timelineTrigger.link.addEventListener('click', () => this.timeline.toggle());
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

    this.activeOrderRef = Order.create(this.ordersRef, this.activeOrdersViewRef);

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

class OrderBilling {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.priceAmount = new OrderPriceAmount(this.orderRef);
    this.paymentList = new OrderPaymentList(this.orderRef);

    this.build();

  }

  build() {

    this.element.className = 'OrderBilling row';

    this.element.appendChild(this.priceAmount.element);
    this.element.appendChild(this.paymentList.element);

  }

}
class OrderCustomer {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.customerRef = this.orderRef.child('customer');

    this.element = document.createElement('div');

    this.build();

  }

  build() {

    this.element.className = 'OrderCustomer row';

    this.element.customerName = this.buildCustomerNameFieldElement();
    this.element.deliveryTime = this.buildDeliveryTimeFieldElement();

  }

  buildCustomerNameFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderCustomer-customerNameField input-field col s8';
    this.element.appendChild(element);

    // input
    element.input = document.createElement('input');
    element.input.className = 'validate';
    element.input.id = this.orderRef.key + '-customerName';
    element.input.type = 'text';
    element.input.addEventListener('input', () => {

      this.customerRef.child('customerName').set(element.input.value);

    });
    this.customerRef.child('customerName').on('value', snap => {

      if (snap.val() !== element.input.value)
        element.input.value = snap.val();

    });
    element.appendChild(element.input);

    // label
    element.label = document.createElement('label');
    this.customerRef.child('customerName').on('value', snap => {
      if (snap.val()) element.label.classList = 'active';
    });
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Nome';
    element.appendChild(element.label);

    M.updateTextFields();

    return element;

  }

  buildDeliveryTimeFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderCustomer-deliveryTime input-field col s4';
    this.element.appendChild(element);

    // input
    element.input = document.createElement('input');
    element.input.id = this.orderRef.key + '-customerName';
    element.input.type = 'time';
    element.input.step = '300';
    element.input.value = '';
    element.input.addEventListener('focus', () => {

      this.orderRef.child('deliveryTime').set(moment().add(20, 'minutes').format('HH:mm'));
      element.input.select();

    });
    element.input.addEventListener('input', () => {

      this.orderRef.child('deliveryTime').set(element.input.value);

    });
    this.orderRef.child('deliveryTime').once('value', snap => {

      if (!snap.val())
        this.orderRef.child('deliveryTime').set(moment().add(20, 'minutes').format('HH:mm'));

    });
    this.orderRef.child('deliveryTime').on('value', snap => {

      element.input.value = snap.val();

    });
    element.appendChild(element.input);

    // label
    element.label = document.createElement('label');
    element.label.className = 'active';
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Entrega';
    element.appendChild(element.label);

    M.updateTextFields();

    return element;

  }

  focus() {

    try {
      this.element.customerName.input.focus();
    } catch (e) {
      console.log(e);
    }

  }

}
class OrderDelivery {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

  }

  build() {

    this.element.className = 'OrderDelivery row';

    this.element.action = this.buildActionElement();

    this.element.address = this.buildAddressFormElement();
    this.element.address.street = this.streetElement();
    this.element.address.houseNumber = this.buildHouseNumberElement();
    this.element.address.neighborhood = this.buildNeighborhoodElement();
    this.element.address.addressReference = this.buildAddressReferenceElement();

  }

  buildActionElement() {

    let element = document.createElement('div');
    element.className = 'OrderDelivery-action switch col s12';

    element.label = document.createElement('label');
    element.appendChild(element.label);

    element.label.textOff = document.createTextNode('retirada');
    element.label.appendChild(element.label.textOff);

    element.input = document.createElement('input');
    element.input.type = 'checkbox';
    element.input.addEventListener('change', event => {

      this.orderRef.child('delivery').set(element.input.checked);

    });
    this.orderRef.child('delivery').on('value', snap => {

      element.input.checked = !!snap.val();

      if (!!snap.val())
        this.element.classList.add('is-active');
      else
        this.element.classList.remove('is-active');

    });
    element.label.appendChild(element.input);

    element.label.lever = document.createElement('span');
    element.label.lever.className = 'lever';
    element.label.appendChild(element.label.lever);

    element.label.textOn = document.createTextNode('entrega');
    element.label.appendChild(element.label.textOn);

    this.element.appendChild(element);

    return element;

  }

  buildAddressFormElement() {

    let element = document.createElement('div');
    element.className = 'OrderDelivery-addressForm row';

    this.element.appendChild(element);

    return element;

  }

  streetElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s9';
    this.element.address.appendChild(element);

    element.input = document.createElement('input');
    element.input.className = 'autocomplete';
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressStreet';
    element.input.addEventListener('focus', event => {

      element.input.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.input, {
          data: {
            "R Ricieri Ticianelli": null,

            "Av Azarias Vieira de Rezende": "/dist/images/districts/CL.png",
            "Av Comendador L Meneghel": "/dist/images/districts/CL.png",
            "R Pref José Mario Junqueira": "/dist/images/districts/CL.png",

            "R Vereador Dino Veiga": "/dist/images/districts/LC.png",
            "R Benjamin Caetano Zambon": "/dist/images/districts/LC.png",
            "R Benedito Bernardes de Oliveira": "/dist/images/districts/LC.png",

            "Av Bandeirantes": "/dist/images/districts/NC.png",

            "R São Paulo": "/dist/images/districts/NCS.png",
            "Av Pref Moacir Castanho": "/dist/images/districts/NCS.png",
            "R Eurípides Rodrigues": "/dist/images/districts/NCS.png",
            "R Juvenal Mesquita": "/dist/images/districts/NCS.png",
            "R Frei Rafael Proner": "/dist/images/districts/NCS.png",
            "Av Edelina Meneghel Rando": "/dist/images/districts/NCS.png",

            "R João Francisco Ferreira": "/dist/images/districts/NL.png",

            "R Guilherme Sachs": "/dist/images/districts/SO.png",
            "R Teodoro Bonfante": "/dist/images/districts/SO.png",

            // C
            "Av Benedito Leite de Negreiros": "/dist/images/districts/C.png",
            "R Artur Emílio Leopoldo Conter": "/dist/images/districts/C.png",

            // L
            "R Manoel Nascimento Trindade": "/dist/images/districts/LPROMO.png",
            "R Ciriaco Russo": "/dist/images/districts/LPROMO.png",
            "R Francisco Presbítero Nogueira": "/dist/images/districts/LPROMO.png",
            "Av Tiradentes": "/dist/images/districts/LPROMO.png",
            "R Fibolito": "/dist/images/districts/LPROMO.png",
            "R José de Oliveira": "/dist/images/districts/LPROMO.png",
            "R Dr Yves Ribeiro": "/dist/images/districts/LPROMO.png",
            "R Maria Ligia Ribeiro Conter (R Rubi)": "/dist/images/districts/LPROMO.png",
            "R Gilberto Freire": "/dist/images/districts/LPROMO.png",
            "R Shiniti Sassatani": "/dist/images/districts/LPROMO.png",
            "R Benedito José de Andrade": "/dist/images/districts/LPROMO.png",
            "R Yuzo Ochiai": "/dist/images/districts/LPROMO.png",
            "R Piracicaba": "/dist/images/districts/LPROMO.png",
            "R José Mendes Vilela": "/dist/images/districts/LPROMO.png",
            "R Joversino de Assis Teixeira": "/dist/images/districts/LPROMO.png",
            "R Vicente Inácio Filho": "/dist/images/districts/LPROMO.png",
            "R Irenice Guardiana Patrocinio": "/dist/images/districts/LPROMO.png",
            "R Ademar Francisco Mateus": "/dist/images/districts/L.png",
            "R Mauricio Antônio Ribeiro": "/dist/images/districts/L.png",
            "R Irma Domingas Anna Pitchuk": "/dist/images/districts/L.png",
            "R José Manoel Ramos": "/dist/images/districts/L.png",
            "R Idalino Cipriano Carneiro": "/dist/images/districts/L.png",

            // N
            "R Estevan Leite de Negreiros": "/dist/images/districts/N.png",
            "R Carmelo Comegno": "/dist/images/districts/N.png",
            "R Roberto Von Der Osten": "/dist/images/districts/N.png",
            "R Salvador Chianca": "/dist/images/districts/N.png",
            "Av Francisco Alves Pereira": "/dist/images/districts/N.png",
            "R Osvaldo Barbosa": "/dist/images/districts/N.png",
            "R Sebastião Jacinto da Silva": "/dist/images/districts/N.png",
            "R Hidekiti Hassegawa": "/dist/images/districts/N.png",
            "R Elisio Manoel dos Santos": "/dist/images/districts/N.png",
            "R Fioravante Malaghini": "/dist/images/districts/N.png",
            "R Antonio Tome": "/dist/images/districts/N.png",
            "R Francisca Alvares Morilha": "/dist/images/districts/N.png",
            "R Alberto Faria Cardoso": "/dist/images/districts/N.png",
            "R Nicolas Sanches Garrido": "/dist/images/districts/N.png",
            "R Sebastião Nogueira da Silva": "/dist/images/districts/N.png",
            "R José Altizani": "/dist/images/districts/N.png",
            "R Luis Dias": "/dist/images/districts/N.png",
            "R Salvador Martines Sanches": "/dist/images/districts/N.png",
            "R Claudio dos Santos": "/dist/images/districts/N.png",
            "R Massao Kamiama": "/dist/images/districts/N.png",
            "R Claudio dos Santos": "/dist/images/districts/N.png",
            "R Isaura Matsubara": "/dist/images/districts/N.png",
            "R Antonio Alvares Torres": "/dist/images/districts/N.png",
            "R Projetada I": "/dist/images/districts/N.png",
            "R Gregorio Magalhães Trindade": "/dist/images/districts/N.png",
            "R Antonio Ranazzi Bentivenha": "/dist/images/districts/N.png",
            "R Francisco Gomes Nogueira": "/dist/images/districts/N.png",

            // O
            "R Antonio Rossi": "/dist/images/districts/O.png",
            "R Nair Galvao Cioff": "/dist/images/districts/O.png",
            "R João Vilar Garcia": "/dist/images/districts/O.png",
            "R Celso Marcondes": "/dist/images/districts/O.png",
            "R Antonio Orozimbo da Silva": "/dist/images/districts/O.png",
            "R José Carvalho da Silva": "/dist/images/districts/O.png",
            "Colegio Sesi": "/dist/images/districts/O.png",

            // S
            "R Joaquim Pereira Bueno": "/dist/images/districts/S.png",
            "R dos Expedicionários": "/dist/images/districts/S.png",
            "R Pastor João José": "/dist/images/districts/S.png",
            "R Sebastião Faria": "/dist/images/districts/S.png",
            "R Pref Rafael Antonaci": "/dist/images/districts/S.png",
            "R Emilio Luciano": "/dist/images/districts/S.png",
            "R Wantuil Goularte Barbosa": "/dist/images/districts/S.png",
            "R Antonio Candido Zulmires de Campos": "/dist/images/districts/S.png",
            "R Vereador Vicente Rodrigues de Matos": "/dist/images/districts/S.png",
            "Av João da Silva Cravo": "/dist/images/districts/S.png",
            "Av das Torres": "/dist/images/districts/S.png",
            "R Pedro Tiago de Almeida": "/dist/images/districts/S.png",

            "": null,
          },
          minLength: 1,
          limit: 6
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    this.orderRef.child('address/street').on('value', snap => {
      element.input.value = snap.val();
      // console.log(snap.val());
    });
    element.input.addEventListener('change', () => {

      this.orderRef.child('address/street').set(element.input.value);

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Rua';
    this.orderRef.child('address/street').on('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

  }

  buildHouseNumberElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s3';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderRef.key + '-addressHouseNumber';
    element.input.addEventListener('input', () => this.orderRef.child('address/houseNumber').set(element.input.value));
    this.orderRef.child('address/houseNumber').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Número';
    this.orderRef.child('address/houseNumber').on('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildNeighborhoodElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';
    this.element.address.appendChild(element);

    element.input = document.createElement('input');
    element.input.className = 'autocomplete';
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressNeighborhood';
    element.input.addEventListener('focus', event => {

      element.input.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.input, {
          data: {
            "Centro": null,
            "Vila Maria Alice (LESTE)": null,
            "Vila Maria (LESTE)": null,
            "Vila Itapeva (LESTE)": null,
            "UENP (LESTE)": null,
            "USINA (LESTE)": null,
            "Vila Rubi (LESTE)": null,
            "Condomínio MonteRey (LESTE)": null,
            "IBC (NORTE)": null,
            "Vila Paraiso (NORTE)": null,
            "Vila Macedo (IBC) (NORTE)": null,
            "Vila Santa Terezinha (IBC) (NORTE)": null,
            "Vila Paraiso (IBC) (NORTE)": null,
            "Jardim HP (NORTE)": null,
            "Conj São Rafael (NORTE)": null,
            "Conj Mario Sérgio (NORTE)": null,
            "Conj Morar Melhor (NORTE)": null,
            "Conj Habitar Brasil (NORTE)": null,
            "Novo Paraiso (NORTE)": null,
            "Jardim Paraiso (NORTE)": null,
            "Jardim Ana Rosa (NORTE)": null,
            "Recanto dos Bandeirantes (NORTE)": null,
            "Loteamento Euri (NORTE)": null,
            "Recanto Petrópolis (NORTE)": null,
            "Vila São Pedro (CENTRO)": null,
            "Vila Lordani (SUL)": null,
            "Vila Moretti (SUL)": null,
            "Loteamento Godinho (SUL)": null,
            "Loteamento Moreti (SUL)": null,
            "Conj Ouro Verde (SUL)": null,
            "Loteamento Gamarano (SUL)": null,
            "Loteamento Barboza (SUL)": null,
            "Vila São Vicente (SUL)": null,
            "Conj Nossa S Aparecida (SUL)": null,
            "Conj Jardim Yara (SUL)": null,
            "Jardim Morumbi (SUL)": null,
            "Conj Berto Meneghel (SUL)": null,
            "Jd Alphaville (SUL)": null,
            "Conj Pombal I (SUL)": null,
            "Conj Pombal II (SUL)": null,
            "Vila São Geraldo (SUL)": null,
            "Vila Carola (SUL)": null,
            "Conj das Torres (SUL)": null,
            "Lot Macedo (SUL)": null,
            "Vila União (OESTE)": null,
            "Jardim São Paulo (OESTE)": null,
            "Sassatani Ueno (OESTE)": null,
            "Vila Pompéia (OESTE)": null,
            "Jardim União (OESTE)": null,
            "Jardim Primavera (OESTE)": null,
            "Conj Matida (OESTE)": null,
            "Conj José Carvalho Henriques (OESTE)": null,
            "Conj Julieta Lordani (OESTE)": null,
            "Conj Celso Fontes (OESTE)": null,
            "Vila Bela Vista (OESTE)": null,
            "Jardim Belle Ville (OESTE)": null,
            "RURAL": null
          },
          minLength: 1,
          limit: 6
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    this.orderRef.child('address/neighborhood').on('value', snap => element.input.value = snap.val());
    element.input.addEventListener('change', () => {

      this.orderRef.child('address/neighborhood').set(element.input.value);

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Bairro';
    this.orderRef.child('address/neighborhood').on('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    return element;

  }

  buildAddressReferenceElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressReference';
    element.input.addEventListener('input', () => this.orderRef.child('address/addressReference').set(element.input.value));
    this.orderRef.child('address/addressReference').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Complemento ou Referência';
    this.orderRef.child('address/addressReference').on('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

}

class OrderItem {

  constructor(orderItemRef) {

    this.orderItemRef = orderItemRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

    // action listener
    this.orderItemRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'OrderItem row';
    this.element.dataset.orderItemKey = this.orderItemRef.key;

    this.element.main = this.buildMainElement();
    this.element.itemNameField = this.buildItemNameFieldElement();
    this.element.itemQuantityField = this.buildItemQuantityFieldElement();
    this.element.itemPriceField = this.buildItemPriceFieldElement();
    this.element.deleteItemButton = this.buildDeleteItemButtonElement();

    this.element.note = this.buildNoteElement();

  }

  buildMainElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-main';
    this.element.appendChild(element);

    return element;

  }

  buildItemNameFieldElement() {

    let self = this;

    const element = document.createElement('div');
    element.className = 'input-field col s5';

    element.input = document.createElement('input');
    element.input.className = 'autocomplete';
    element.input.type = 'text';
    element.input.id = this.orderItemRef.key + '-itemName';
    element.input.addEventListener('focus', event => {

      element.input.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.input, {
          data: {
            "Marmita P": null,
            "Marmita M": null,
            "Marmita G": null,
            "Marmita F": null,
            "Porção Panqueca": null,
            "Porção Panqueca G": null,
            "Feijoada Individual": null,
            "Feijoada Grande": null,
            "Feijoada Família": null,
            "Porção Feijoada": null,
            "Coca Lata 220ml": null,
            "Coca Lata 350ml": null,
            "Fanta Lata 350ml": null,
            "Sprite Lata 350ml": null,
            "Fanta Guarana Lata 350ml": null,
            "Coca 600ml": null,
            "Coca 1 Litro": null,
            "Coca 2 Litros": null,
            "Conquista 2 Litros": null,
            "Suco Prats 330ml": null,
            "Suco DeLVale Uva": null,
            "Suco DeLVale Laranja": null
          },
          minLength: 0,
          limit: 6,
          onAutocomplete: function (select) {
            switch (select) {
              case 'Marmita P':
                self.updatePrice(8.00);
                break;
              case 'Marmita M':
                self.updatePrice(9.00);
                break;
              case 'Marmita G':
                self.updatePrice(11.00);
                break;
              case 'Marmita F':
                self.updatePrice(14.00);
                break;
              case 'Porção Panqueca':
                self.updatePrice(9.00);
                break;
              case 'Porção Panqueca G':
                self.updatePrice(12.00);
                break;
              case 'Feijoada Individual':
                self.updatePrice(15.00);
                break;
              case 'Feijoada Grande':
                self.updatePrice(20.00);
                break;
              case 'Feijoada Família':
                self.updatePrice(24.00);
                break;
              case 'Porção Feijoada':
                self.updatePrice(13.00);
                break;
              case 'Coca Lata 220ml':
                self.updatePrice(2.00);
                break;
              case 'Coca Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Fanta Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Sprite Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Fanta Guarana Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Coca 600ml':
                self.updatePrice(4.00);
                break;
              case 'Coca 1 Litro':
                self.updatePrice(5.00);
                break;
              case 'Coca 2 Litros':
                self.updatePrice(8.00);
                break;
              case 'Conquista 2 Litros':
                self.updatePrice(6.00);
                break;
              case 'Suco Prats 330ml':
                self.updatePrice(4.00);
                break;
              case 'Suco DeLVale Uva':
                self.updatePrice(3.00);
                break;
              case 'Suco DeLVale Laranja':
                self.updatePrice(3.00);
                break;
              default:
                self.updatePrice(0.00);
            }
          }
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    element.input.addEventListener('change', () => {

      this.orderItemRef.child('itemName').set(element.input.value);

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Produto';
    this.orderItemRef.child('itemName').on('value', snap => {

      element.input.value = snap.val();

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.main.appendChild(element);

    return element;

  }

  buildItemQuantityFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s2';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.min = 1;
    element.input.value = 1;
    element.input.id = this.orderItemRef.key + 'itemQuantity';
    element.input.addEventListener('focus', event => {
      element.input.select();
    });
    element.input.addEventListener('change', () => {

      this.orderItemRef.child('quantity').set(element.input.value);

    });
    this.orderItemRef.child('quantity').on('value', snap => {

      element.input.value = snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Qtde';
    element.appendChild(element.label);

    this.element.main.appendChild(element);

    return element;

  }

  buildItemPriceFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s3';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.min = 0;
    element.input.step = 1;
    element.input.value = 0.00;
    element.input.id = this.orderItemRef.key + 'itemPrice';
    element.input.addEventListener('focus', () => {
      element.input.select();
    });
    element.input.addEventListener('blur', () => this.updatePrice(element.input.value));
    element.input.addEventListener('change', () => this.updatePrice(element.input.value));
    this.orderItemRef.child('itemPrice').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Preço';
    element.appendChild(element.label);

    this.element.main.appendChild(element);

    return element;

  }

  buildDeleteItemButtonElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-actions col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect waves-light btn-floating btn-small red';
    element.buttonElement.innerHTML = '<i class="material-icons">remove</i>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.main.appendChild(element);

    return element;

  }

  buildNoteElement() {

    const self = this;

    let autodestroy = false;

    const element = document.createElement('div');
    element.className = 'OrderItem-note';

    element.field = document.createElement('div');
    element.field.className = 'input-field col s10';
    element.appendChild(element.field);

    element.field.textarea = document.createElement('textarea');
    element.field.textarea.className = 'materialize-textarea';
    element.field.textarea.placeholder = 'observação';
    element.field.textarea.addEventListener('input', () => {

      this.orderItemRef.child('note').set(element.field.textarea.value.toLowerCase());

    });
    this.orderItemRef.child('note').on('value', snap => element.field.textarea.value = snap.val());
    element.field.appendChild(element.field.textarea);

    element.actionButton = document.createElement('a');
    element.actionButton.innerHTML = 'adicionar observação';
    element.actionButton.href = '#';
    element.actionButton.addEventListener('click', event => {

      event.preventDefault();

      if (element.classList.contains('is-active')) {

        element.classList.remove('is-active');
        element.actionButton.innerHTML = 'adicionar observação';

        autodestroy = true;

        // previne que a nota seja excluida acidentalmente
        setTimeout(function () {

          if (autodestroy)
            self.orderItemRef.child('note').set(null);

        }, 3000);

      } else {

        element.classList.add('is-active');
        element.actionButton.innerHTML = 'remover observação';
        element.field.textarea.focus();

        autodestroy = false;

      }

    });
    this.orderItemRef.child('note').on('value', snap => {

      if (snap.val()) {

        element.classList.add('is-active');
        element.actionButton.innerHTML = 'remover observação';

      } else {

        element.classList.remove('is-active');
        element.actionButton.innerHTML = 'adicionar observação';

      }

    });
    element.appendChild(element.actionButton);

    this.element.appendChild(element);

    return element;

  }

  updatePrice(value) {

    try {
      value = parseFloat(value).toFixed(2);
    } catch (e) {
      value = 0;
      console.log(e);
    }

    this.orderItemRef.child('itemPrice').set(value);

  }

  delete() {

    this.orderItemRef.set(null);

  }

}
class OrderItemList {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');
    this.itemList = [];

    this.init();

  }

  init() {

    this.build();

    this.orderRef.child('items').once('value', snap => {

      // if (snap.val() == null)
      //   this.addItem('Marmita P');

    });

    this.orderRef.child('items').on('child_added', snap => {

      this.pushItem(snap.ref);

    });

    this.orderRef.child('items').on('child_removed', snap => {

      this.delete(snap.ref);

    });

  }

  build() {

    this.element.className = 'OrderItemList row';

    this.buildItemListElement();

    this.buildActionsElement();

  }

  buildItemListElement() {

    this.element.itemListElement = document.createElement('div');
    this.element.itemListElement.className = 'OrderItemList-list';
    this.element.appendChild(this.element.itemListElement);

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'OrderItems-actions';
    this.element.appendChild(this.element.actionsElement);

    this.element.addItemButton = document.createElement('button');
    this.element.addItemButton.className = 'waves-effect waves-light btn-small orange light-1';
    this.element.addItemButton.innerHTML = 'Adicionar Produto';
    this.element.addItemButton.addEventListener('click', () => {

      this.addItem();

    });
    this.element.actionsElement.appendChild(this.element.addItemButton);

  }

  addItem(itemName, itemPrice) {

    this.orderRef.child('items').push({
      itemName: itemName || '',
      itemPrice: itemPrice ||  0.00,
      quantity: 1
    });

    try {

      if (this.orderRef)
        M.toast({
          html: 'Item Adicionado!'
        });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushItem(orderItemRef) {

    if (orderItemRef) {

      let orderItem = new OrderItem(orderItemRef);
      this.itemList.push(orderItem);
      this.element.itemListElement.appendChild(orderItem.element);

    }

  }

  delete(orderItemRef) {

    for (let i = this.itemList.length; i--; ) {

      if (this.itemList[i].orderItemRef.key === orderItemRef.key)
        this.itemList.splice(i, 1);

    }

  }

}
class OrderList {

  constructor(app, optionalClass = '', autoInit = true) {

    this.app = app;
    this.optionalClass = optionalClass;

    // define database instances
    this.ordersRef = this.app.ordersRef;
    this.ordersViewRef = this.app.ordersViewRef || this.app.activeOrdersViewRef;

    this.element = document.createElement('div');
    this.orders = {};
    this.currentOrdersView = {};
    this.isLoaded = false;

    if (this.ordersRef && this.ordersViewRef && autoInit)
      this.init();

  }

  init() {

    this.build();

    // define global listeners
    this.ordersViewRef.on('child_added', snap => this.pushOrder(this.ordersRef.child(snap.key), snap.val()));
    this.ordersRef.on('child_removed', snap => this.removeOrder(this.ordersRef.child(snap.key)));

    // faz algo após a lista de dados ser baixada
    this.ordersViewRef.once('value', snap => {

      // this.buildView(!this.isLoaded);
      // this.isLoaded = true;

    });

  }

  build() {

    this.element.className = 'OrderList';
    this.element.classList.add(this.optionalClass);

    // inner
    this.element.inner = document.createElement('div');
    this.element.inner.className = 'OrderList-inner';
    this.element.appendChild(this.element.inner);

  }

  buildView(initializeOrders) {

    this.element.inner.innerHTML = '';

    const view = Object.values(this.orders);

    // ordena decrescente
    view.sort((a, b) => {
      if (a.createdTime.isBefore(b.createdTime))
        return 1;
      if (b.createdTime.isBefore(a.createdTime))
        return -1;
      return 0;
    });

    view.forEach(order => this.appendOrderToView(order));

    if (initializeOrders)
      view.forEach(order => order.init());

  }

  pushOrder(orderRef, data) {

    if (data) {

      if (!this.orders[orderRef.key]) {

        if (orderRef && !this.orders[orderRef.key])
          this.orders[orderRef.key] = new Order(orderRef, this, false);

        this.orders[orderRef.key].ordersViewItemRef = this.ordersViewRef.child(orderRef.key);
        this.orders[orderRef.key].createdTime = moment(data.createdTime);

        this.orders[orderRef.key].orderRef.child('isDeleted').on('value', snap => {
          if (!!snap.val())
            this.orders[orderRef.key].ordersViewItemRef.set(false);
        });

        if (this.isLoaded) {
          this.appendOrderToView(this.orders[orderRef.key], true);
          this.orders[orderRef.key].init();
        }

      }

    }

  }

  removeOrder(orderRef) {

    if (orderRef)
      if (this.orders[orderRef.key]) {
        this.ordersViewRef.child(orderRef.key).set(null);
        delete this.orders[orderRef.key];
      }

  }

  appendOrderToView(order, before) {

    if (before)
      this.element.inner.insertBefore(order.element, this.element.inner.firstChild);
    else
      this.element.inner.appendChild(order.element);

  }

  isOpened(orderKey) {

    return !!this.currentOrdersView[orderKey];

  }

  open(orderKey = '', getFocus = false) {

    const self = this;

    setTimeout(() => {

      const order = self.orders[orderKey];

      if (order && !self.isOpened(orderKey)) {

        self.element.inner.insertBefore(order.element, self.element.inner.firstChild);
        self.currentOrdersView[orderKey] = order;
        order.init();

        if (getFocus)
          order.focus();

      }

    }, 10);

  }

  close(orderKey = '') {

    const order = this.orders[orderKey];

    if (order && this.currentOrdersView[orderKey]) {
      this.element.inner.removeChild(order.element);
      delete this.currentOrdersView[orderKey];
      order.destroy();
    }

  }

}

class OrderPaymentItem {

  constructor(orderPaymentItemRef, orderBillingRef, isDefault) {

    this.orderPaymentItemRef = orderPaymentItemRef;
    this.orderBillingRef = orderBillingRef;
    this.isDefault = !!isDefault;

    this.element = document.createElement('div');

    this.methodOptions = [
      {
        method: 'card',
        title: 'Cartão',
        icon: 'credit_card',
        disabled: false,
        selected: false
      },
      {
        method: 'money',
        title: 'Dinheiro',
        icon: 'attach_money',
        disabled: false,
        selected: true
      },
      {
        method: 'paid',
        title: 'Pago',
        icon: 'money_off',
        disabled: false,
        selected: false
      },
      {
        method: 'gift',
        title: 'Cortesia',
        icon: 'card_giftcard',
        disabled: false,
        selected: false
      }
    ];

    this.init();

  }

  init() {

    this.build();

    this.priceAmount = false;

    // update is default
    this.updateIsDefault(this.isDefault);

    // main listener
    this.orderPaymentItemRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      } else {

        // controladores de dados (usado quando envolve mais de um campo (ex: method + referenceValue))
        this.paidValueDataChangeController(snap.val());
        this.referenceValueDataChangeController(snap.val());

      }

    });

    // priceAmount listener (monitorar o valor total)
    this.orderBillingRef.child('priceAmount').on('value', snap => {

      this.priceAmount = snap.val();

      this.orderPaymentItemRef.once('value', snap => {

        this.referenceValueDataChangeController(snap.val());

      });

    });

    // adapts the UI for each payment method
    this.orderPaymentItemRef.child('method').on('value', () => this.methodDataChangeController());
    this.orderPaymentItemRef.child('isDefault').on('value', () => this.methodDataChangeController());

  }

  build() {

    this.element.className = 'OrderPaymentItem row';
    this.element.dataset.orderPaymentItemRefKey = this.orderPaymentItemRef.key;

    this.element.method = this.buildMethodSelectElement();
    this.element.referenceValue = this.buildReferenceValueFieldElement();
    this.element.paidValue = this.buildPaidValueFieldElement();
    this.element.deletePayment = this.buildDeletePaymentButtonElement();

  }

  buildMethodSelectElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-method input-field col s4';
    this.element.appendChild(element);

    element.select = document.createElement('select');
    // element.select.className = 'browser-default';
    element.appendChild(element.select);

    element.select.defaultOption = document.createElement('option');
    element.select.defaultOption.value = '';
    element.select.defaultOption.disabled = true;
    element.select.defaultOption.innerHTML = 'Métodos';
    element.select.addEventListener('change', event => {

      this.orderPaymentItemRef.child('method').set(element.select[event.target.selectedIndex].value);

    });
    this.orderPaymentItemRef.child('method').on('value', snap => {

      setTimeout(() => {

        for (let i = element.select.options.length; i--;)
          if (element.select.options[i].value === snap.val()) {
            element.select.options[i].setAttribute('selected', true);
            element.select.options.selectedIndex = i;
          } else {
            element.select.options[i].removeAttribute('selected');
          }

        element.instance = M.FormSelect.init(element.select);

      }, 1);

    });
    element.select.appendChild(element.select.defaultOption);

    let hasSelected = false;

    this.methodOptions.forEach(option => {

      let optionElement = document.createElement('option');
      optionElement.value = option.method;
      optionElement.disabled = option.disabled;
      optionElement.innerHTML = option.title;

      if (option.selected) {
        optionElement.setAttribute('selected', true);
        hasSelected = true;
      }

      element.select.appendChild(optionElement);

    });

    if (!hasSelected)
      element.select.defaultOption.setAttribute('selected', true);

    element.label = document.createElement('label');
    element.label.innerHTML = 'Pagamento';
    element.appendChild(element.label);

    setTimeout(() => element.instance = M.FormSelect.init(element.select), 1);

    return element;

  }

  buildPaidValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-paidValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-paidValueField';
    element.input.addEventListener('focus', () => {
      element.input.select();
    });
    element.input.addEventListener('change', () => this.updatePaidValue(element.input.value));
    this.orderPaymentItemRef.child('paidValue').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Pago';
    element.appendChild(element.label);

    return element;

  }

  buildReferenceValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-referenceValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-referenceValueField';
    element.input.addEventListener('focus', () => {
      element.input.select();
    });
    element.input.addEventListener('change', () => this.updateReferenceValue(element.input.value));
    this.orderPaymentItemRef.child('referenceValue').on('value', snap => {

      element.input.value = snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Valor';
    element.label.classList = 'active';
    element.appendChild(element.label);

    return element;

  }

  buildDeletePaymentButtonElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-actions col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect btn-floating btn-small white';
    element.buttonElement.innerHTML = '<i class="material-icons red-text">remove</i>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.appendChild(element);

    return element;

  }

  // adapts the UI for each payment method
  methodDataChangeController() {

    this.orderPaymentItemRef.child('method').once('value', snap => {

      switch (snap.val()) {
        case 'money': {
          this.element.referenceValue.input.disabled = this.isDefault;
          this.element.paidValue.input.disabled = false;
          this.element.paidValue.input.step = 10.00;
          this.element.paidValue.label.innerHTML = 'Troco p';
        }
          break;
        default: {
          this.element.referenceValue.input.disabled = this.isDefault;
          this.element.paidValue.input.disabled = true;
          this.element.paidValue.input.step = 1.00;
          this.element.paidValue.label.innerHTML = 'Pago';
        }
      }

    });

  }

  paidValueDataChangeController(data) {

    if (parseFloat(data.referenceValue) > parseFloat(data.paidValue))
      this.updatePaidValue(data.referenceValue);

    if (data.method !== 'money')
      this.updatePaidValue(data.referenceValue);

  }

  referenceValueDataChangeController(data) {

    try {
      if (this.priceAmount) {
        if (this.isDefault)
          this.updateReferenceValue(this.priceAmount);
        else if (parseFloat(data.referenceValue) > parseFloat(this.priceAmount))
          this.updateReferenceValue(this.priceAmount);
      }
    } catch (e) {
      console.log('eitaa..');
    }

  }

  updatePaidValue(value) {

    try {
      value = parseFloat(value).toFixed(2);
    } catch (e) {
      value = parseFloat(0).toFixed(2);
    } finally {
      value = isNaN(value) ? parseFloat(0).toFixed(2) : value;
    }

    this.orderPaymentItemRef.child('paidValue').set(value);

  }

  updateReferenceValue(value) {

    try {
      value = parseFloat(value).toFixed(2);
    } catch (e) {
      value = parseFloat(0).toFixed(2);
    } finally {
      value = isNaN(value) ? parseFloat(0).toFixed(2) : value;
    }

    this.orderPaymentItemRef.child('referenceValue').set(value);

  }

  updateIsDefault(state) {

    this.isDefault = !!state;

    this.orderPaymentItemRef.child('isDefault').set(this.isDefault);

  }

  delete() {

    this.orderPaymentItemRef.set(null);

  }

}
class OrderPaymentList {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.orderBillingRef = this.orderRef.child('billing');

    this.element = document.createElement('div');
    this.paymentList = [];

    this.priceAmount = false;

    this.init();

  }

  init() {

    this.build();

    this.orderBillingRef.child('payments').on('child_added', snap => {

      this.pushPaymentItem(snap.ref);

    });

    this.orderBillingRef.child('payments').on('child_removed', snap => {

      this.delete(snap.ref);

    });

    // atualiza o priceAmount
    this.orderBillingRef.child('priceAmount').on('value', snap => this.priceAmount = snap.val());

  }

  build() {

    this.element.className = 'OrderPaymentList row';

    this.element.paymentList = this.buildPaymentListElement();
    this.element.actions = this.buildActionsElement();

  }

  buildPaymentListElement() {

    const element = document.createElement('div');
    element.className = 'OrderItemList-list';
    this.element.appendChild(element);

    return element;

  }

  buildActionsElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentList-actions';
    this.element.appendChild(element);

    element.addItemButton = document.createElement('button');
    element.addItemButton.className = 'waves-effect waves-light btn-small green light-1';
    element.addItemButton.innerHTML = 'Adicionar Pagamento';
    element.addItemButton.addEventListener('click', () => {

      this.addItem('money');

    });
    element.appendChild(element.addItemButton);

    return element;

  }

  addItem(method) {

    this.orderBillingRef.child('payments').push({
      method: method || '',
      paidValue: this.priceAmount ? parseFloat(this.priceAmount).toFixed(2) : 0.00,
      referenceValue: this.priceAmount ? parseFloat(this.priceAmount).toFixed(2) : 0.00
    });

  }

  pushPaymentItem(orderPaymentItemRef) {

    if (orderPaymentItemRef) {

      let paymentItem = new OrderPaymentItem(orderPaymentItemRef, this.orderBillingRef, !this.paymentList.length);
      this.paymentList.push(paymentItem);
      this.element.paymentList.appendChild(paymentItem.element);

      // isDefault significa que o método de pagamento é unico e deve ter o valor fixo baseado do priceAmount
      if (this.paymentList.length > 1)
        this.paymentList.forEach(orderPaymentItem => orderPaymentItem.updateIsDefault(false));

    }

  }

  delete(orderPaymentItemRef) {

    for (let i = this.paymentList.length; i--; ) {

      if (this.paymentList[i].orderPaymentItemRef.key === orderPaymentItemRef.key)
        this.paymentList.splice(i, 1);

    }

    if (this.paymentList.length === 1)
      this.paymentList[0].updateIsDefault(true);

  }

}
class OrderPriceAmount {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.orderBillingRef = orderRef.child('billing');

    this.element = document.createElement('div');

    this.priceList = [];
    this.priceAmount = 0.00;
    this.priceAmountUnlocked = false;

    this.init();

  }

  init() {

    this.build();

    this.orderRef.child('items').on('child_added', snap => {

      if (!this.priceAmountUnlocked)
        this.updatePriceAmount(snap.ref, snap.val());

    });

    this.orderRef.child('items').on('child_changed', snap => {

      if (!this.priceAmountUnlocked)
        this.updatePriceAmount(snap.ref, snap.val());

    });

    this.orderRef.child('items').on('child_removed', snap => {

      if (!this.priceAmountUnlocked)
        this.updatePriceAmount(snap.ref, null);

    });

    this.orderBillingRef.child('priceAmountUnlocked').on('value', snap => {

      this.priceAmountUnlocked = !!snap.val();

    });

  }

  build() {

    this.element.className = 'OrderPriceAmount row';

    this.inputField = this.buildInputFieldElement();
    this.switcher = this.buildSwitcherElement();

  }

  buildInputFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s6';

    element.input = document.createElement('input');
    element.input.id = this.orderRef.key + '-priceAmountInput';
    element.input.type = 'number';
    element.input.min = '0.00';
    element.input.step = '1';
    element.input.disabled = true;
    element.input.addEventListener('blur', event => {

      element.input.value = parseFloat(element.input.value).toFixed(2);

    });
    element.input.addEventListener('change', event => {

      element.input.value = parseFloat(element.input.value).toFixed(2);
      this.orderBillingRef.child('priceAmount').set(parseFloat(element.input.value).toFixed(2));

    });
    this.orderBillingRef.child('priceAmount').on('value', snap => {

      try {
        element.input.value = parseFloat(snap.val()).toFixed(2);
      } catch (e) {
        element.input.value = snap.val();
      }

    });
    this.orderBillingRef.child('priceAmountUnlocked').on('value', snap => {

      element.input.disabled = !snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.className = 'active';
    this.orderBillingRef.child('priceAmount').on('value', snap => {

      element.label.className = snap.val() !== null ? 'active' : '';

    });
    element.label.innerHTML = 'Total';
    element.label.htmlFor = element.input.id;
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildSwitcherElement() {

    const element = document.createElement('div');
    element.className = 'switch col s6';

    element.label = document.createElement('label');
    element.appendChild(element.label);

    element.input = document.createElement('input');
    element.input.type = 'checkbox';
    element.input.addEventListener('change', event => {

      this.orderBillingRef.child('priceAmountUnlocked').set(element.input.checked);

      if (!element.input.checked)
        this.refreshPriceAmount();

    });
    this.orderBillingRef.child('priceAmountUnlocked').on('value', snap => {

      element.input.checked = !!snap.val();

    });
    element.label.appendChild(element.input);

    element.label.span = document.createElement('span');
    element.label.span.className = 'lever';
    element.label.appendChild(element.label.span);

    element.label.text = document.createTextNode('alterar');
    element.label.appendChild(element.label.text);

    this.element.appendChild(element);

    return element;

  }

  updatePriceAmount(orderItemRef, data) {

    if (data)
      this.priceList[orderItemRef.key] = {
        itemPrice: data.itemPrice || 0,
        quantity: data.quantity || 0
      };
    else
      this.priceList[orderItemRef.key] = null;


    this.refreshPriceAmount();

  }

  refreshPriceAmount() {

    let priceAmount = 0;

    let priceListArray = Object.values(this.priceList);
    priceListArray.forEach(orderItem => {

      if (orderItem != null)
        priceAmount += orderItem.itemPrice * orderItem.quantity;

    });

    this.setPriceAmount(priceAmount);

  }

  setPriceAmount(priceAmount) {

    const self = this;

    this.priceAmount = priceAmount;

    // isso evita que seja criado novamente o objeto no firebase
    this.orderRef.once('value', snap => {

      if (snap.val() != null)
        this.orderBillingRef.child('priceAmountUnlocked').once('value', snap => {
          if (!snap.val())
            setTimeout(() => self.orderBillingRef.child('priceAmount').set(self.priceAmount), 1);
        });

    });

  }

}
class OrdersGrid extends Grid {

  constructor(element) {

    super(element);

    this.defaultColumnsNumber = 2;
    this.defaultItemWidth = 340;
    this.defaultMarginSize = 16;

    this.timer = false;

  }

  pushOrder(order) {

    let self = this;

    this.element.style.visibility = 'hidden';

    const ordersGridItem = new OrdersGridItem(order, this);
    this.element.appendChild(ordersGridItem.element);
    this.paymentList.push(ordersGridItem);

    if (this.timer)
      clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      setTimeout(function () {

        self.reOderView();
        self.element.style.visibility = 'visible';

      }, 100);
    }, 10);

  }

}
class OrdersGridItem extends GridItem {

  constructor(order, parentGrid) {

    super(parentGrid, order.orderKey, false);

    this.order = order;

    this.orderKey = order.orderKey;
    this.element = order.element;
    this.element.classList.add('OrdersGridItem');


  }

}
class Timeline {

  constructor(app = false, optionalClass = '', autoInit = true) {

    this.app = app;
    this.optionalClass = optionalClass;

    // define database instances
    this.ordersRef = this.app.ordersRef;
    this.ordersViewRef = this.app.ordersViewRef || this.app.activeOrdersViewRef;
    this.orderList = this.app.orderList;

    this.element = document.createElement('div');
    this.orders = {};
    this.isVisible = false;

    if (this.ordersRef && this.ordersViewRef && autoInit)
      this.init();

  }

  init() {

    this.build();

    this.ordersViewRef.orderByChild('createdTime').on('child_added', snap => {

      if (snap.val()) {

        this.orders[snap.key] = new TimelineItem(this.ordersRef.child(snap.key), this.orderList, false);
        this.element.inner.insertBefore(this.orders[snap.key].element, this.element.inner.firstChild);
        this.orders[snap.key].init();

      }

    });

  }

  build() {

    this.element.className = 'Timeline';
    this.element.classList.add(this.optionalClass);

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Timeline-inner';
    this.element.appendChild(this.element.inner);

    this.element.footer = document.createElement('div');
    this.element.footer.className = 'Timeline-footer';
    this.element.appendChild(this.element.footer);

  }

  toggle() {

    if (this.isVisible)
      this.inactive();
    else
      this.active();

  }

  active() {

    if (this.app.element)
      this.app.element.classList.add('is-timelineVisible');

    this.isVisible = true;

  }

  inactive() {

    if (this.app.element)
      this.app.element.classList.remove('is-timelineVisible');

    this.isVisible = false;

  }

}
class TimelineItem {

  constructor(orderRef, orderList, autoInit = false) {

    this.orderRef = orderRef;
    this.orderList = orderList;
    this.isOpened = false;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.build();

    this.orderRef.child('isDeleted').on('value', snap => {

      const self = this;

      if (snap.val()) {

        self.element.classList.add('is-deleting');

        setTimeout(() => {
          self.element.classList.remove('is-deleting');
          self.element.classList.add('is-deleted');
        }, 1300);

      }

    });

    this.orderRef.child('isArchived').on('value', snap => {
      if (snap.val())
        this.archive();
      else
        this.unarchive();
    });

    this.element.content.addEventListener('click', event => {

      const self = this;

      this.orderList.open(this.orderRef.key);

      setTimeout(() => {

        let scrollType = !event.shiftKey ? 'smooth' : 'instant';

        try {

          let orderElement = self.orderList.orders[self.orderRef.key].element;

          orderElement.scrollIntoView({
            behavior: scrollType
          });

        } catch (e) {

          console.log(e);

        }

      }, 10);

    });

    this.element.content.addEventListener('dblclick', event => console.log(event));

    const self = this;

    setInterval(() => {

      if (self.orderList.currentOrdersView[self.orderRef.key])
        self.element.classList.add('is-opened');
      else
        self.element.classList.remove('is-opened');

      console.log('1');

    }, 500);

  }

  build() {

    this.element.className = 'TimelineItem';
    this.element.dataset.orderRefKey = this.orderRef.key;

    // content
    this.element.content = document.createElement('div');
    this.element.content.className = 'TimelineItem-content';
    this.element.appendChild(this.element.content);

    // actions
    this.element.actions = document.createElement('div');
    this.element.actions.className = 'TimelineItem-actions';
    this.element.appendChild(this.element.actions);

    this.element.content.customerName = this.buildCustomerNameElement();
    this.element.content.createdTime = this.buildCreatedTimeElement();
    this.element.actions.printButton = this.buildPrintButtonElement();
    this.element.actions.deleteButton = this.buildArchiveButtonElement();

  }

  buildCustomerNameElement() {

    const element = document.createElement('div');
    element.className = 'TimelineItem-customerName';
    this.element.content.appendChild(element);

    element.span = document.createElement('span');
    this.orderRef.child('customer/customerName').on('value', snap => element.span.innerHTML = snap.val());
    element.appendChild(element.span);

    return element;

  }

  buildCreatedTimeElement() {

    const element = document.createElement('div');
    element.className = 'TimelineItem-createdTime font-green';
    this.element.content.appendChild(element);

    element.span = document.createElement('span');
    this.orderRef.child('createdTime').once('value', snap => {
      element.span.innerHTML = moment(snap.val()).fromNow();
      setInterval(() => element.span.innerHTML = moment(snap.val()).fromNow(), 10000);
    });
    element.appendChild(element.span);

    return element;

  }

  buildPrintButtonElement() {

    const element = document.createElement('button');
    element.className = 'TimelineItem-actionButton TimelineItem-actionButton--print';
    element.addEventListener('click', () => Order.print(this.orderRef, socket));
    this.element.actions.appendChild(element);

    element.icon = document.createElement('span');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'print';
    this.orderRef.child('printouts').on('value', snap => {
      if (snap.val())
        element.icon.classList.remove('pulse');
      else
        element.icon.classList.add('pulse');
    });
    element.appendChild(element.icon);

    return element;

  }

  buildArchiveButtonElement() {

    const element = document.createElement('button');
    element.className = 'TimelineItem-actionButton TimelineItem-actionButton--archive';
    element.addEventListener('click', () => {
      this.orderRef.child('isArchived').once('value', snap => this.orderRef.child('isArchived').set(!snap.val()));
      this.orderList.close(this.orderRef.key);
    });
    this.element.actions.appendChild(element);

    element.icon = document.createElement('span');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'archive';
    this.orderRef.child('isArchived').on('value', snap => {
      if (snap.val())
        element.icon.innerHTML = 'unarchive';
      else
        element.icon.innerHTML = 'archive';
    });
    element.appendChild(element.icon);

    return element;

  }

  archive() {
    this.element.classList.add('is-archived');
  }

  unarchive() {
    this.element.classList.remove('is-archived');
  }

}
/*!
 * Du Lago {ProjectName} Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2018 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/
