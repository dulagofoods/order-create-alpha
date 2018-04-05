class OrderDelivery {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

  }

  build() {

    this.element.className = 'OrderDelivery row';

    this.element.action = this.buildActionElement();

    this.element.address = this.buildAddressFormElement();
    this.element.address.street = this.streetElement();
    this.element.address.houseNumber = this.buildHouseNumberElement();
    this.element.address.neighborhood = this.buildNeighborhoodElement();
    this.element.address.addressReference = this.buildAddressReferenceElement();

  }

  buildActionElement() {

    let element = document.createElement('div');
    element.className = 'OrderDelivery-action switch col s12';

    element.label = document.createElement('label');
    element.appendChild(element.label);

    element.label.textOff = document.createTextNode('retirada');
    element.label.appendChild(element.label.textOff);

    element.input = document.createElement('input');
    element.input.type = 'checkbox';
    element.input.addEventListener('change', event => {

      this.orderRef.child('delivery').set(element.input.checked);

    });
    this.orderRef.child('delivery').on('value', snap => {

      element.input.checked = !!snap.val();

      if (!!snap.val())
        this.element.classList.add('is-active');
      else
        this.element.classList.remove('is-active');

    });
    element.label.appendChild(element.input);

    element.label.lever = document.createElement('span');
    element.label.lever.className = 'lever';
    element.label.appendChild(element.label.lever);

    element.label.textOn = document.createTextNode('entrega');
    element.label.appendChild(element.label.textOn);

    this.element.appendChild(element);

    return element;

  }

  buildAddressFormElement() {

    let element = document.createElement('div');
    element.className = 'OrderDelivery-addressForm row';

    this.element.appendChild(element);

    return element;

  }

  streetElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s9';

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-street';
    element.input.addEventListener('input', () => this.orderRef.child('street').set(element.input.value));
    this.orderRef.child('street').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Rua';
    this.orderRef.child('street').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildHouseNumberElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s3';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderRef.key + '-addressHouseNumber';
    element.input.addEventListener('input', () => this.orderRef.child('addressHouseNumber').set(element.input.value));
    this.orderRef.child('addressHouseNumber').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Número';
    this.orderRef.child('addressHouseNumber').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildNeighborhoodElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressNeighborhood';
    element.input.addEventListener('input', () => this.orderRef.child('addressNeighborhood').set(element.input.value));
    this.orderRef.child('addressNeighborhood').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Bairro';
    this.orderRef.child('addressNeighborhood').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildAddressReferenceElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressReference';
    element.input.addEventListener('input', () => this.orderRef.child('addressReference').set(element.input.value));
    this.orderRef.child('addressReference').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Referência';
    this.orderRef.child('addressReference').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

}