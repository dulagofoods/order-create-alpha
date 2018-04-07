class OrderPaymentItem {

  constructor(orderPaymentItemRef, orderBillingRef, isDefault) {

    this.orderPaymentItemRef = orderPaymentItemRef;
    this.orderBillingRef = orderBillingRef;
    this.isDefault = !!isDefault;

    this.element = document.createElement('div');

    this.methodOptions = [
      {
        method: 'card',
        title: 'Cartão',
        icon: 'credit_card',
        disabled: false,
        selected: false
      },
      {
        method: 'money',
        title: 'Dinheiro',
        icon: 'attach_money',
        disabled: false,
        selected: true
      },
      {
        method: 'paid',
        title: 'Pago',
        icon: 'money_off',
        disabled: false,
        selected: false
      },
      {
        method: 'gift',
        title: 'Cortesia',
        icon: 'card_giftcard',
        disabled: false,
        selected: false
      }
    ];

    this.init();

  }

  init() {

    this.build();

    this.priceAmount = false;

    // update is default
    this.updateIsDefault(this.isDefault);

    // main listener
    this.orderPaymentItemRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      } else {

        // controladores de dados (usado quando envolve mais de um campo (ex: method + referenceValue))
        this.paidValueDataChangeController(snap.val());
        this.referenceValueDataChangeController(snap.val());

      }

    });

    // priceAmount listener (monitorar o valor total)
    this.orderBillingRef.child('priceAmount').on('value', snap => {

      this.priceAmount = snap.val();

      this.orderPaymentItemRef.once('value', snap => {

        this.referenceValueDataChangeController(snap.val());

      });

    });

    // adapts the UI for each payment method
    this.orderPaymentItemRef.child('method').on('value', () => this.methodDataChangeController());
    this.orderPaymentItemRef.child('isDefault').on('value', () => this.methodDataChangeController());

  }

  build() {

    this.element.className = 'OrderPaymentItem row';
    this.element.dataset.orderPaymentItemRefKey = this.orderPaymentItemRef.key;

    this.element.method = this.buildMethodSelectElement();
    this.element.referenceValue = this.buildReferenceValueFieldElement();
    this.element.paidValue = this.buildPaidValueFieldElement();
    this.element.deletePayment = this.buildDeletePaymentButtonElement();

  }

  buildMethodSelectElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-method input-field col s4';
    this.element.appendChild(element);

    element.select = document.createElement('select');
    // element.select.className = 'browser-default';
    element.appendChild(element.select);

    element.select.defaultOption = document.createElement('option');
    element.select.defaultOption.value = '';
    element.select.defaultOption.disabled = true;
    element.select.defaultOption.innerHTML = 'Métodos';
    element.select.addEventListener('change', event => {

      this.orderPaymentItemRef.child('method').set(element.select[event.target.selectedIndex].value);

    });
    this.orderPaymentItemRef.child('method').on('value', snap => {

      setTimeout(() => {

        for (let i = element.select.options.length; i--;)
          if (element.select.options[i].value === snap.val()) {
            element.select.options[i].setAttribute('selected', true);
            element.select.options.selectedIndex = i;
          } else {
            element.select.options[i].removeAttribute('selected');
          }

        element.instance = M.FormSelect.init(element.select);

      }, 1);

    });
    element.select.appendChild(element.select.defaultOption);

    let hasSelected = false;

    this.methodOptions.forEach(option => {

      let optionElement = document.createElement('option');
      optionElement.value = option.method;
      optionElement.disabled = option.disabled;
      optionElement.innerHTML = option.title;

      if (option.selected) {
        optionElement.setAttribute('selected', true);
        hasSelected = true;
      }

      element.select.appendChild(optionElement);

    });

    if (!hasSelected)
      element.select.defaultOption.setAttribute('selected', true);

    element.label = document.createElement('label');
    element.label.innerHTML = 'Pagamento';
    element.appendChild(element.label);

    setTimeout(() => element.instance = M.FormSelect.init(element.select), 1);

    return element;

  }

  buildPaidValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-paidValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-paidValueField';
    element.input.addEventListener('focus', () => {
      element.input.select();
    });
    element.input.addEventListener('change', () => this.updatePaidValue(element.input.value));
    this.orderPaymentItemRef.child('paidValue').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Pago';
    element.appendChild(element.label);

    return element;

  }

  buildReferenceValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-referenceValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-referenceValueField';
    element.input.addEventListener('focus', () => {
      element.input.select();
    });
    element.input.addEventListener('change', () => this.updateReferenceValue(element.input.value));
    this.orderPaymentItemRef.child('referenceValue').on('value', snap => {

      element.input.value = snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Valor';
    element.label.classList = 'active';
    element.appendChild(element.label);

    return element;

  }

  buildDeletePaymentButtonElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-actions col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect btn-floating btn-small white';
    element.buttonElement.innerHTML = '<i class="material-icons red-text">remove</i>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.appendChild(element);

    return element;

  }

  // adapts the UI for each payment method
  methodDataChangeController() {

    this.orderPaymentItemRef.child('method').once('value', snap => {

      switch (snap.val()) {
        case 'money': {
          this.element.referenceValue.input.disabled = this.isDefault;
          this.element.paidValue.input.disabled = false;
          this.element.paidValue.input.step = 10.00;
          this.element.paidValue.label.innerHTML = 'Troco p';
        }
          break;
        default: {
          this.element.referenceValue.input.disabled = this.isDefault;
          this.element.paidValue.input.disabled = true;
          this.element.paidValue.input.step = 1.00;
          this.element.paidValue.label.innerHTML = 'Pago';
        }
      }

    });

  }

  paidValueDataChangeController(data) {

    if (parseFloat(data.referenceValue) > parseFloat(data.paidValue))
      this.updatePaidValue(data.referenceValue);

    if (data.method !== 'money')
      this.updatePaidValue(data.referenceValue);

  }

  referenceValueDataChangeController(data) {

    try {
      if (this.priceAmount) {
        if (this.isDefault)
          this.updateReferenceValue(this.priceAmount);
        else if (parseFloat(data.referenceValue) > parseFloat(this.priceAmount))
          this.updateReferenceValue(this.priceAmount);
      }
    } catch (e) {
      console.log('eitaa..');
    }

  }

  updatePaidValue(value) {

    try {
      value = parseFloat(value).toFixed(2);
    } catch (e) {
      value = parseFloat(0).toFixed(2);
    } finally {
      value = isNaN(value) ? parseFloat(0).toFixed(2) : value;
    }

    this.orderPaymentItemRef.child('paidValue').set(value);

  }

  updateReferenceValue(value) {

    try {
      value = parseFloat(value).toFixed(2);
    } catch (e) {
      value = parseFloat(0).toFixed(2);
    } finally {
      value = isNaN(value) ? parseFloat(0).toFixed(2) : value;
    }

    this.orderPaymentItemRef.child('referenceValue').set(value);

  }

  updateIsDefault(state) {

    this.isDefault = !!state;

    this.orderPaymentItemRef.child('isDefault').set(this.isDefault);

  }

  delete() {

    this.orderPaymentItemRef.set(null);

  }

}