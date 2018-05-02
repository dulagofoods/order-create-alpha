class OrderCustomer {

  constructor(order) {

    this.order = order;

    this.orderRef = this.order.orderRef;
    this.customerRef = this.orderRef.child('customer');

    this.element = document.createElement('div');

    this.build();

  }

  build() {

    this.element.className = 'OrderCustomer row';

    this.element.customerName = this.buildCustomerNameFieldElement();
    this.element.customerContact = this.buildCustomerContactFieldElement();

  }

  buildCustomerNameFieldElement() {

    const autocomplete = new CustomerAutoComplete(this.order, false, item => {
      console.log(item);
      Order.setCustomer(this.orderRef, item.customer);
    });

    const element = autocomplete.element;
    element.classList.add('OrderCustomer-customerNameField', 'col', 's8');
    this.element.appendChild(element);

    element.input.className = 'validate';
    element.input.addEventListener('input', () => {

      this.customerRef.child('customerName').set(element.input.value);

    });
    this.customerRef.child('customerName').on('value', snap => {

      if (snap.val() !== element.input.value)
        element.input.value = snap.val();

    });
    element.appendChild(element.input);

    this.customerRef.child('customerName').on('value', snap => {
      if (snap.val())
        element.label.classList = 'active';
    });
    element.label.innerHTML = 'Nome';
    element.appendChild(element.label);

    M.updateTextFields();

    return element;

  }

  buildCustomerContactFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderCustomer-customerContact input-field col s4';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.className = 'validate';
    element.input.id = this.orderRef.key + '-customerContact';
    element.input.type = 'tel';
    element.input.addEventListener('input', () => {

      this.customerRef.child('customerContact').set(element.input.value);

    });
    this.customerRef.child('customerContact').on('value', snap => {

      if (snap.val() !== element.input.value)
        element.input.value = snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    this.customerRef.child('customerContact').on('value', snap => {
      if (snap.val()) element.label.classList = 'active';
    });
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Telefone';
    element.appendChild(element.label);

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