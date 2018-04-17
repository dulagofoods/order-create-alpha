class Agenda {

  constructor(databaseRef = false, orderList = false, optionalClass) {

    this.databaseRef = databaseRef;
    this.customersRef = this.databaseRef ? databaseRef.ref('customers') : false;
    this.optionalClass = optionalClass;

    this.orderList = orderList;

    this.element = document.createElement('div');
    this.customers = {};

    if (this.customersRef)
      this.init();

  }

  init() {

    this.build();

    this.customersRef.on('child_added', snap => {

      const customer = new Customer(snap.ref);
      this.element.inner.insertBefore(customer.element, this.element.inner.firstChild);
      this.customers[snap.key] = customer;

    });

  }

  build() {

    this.element.className = 'Agenda';
    this.element.classList.add(this.optionalClass || '');

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Agenda-inner';
    this.element.appendChild(this.element.inner);

  }

}