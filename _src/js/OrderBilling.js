class OrderBilling {

  constructor(order) {

    this.order = order;

    this.orderRef = this.order.orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.priceAmount = new OrderPriceAmount(this.order);
    this.paymentList = new OrderPaymentList(this.order);

    this.build();

  }

  build() {

    this.element.className = 'OrderBilling row';

    this.element.appendChild(this.priceAmount.element);
    this.element.appendChild(this.paymentList.element);

  }

}