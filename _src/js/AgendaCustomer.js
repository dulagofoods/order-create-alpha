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

    this.element.deleteCustomerButton = this.buildDeleteCustomerButtonElement();
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

  buildDeleteCustomerButtonElement() {

    const element = document.createElement('a');
    element.className = 'btn-icon';
    element.addEventListener('click', () => {

      let allow = confirm('O cliente sera excluido permanentemente, deseja continuar?');

      if (allow)
        this.customerRef.set(null);

    });
    this.element.actions.appendChild(element);

    element.icon = document.createElement('i');
    element.icon.className = 'material-icons';
    element.icon.innerHTML = 'delete';
    element.appendChild(element.icon);

    return element;

  }

  buildCreateOrderButtonElement() {

    const element = document.createElement('a');
    element.className = 'btn-icon';
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
    element.icon.innerHTML = 'note_add';
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