class OrderPriceAmount {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.priceList = [];
    this.priceAmount = 0.00;
    this.priceAmountUnlocked = false;

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

    this.orderRef.child('priceAmountUnlocked').on('value', snap => {

      this.priceAmountUnlocked = !!snap.val();

    });

  }

  build() {

    this.element.className = 'OrderPriceAmount row';

    this.inputField = this.buildInputFieldElement();
    this.switcher = this.buildSwitcherElement();

  }

  buildInputFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s6';

    element.input = document.createElement('input');
    element.input.id = this.orderRef.key + '-priceAmountInput';
    element.input.type = 'number';
    element.input.min = '0.00';
    element.input.step = '1';
    element.input.disabled = true;
    element.input.addEventListener('blur', event => {

      element.input.value = parseFloat(element.input.value).toFixed(2);

    });
    element.input.addEventListener('change', event => {

      element.input.value = parseFloat(element.input.value).toFixed(2);
      this.orderRef.child('priceAmount').set(parseFloat(element.input.value).toFixed(2));

    });
    this.orderRef.child('priceAmount').on('value', snap => {

      element.input.value = parseFloat(snap.val()).toFixed(2);

    });
    this.orderRef.child('priceAmountUnlocked').on('value', snap => {

      element.input.disabled = !snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.className = 'active';
    element.label.innerHTML = 'Total';
    element.label.htmlFor = element.input.id;
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildSwitcherElement() {

    const element = document.createElement('div');
    element.className = 'switch col s6';

    element.label = document.createElement('label');
    element.appendChild(element.label);

    element.input = document.createElement('input');
    element.input.type = 'checkbox';
    element.input.addEventListener('change', event => {

      this.orderRef.child('priceAmountUnlocked').set(element.input.checked);

      if (!element.input.checked)
        this.refreshPriceAmount();

    });
    this.orderRef.child('priceAmountUnlocked').on('value', snap => {

      element.input.checked = !!snap.val();

    });
    element.label.appendChild(element.input);

    element.label.span = document.createElement('span');
    element.label.span.className = 'lever';
    element.label.appendChild(element.label.span);

    element.label.text = document.createTextNode('alterar');
    element.label.appendChild(element.label.text);

    this.element.appendChild(element);

    return element;

  }

  updatePriceAmount(orderItemRef, data) {

    if (data)
      this.priceList[orderItemRef.key] = {
        itemPrice: data.itemPrice || 0,
        quantity: data.quantity || 0
      };
    else
      this.priceList[orderItemRef.key] = null;

    this.refreshPriceAmount();

  }

  refreshPriceAmount() {

    let priceAmount = 0;

    let priceListArray = Object.values(this.priceList);
    priceListArray.forEach(orderItem => {

      if (orderItem != null)
        priceAmount += orderItem.itemPrice * orderItem.quantity;

    });

    this.setPriceAmount(priceAmount);

  }

  setPriceAmount(priceAmount) {

    const self = this;

    this.priceAmount = priceAmount;

    // isso evita que seja criado novamente o objeto no firebase
    this.orderRef.once('value', snap => {

      if (snap.val() != null && !this.priceAmountUnlocked)
        self.orderRef.child('priceAmount').set(self.priceAmount);

    });

  }

}