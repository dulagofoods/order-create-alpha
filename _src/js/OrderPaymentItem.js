class OrderPaymentItem {

  constructor(orderPaymentItemRef, orderRef) {

    this.orderPaymentItemRef = orderPaymentItemRef;
    this.orderRef = orderRef;

    this.paidValueRef = this.orderPaymentItemRef.child('paidValue');
    this.referenceValueRef = this.orderPaymentItemRef.child('referenceValue');
    this.isDefaultRef = this.orderPaymentItemRef.child('isDefault');
    this.isManuallyChangedRef = this.orderPaymentItemRef.child('isManuallyChanged');
    this.methodRef = this.orderPaymentItemRef.child('method');
    this.orderBillingRef = this.orderRef.child('billing');
    this.orderPriceAmountRef = this.orderBillingRef.child('priceAmount');

    this.element = document.createElement('div');
    this.isDeleted = false;
    this.data = {};
    this.priceAmount = null;

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

    this.updateIsDefault(this.data.isDefault);

    this.orderPaymentItemRef.on('value', snap => {

      if (snap.val() === null)
        this.element.classList.add('is-deleted');
      else
        this.dataChangeController(snap.val());

    });

    this.orderPriceAmountRef.on('value', snap => {

      this.priceAmount = snap.val();
      this.orderPaymentItemRef.once('value', () => this.dataChangeController());

    });

  }

  build() {

    this.element.className = 'OrderPaymentItem row';
    this.element.dataset.orderPaymentItemRefKey = this.orderPaymentItemRef.key;

    this.element.methodSelect = this.buildMethodSelectElement();
    this.element.referenceValueField = this.buildReferenceValueFieldElement();
    this.element.paidValueField = this.buildPaidValueFieldElement();
    this.element.deletePaymentField = this.buildDeletePaymentButtonElement();

  }

  buildMethodSelectElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-method input-field col s4';
    this.element.appendChild(element);

    element.select = document.createElement('select');
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
    element.input.addEventListener('focus', () => element.input.select());
    element.input.addEventListener('input', () => this.updateIsManuallyChanged(true));
    element.input.addEventListener('change', () => this.updatePaidValue(element.input.value, true));
    this.paidValueRef.on('value', snap => element.input.value = Order.parseValue(snap.val(), true));
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Pago';
    element.appendChild(element.label);

    this.methodRef.on('value', snap => {
      if (snap.val() === 'money') {
        element.input.disabled = false;
        element.input.step = 10.00;
        element.label.innerHTML = 'Troco p';
      } else {
        element.isManuallyChanged = false;
        element.input.disabled = true;
        element.input.step = 1.00;
        element.label.innerHTML = 'Pago';
      }
    });

    return element;

  }

  buildReferenceValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-referenceValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-referenceValueField';
    element.input.addEventListener('focus', () => element.input.select());
    element.input.addEventListener('input', () => this.updateIsManuallyChanged(true));
    element.input.addEventListener('change', () => this.updateReferenceValue(element.input.value, true));
    this.referenceValueRef.on('value', snap => element.input.value = Order.parseValue(snap.val(), true));
    this.isDefaultRef.on('value', snap => element.input.disabled = !!snap.val());
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
    element.buttonElement.addEventListener('click', () => this.delete());
    element.appendChild(element.buttonElement);

    this.element.appendChild(element);

    return element;

  }

  dataChangeController(data = false) {

    if (data)
      this.setData(data);

    if (this.priceAmount !== null && !this.isDeleted) {

      if (this.data.isDefault) {

        this.updateReferenceValue(this.priceAmount, true);

        if (this.data.method === 'money')
          this.updatePaidValue(this.priceAmount, this.priceAmount > this.data.paidValue);
        else
          this.updatePaidValue(this.priceAmount, true);

      } else if (this.data.isManuallyChanged) {

        this.updateReferenceValue(this.priceAmount, this.data.referenceValue > this.priceAmount);

        if (this.data.referenceValue > this.data.paidValue || this.data.method !== 'money')
          this.updatePaidValue(this.data.referenceValue, true);

      } else {

        this.updateReferenceValue(this.priceAmount);
        this.updatePaidValue(this.priceAmount);

      }

    }


  }

  setData(data) {

    this.data = {
      method: data.method || 'money',
      paidValue: Order.parseValue(data.paidValue),
      referenceValue: Order.parseValue(data.referenceValue),
      isDefault: data.isDefault || false,
      isManuallyChanged: data.isManuallyChanged || false
    }

  }

  updatePaidValue(value, isForced) {

    value = Order.parseValue(value);

    if (!this.data.isManuallyChanged || isForced || value === 0)
      this.paidValueRef.set(value);

  }

  updateReferenceValue(value, isForced) {

    value = Order.parseValue(value);

    if (!this.data.isManuallyChanged || isForced || value === 0)
      this.referenceValueRef.set(value);

  }

  updateIsDefault(state = false) {

    this.isDefaultRef.set(state);

  }

  updateIsManuallyChanged(state = false) {

    this.isManuallyChangedRef.set(state);

  }

  delete() {

    this.orderPaymentItemRef.set(null);
    this.isDeleted = true;

  }

  static create(orderBillingRef = false, method = 'money', priceAmount = 0) {

    if (orderBillingRef)
      return orderBillingRef.child('payments').push({
        method: method,
        paidValue: Order.parseValue(priceAmount),
        referenceValue: Order.parseValue(priceAmount)
      }).ref;

    return false;

  }

}