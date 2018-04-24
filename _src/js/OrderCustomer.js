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
    this.element.customerContact = this.buildCustomerContactFieldElement();
    // this.element.deliveryTime = this.buildDeliveryTimeFieldElement();

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