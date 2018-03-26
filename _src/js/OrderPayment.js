class OrderPayment {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.priceList = [];
    this.priceAmount = 0.00;

    this.init();

  }

  init() {

    this.build();

    this.orderRef.child('items').on('child_added', snap => {

      this.updatePriceAmount(snap.ref, snap.val());

    });

    this.orderRef.child('items').on('child_changed', snap => {

      this.updatePriceAmount(snap.ref, snap.val());

    });

    this.orderRef.child('items').on('child_removed', snap => {

      this.updatePriceAmount(snap.ref, null);

    });

  }

  build() {

    this.element.className = 'OrderPayment row';

    this.element.priceAmountElement = this.buildPriceAmountElement();


  }

  buildPriceAmountElement() {

    let element = document.createElement('span');
    this.orderRef.child('priceAmount').on('value', snap => {

      try {

        element.innerHTML = 'Total: ' + parseFloat(snap.val()).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL'
        });

      } catch (e) {

        element.innerHTML = 'Total: ' + snap.val();

      }

    });

    this.element.appendChild(element);

    return element;

  }

  setPriceAmount(priceAmount) {

    this.priceAmount = priceAmount;

    // isso evita que seja criado novamente o objeto no firebase
    this.orderRef.on('value', snap => {

      if (snap.val() != null)
        this.orderRef.child('priceAmount').set(this.priceAmount);

    });

  }

  updatePriceAmount(orderItemRef, data) {

    let priceAmount = 0;

    if (data)
      this.priceList[orderItemRef.key] = {
        itemPrice: data.itemPrice || 0,
        quantity: data.quantity || 0
      };
    else
      this.priceList[orderItemRef.key] = null;

    let priceListArray = Object.values(this.priceList);
    priceListArray.forEach(orderItem => {

      if (orderItem != null)
        priceAmount += orderItem.itemPrice * orderItem.quantity;
      else
        priceAmount = 0;

    });

    this.setPriceAmount(priceAmount);

  }

}