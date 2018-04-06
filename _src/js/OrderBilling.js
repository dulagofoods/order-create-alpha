class OrderBilling {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.priceAmount = new OrderPriceAmount(this.orderRef);
    this.paymentList = new OrderPaymentList(this.orderRef);

    this.build();

  }

  build() {

    this.element.className = 'OrderBilling row';

    this.element.appendChild(this.priceAmount.element);
    this.element.appendChild(this.paymentList.element);

  }

}