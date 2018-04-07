class OrderConsumer {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.build();

  }

  build() {

    this.element.className = 'OrderConsumer row';

    this.element.consumerName = this.buildConsumerNameFieldElement();
    this.element.deliveryTime = this.buildDeliveryTimeFieldElement();

  }

  buildConsumerNameFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderConsumer-consumerNameField input-field col s8';
    this.element.appendChild(element);

    // input
    element.input = document.createElement('input');
    element.input.className = 'validate';
    element.input.id = this.orderRef.key + '-consumerName';
    element.input.type = 'text';
    element.input.addEventListener('input', () => {

      this.orderRef.child('consumerName').set(element.input.value);

    });
    this.orderRef.child('consumerName').on('value', snap => {

      element.input.value = snap.val();

    });
    element.appendChild(element.input);

    // label
    element.label = document.createElement('label');
    element.label.className = 'active';
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Nome';
    element.appendChild(element.label);

    M.updateTextFields();

    return this.nameFieldElement;

  }

  buildDeliveryTimeFieldElement() {

    let newTime = '00:00';

    if (moment())
      newTime = moment().add(20, 'minutes').format('hh:mm');

    const element = document.createElement('div');
    element.className = 'OrderConsumer-deliveryTime input-field col s4';
    this.element.appendChild(element);

    // input
    element.input = document.createElement('input');
    element.input.id = this.orderRef.key + '-consumerName';
    element.input.type = 'time';
    element.input.step = '300';
    element.input.addEventListener('focus', () => {

      let newTime = '00:00';

      if (moment())
        newTime = moment().add(20, 'minutes').format('hh:mm');

      this.orderRef.child('deliveryTime').set(newTime);

      element.input.select();

    });
    element.input.addEventListener('input', () => {

      this.orderRef.child('deliveryTime').set(element.input.value);

    });
    this.orderRef.child('deliveryTime').on('value', snap => {

      if (!snap.val())
        this.orderRef.child('deliveryTime').set(newTime);

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

    return this.nameFieldElement;

  }

  focus() {

    this.nameFieldElement.input.focus();

  }

}