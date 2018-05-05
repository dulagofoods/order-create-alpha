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

    const element = new CustomerAutoComplete(this.orderRef.key, 'customerName', orderApp.customerList, item => {
      Order.setCustomer(this.orderRef, item.customer);
    }).element;
    element.classList.add('OrderCustomer-customerNameField', 'col', 's7');
    this.element.appendChild(element);

    element.input.addEventListener('input', () => {

      this.customerRef.child('customerName').set(element.input.value);

    });
    this.customerRef.child('customerName').on('value', snap => {

      if (snap.val() !== element.input.value)
        element.input.value = snap.val();

    });

    element.label.innerHTML = 'Nome';
    this.customerRef.child('customerName').on('value', snap => {
      if (snap.val())
        element.label.classList = 'active';
    });

    M.updateTextFields();

    return element;

  }

  buildCustomerContactFieldElement() {

    const autocomplete = new CustomerAutoComplete(this.orderRef.key, 'customerContact', orderApp.customerList, item => {
      Order.setCustomer(this.orderRef, item.customer);
    });

    const element = autocomplete.element;
    element.classList.add('OrderCustomer-customerContact', 'input-field', 'col', 's5');
    this.element.appendChild(element);

    element.input.type = 'tel';
    element.input.addEventListener('input', () => {

      this.customerRef.child('customerContact').set(element.input.value);

    });
    this.customerRef.child('customerContact').on('value', snap => {

      if (snap.val() !== element.input.value)
        element.input.value = snap.val();

    });

    element.label.innerHTML = 'Telefone';
    this.customerRef.child('customerContact').on('value', snap => {
      if (snap.val()) element.label.classList = 'active';
    });

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