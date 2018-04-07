class OrderConsumer {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.build();

  }

  build() {

    this.element.className = 'OrderConsumer row';

    this.element.appendChild(this.buildConsumerNameField());

  }

  buildConsumerNameField() {

    this.nameFieldElement = document.createElement('div');
    this.nameFieldElement.className = 'OrderConsumer-consumerNameField input-field col s12';

    // input
    this.nameFieldElement.input = document.createElement('input');
    this.nameFieldElement.input.className = 'validate';
    this.nameFieldElement.input.id = this.orderRef.key + '-consumerName';
    this.nameFieldElement.input.type = 'text';
    this.nameFieldElement.input.addEventListener('input', () => {

      this.orderRef.child('consumerName').set(this.nameFieldElement.input.value);

    });
    this.orderRef.child('consumerName').on('value', snap => {

      this.nameFieldElement.input.value = snap.val();

    });
    this.nameFieldElement.appendChild(this.nameFieldElement.input);

    // label
    this.nameFieldElement.labelElement = document.createElement('label');
    this.nameFieldElement.labelElement.className = 'active';
    this.nameFieldElement.labelElement.htmlFor = this.nameFieldElement.input.id;
    this.nameFieldElement.labelElement.innerHTML = 'Nome';
    this.nameFieldElement.appendChild(this.nameFieldElement.labelElement);

    M.updateTextFields();

    return this.nameFieldElement;

  }

  focus() {

    this.nameFieldElement.input.focus();

  }

}