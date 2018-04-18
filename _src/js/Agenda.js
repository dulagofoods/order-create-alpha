class Agenda {

  constructor(app = false, optionalClass, autoInit = true) {

    if (app) {

      this.app = app;
      this.optionalClass = optionalClass;

      this.element = document.createElement('div');

      this.customersRef = this.app.databaseRef.ref('customers');
      this.orderList = this.app.orderList;

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
