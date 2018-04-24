class OrderDeliveryTime {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.orderDeliveryTimeRef = this.orderRef.child('deliveryTime');

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

  }

  build() {

    this.element.className = 'OrderDeliveryTime row';

    this.element.timeField = this.buildTimeFieldElement();
    this.element.actions = this.buildActionsElement();
    // this.element.type = this.buildTimeFieldElement();

  }

  buildTimeFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderDeliveryTime-time input-field col s3';
    this.element.appendChild(element);

    // input
    element.input = document.createElement('input');
    element.input.id = this.orderRef.key + '-customerName';
    element.input.type = 'time';
    element.input.step = '300';
    element.input.value = '';
    element.input.addEventListener('focus', () => {

      element.input.select();

    });
    element.input.addEventListener('input', () => {

      this.orderDeliveryTimeRef.child('time').set(element.input.value);

    });
    this.orderDeliveryTimeRef.once('value', snap => {

      if (snap.val() === null)
        this.update(20);

    });
    this.orderDeliveryTimeRef.on('value', snap => {

      if (snap.val())
        element.input.value = snap.val().time || '';
      else
        element.input.value = '';

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

  buildActionsElement() {

    const element = document.createElement('div');
    element.className = 'OrderDeliveryTime-actions col s8';
    this.element.appendChild(element);

    element.updateTwentyButton = document.createElement('button');
    element.updateTwentyButton.className = 'btn-flat';
    element.updateTwentyButton.innerHTML = '<span>+20</span>';
    element.updateTwentyButton.addEventListener('click', () => this.update(20, 'until'));
    element.appendChild(element.updateTwentyButton);

    element.updateThirtyButton = document.createElement('button');
    element.updateThirtyButton.className = 'btn-flat';
    element.updateThirtyButton.innerHTML = '<span>+30</span>';
    element.updateThirtyButton.addEventListener('click', () => this.update(30, 'until'));
    element.appendChild(element.updateThirtyButton);

    element.clearButton = document.createElement('button');
    element.clearButton.className = 'btn-flat';
    element.clearButton.innerHTML = '<i class="material-icons">clear</i>';
    element.clearButton.addEventListener('click', () => this.orderDeliveryTimeRef.set(false));
    element.appendChild(element.clearButton);

  }

  update(time = 20, type = 'until') {

    if (typeof time === 'number')
      time = moment().add(time, 'minutes').format('HH:mm');
    else if (typeof time === 'number')
      time = moment(time, 'HH:mm').format();
    else
      time = '';

    this.orderDeliveryTimeRef.set({
      time: time,
      type: type
    });

  }

}