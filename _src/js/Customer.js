class Customer {

  constructor(customerRef = false) {

    this.element = document.createElement('div');

    this.customerRef = customerRef;
    this.data = false;

    this.init();

  }

  init() {

    this.build();

    this.customerRef.on('value', snap => this.data = snap.val());

  }

  build() {

    this.element.className = 'Customer';
    this.element.dataset.customerRefKey = this.customerRef.key;

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Customer-inner';
    this.element.appendChild(this.element.inner);

    // content
    this.element.content = document.createElement('div');
    this.element.content.className = 'Customer-content';
    this.element.inner.appendChild(this.element.content);

    this.element.customerName = this.buildCustomerNameElement();
    this.element.address = this.buildAddressElement();

    // actions
    this.element.actions = document.createElement('div');
    this.element.actions.className = 'Customer-actions';
    this.element.inner.appendChild(this.element.actions);

    this.element.createOrderButton = this.buildCreateOrderButtonElement();

  }

  buildCustomerNameElement() {

    const element = document.createElement('div');
    element.className = 'Customer-customerName';
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
    element.className = 'Customer-address';
    this.element.content.appendChild(element);

    element.streetLine = document.createElement('span');
    element.streetLine.className = 'Customer-streetLine';
    element.appendChild(element.streetLine);

    element.neighborhood = document.createElement('span');
    element.neighborhood.className = 'Customer-neighborhood';
    element.appendChild(element.neighborhood);

    element.note = document.createElement('span');
    element.note.className = 'Customer-note';
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

      Order.create(false, false, {customer: this});

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

}
