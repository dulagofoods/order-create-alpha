class OrderBilling {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.paymentMethodList = [];

    this.init();

  }

  init() {

    this.build();

  }

  build() {

    this.element.className = 'OrderBilling';

  }



}