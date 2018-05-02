class OrderPaymentList {

  constructor(order) {

    this.order = order;

    this.orderRef = this.order.orderRef;
    this.orderBillingRef = this.orderRef.child('billing');
    this.orderPaymentsRef = this.orderBillingRef.child('payments');

    this.element = document.createElement('div');
    this.paymentList = [];

    this.init();

  }

  init() {

    this.build();

    this.orderPaymentsRef.on('child_added', snap => this.pushPaymentItem(snap.ref));
    this.orderPaymentsRef.on('child_removed', snap => this.removePaymentItem(snap.ref));

    // update 'isDefault' status of payments
    this.orderPaymentsRef.on('value', snap => {

      const self = this;

      if (snap.val())
        setTimeout(() => {

          let arr = Object.keys(snap.val());

          if (arr.length !== 1)
            arr.forEach(paymentKey => self.paymentList[paymentKey].updateIsDefault(false));
          else if (arr.length === 1)
            self.paymentList[arr[0]].updateIsDefault(true);

        }, 1);

    })

  }

  build() {

    this.element.className = 'OrderPaymentList row';

    this.element.paymentList = this.buildPaymentListElement();
    this.element.priceAssistant = this.buildPriceAssistantElement();
    this.element.actions = this.buildActionsElement();

  }

  buildPaymentListElement() {

    const element = document.createElement('div');
    element.className = 'OrderItemList-list';
    this.element.appendChild(element);

    return element;

  }

  buildPriceAssistantElement() {

    const self = this;

    const element = document.createElement('span');
    element.className = 'OrderPaymentList-priceAssistant font-orange';
    this.element.appendChild(element);

    function update(data = {}) {

      if (data.priceAmount && data.payments) {

        const priceAmount = Order.parseValue(data.priceAmount);
        const payments = data.payments;

        let paymentsPriceAmount = 0;

        Object.values(payments).forEach(payment => paymentsPriceAmount += Order.parseValue(payment.referenceValue));

        let overprice = paymentsPriceAmount - priceAmount;

        if (overprice > 0) {
          element.classList.add('is-active');
          element.innerHTML = '<span>O Valor está R$' + overprice.toFixed(2) + ' acima</span>'
        } else if (overprice < 0) {
          element.classList.add('is-active');
          element.innerHTML = '<span>O Valor está R$' + Math.abs(overprice).toFixed(2) + ' abaixo</span>'
        } else {
          element.classList.remove('is-active');
          element.innerHTML = '';
        }

      } else {
        element.classList.remove('is-active');
        element.innerHTML = '';
      }

    }

    setTimeout(() => self.orderBillingRef.on('value', snap => update(snap.val())), 10);

    return element;

  }

  buildActionsElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentList-actions';
    this.element.appendChild(element);

    element.addItemButton = document.createElement('button');
    element.addItemButton.className = 'waves-effect waves-light btn-small green light-1';
    element.addItemButton.innerHTML = 'Adicionar Pagamento';
    element.addItemButton.addEventListener('click', () => OrderPaymentItem.create(this.orderBillingRef, 'money'));
    element.appendChild(element.addItemButton);

    return element;

  }

  pushPaymentItem(orderPaymentItemRef) {

    if (orderPaymentItemRef) {

      const paymentItem = new OrderPaymentItem(orderPaymentItemRef, this.orderRef);
      this.element.paymentList.appendChild(paymentItem.element);
      this.paymentList[orderPaymentItemRef.key] = paymentItem;

    }

  }

  removePaymentItem(orderPaymentItemRef) {

    if (this.paymentList[orderPaymentItemRef.key])
      delete this.paymentList[orderPaymentItemRef.key];

  }

}