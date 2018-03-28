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

    this.element.chargeOptionField = this.buildChargeOptionField();


  }

  buildPriceAmountElement() {

    let element = document.createElement('div');
    element.className = 'OrderPayment-priceAmount col s6';
    this.orderRef.child('priceAmount').on('value', snap => {

      try {

        element.innerHTML = '<span>Total: ' + parseFloat(snap.val()).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL'
        }) + '</span>';

      } catch (e) {

        element.innerHTML = '<span>Total: ' + snap.val() + '</span>';

      }

    });

    this.element.appendChild(element);

    return element;

  }

  buildChargeOptionField() {

    let element = document.createElement('div');
    element.className = 'OrderPayment-chargeOption input-field col s6';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 0;
    element.inputElement.step = 1;
    element.inputElement.value = 0.00.toFixed(2);
    element.inputElement.id = this.orderRef.key + '-chargeOption';
    element.inputElement.addEventListener('focus', event => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('change', event => {

      try {
        element.inputElement.value = parseFloat(element.inputElement.value).toFixed(2);
      } catch (e) {
        console.log(e);
      }

      this.orderRef.child('changeOption').set(element.inputElement.value);

    });
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.className = 'active';
    element.labelElement.innerHTML = 'Troco para';
    element.appendChild(element.labelElement);


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

    });

    this.setPriceAmount(priceAmount);

  }

}