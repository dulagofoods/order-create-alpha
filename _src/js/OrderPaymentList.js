class OrderPaymentList {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.orderBillingRef = this.orderRef.child('billing');
    this.orderPaymentsRef = this.orderBillingRef.child('payments');
    this.orderPriceAmountRef = this.orderBillingRef.child('priceAmount');

    this.element = document.createElement('div');
    this.paymentList = [];

    this.priceAmount = false;

    this.init();

  }

  init() {

    this.build();

    this.orderPaymentsRef.on('child_added', snap => this.pushPaymentItem(snap.ref));
    this.orderPaymentsRef.on('child_removed', snap => this.delete(snap.ref));

    this.orderPriceAmountRef.on('value', snap => this.priceAmount = snap.val());

  }

  build() {

    this.element.className = 'OrderPaymentList row';

    this.element.paymentList = this.buildPaymentListElement();
    this.element.actions = this.buildActionsElement();

  }

  buildPaymentListElement() {

    const element = document.createElement('div');
    element.className = 'OrderItemList-list';
    this.element.appendChild(element);

    return element;

  }

  buildActionsElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentList-actions';
    this.element.appendChild(element);

    element.addItemButton = document.createElement('button');
    element.addItemButton.className = 'waves-effect waves-light btn-small green light-1';
    element.addItemButton.innerHTML = 'Adicionar Pagamento';
    element.addItemButton.addEventListener('click', () => {

      this.addItem('money');

    });
    element.appendChild(element.addItemButton);

    return element;

  }

  addItem(method) {

    this.orderBillingRef.child('payments').push({
      method: method || '',
      paidValue: this.priceAmount ? parseFloat(this.priceAmount).toFixed(2) : 0.00,
      referenceValue: this.priceAmount ? parseFloat(this.priceAmount).toFixed(2) : 0.00
    });

  }

  pushPaymentItem(orderPaymentItemRef) {

    if (orderPaymentItemRef) {

      let paymentItem = new OrderPaymentItem(orderPaymentItemRef, this.orderBillingRef, !this.paymentList.length);
      this.paymentList.push(paymentItem);
      this.element.paymentList.appendChild(paymentItem.element);

      // isDefault significa que o método de pagamento é unico e deve ter o valor fixo baseado do priceAmount
      if (this.paymentList.length > 1)
        this.paymentList.forEach(orderPaymentItem => orderPaymentItem.updateIsDefault(false));

    }

  }

  delete(orderPaymentItemRef) {

    for (let i = this.paymentList.length; i--; ) {

      if (this.paymentList[i].orderPaymentItemRef.key === orderPaymentItemRef.key)
        this.paymentList.splice(i, 1);

    }

    if (this.paymentList.length === 1)
      this.paymentList[0].updateIsDefault(true);

  }

}