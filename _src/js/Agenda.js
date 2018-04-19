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
