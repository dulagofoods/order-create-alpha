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
    this.nameFieldElement.inputElement = document.createElement('input');
    this.nameFieldElement.inputElement.className = 'validate';
    this.nameFieldElement.inputElement.id = this.orderRef.key + '-consumerName';
    this.nameFieldElement.inputElement.type = 'text';
    this.nameFieldElement.inputElement.addEventListener('input', () => {

      this.orderRef.child('consumerName').set(this.nameFieldElement.inputElement.value);

    });
    this.orderRef.child('consumerName').on('value', snap => {

      this.nameFieldElement.inputElement.value = snap.val();

    });
    this.nameFieldElement.appendChild(this.nameFieldElement.inputElement);

    // label
    this.nameFieldElement.labelElement = document.createElement('label');
    this.nameFieldElement.labelElement.className = 'active';
    this.nameFieldElement.labelElement.htmlFor = this.nameFieldElement.inputElement.id;
    this.nameFieldElement.labelElement.innerHTML = 'Nome';
    this.nameFieldElement.appendChild(this.nameFieldElement.labelElement);

    M.updateTextFields();

    return this.nameFieldElement;

  }

  focus() {

    this.nameFieldElement.inputElement.focus();

  }

}