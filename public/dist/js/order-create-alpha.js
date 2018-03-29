class Order {

  constructor(orderRef, socket, autoInit) {

    this.orderRef = orderRef;
    this.orderKey = this.orderRef.key;

    this.socket = socket || false;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.consumer = new OrderConsumer(this.orderRef);
    this.items = new OrderItemList(this.orderRef);
    this.priceAmount = new OrderPriceAmount(this.orderRef);
    this.delivery = new OrderDelivery();

    this.build();

    // action listener
    this.orderRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'Order card grey lighten-5';

    this.element.contentElement = document.createElement('div');
    this.element.contentElement.className = 'Order-inner card-content';
    this.element.appendChild(this.element.contentElement);

    this.element.contentElement.appendChild(this.consumer.element);
    this.element.contentElement.appendChild(this.items.element);
    this.element.contentElement.appendChild(this.priceAmount.element);

    this.buildActionsElement();

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'Order-inner card-action';
    this.element.appendChild(this.element.actionsElement);

    this.element.printOrderButtonElement = document.createElement('button');
    this.element.printOrderButtonElement.className = 'waves-effect waves-light-blue btn light-blue';
    this.element.printOrderButtonElement.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    this.element.printOrderButtonElement.addEventListener('click', () => {

      Order.print(this.orderRef, this.socket);

    });
    this.element.actionsElement.appendChild(this.element.printOrderButtonElement);

    this.element.deleteOrderButtonElement = document.createElement('button');
    this.element.deleteOrderButtonElement.className = 'waves-effect waves-red btn-flat';
    this.element.deleteOrderButtonElement.innerHTML = '<i class="material-icons left">delete</i>Excluir';
    this.element.deleteOrderButtonElement.addEventListener('click', () => {

      if (window.confirm('Tem certeza?')) {

        this.delete();

        try {

          M.toast({
            html: 'Pedido Excluido!'
          });

        } catch (e) {

          console.log('materialize error');

        }

      }

    });
    this.element.actionsElement.appendChild(this.element.deleteOrderButtonElement);

  }

  focus() {

    this.consumer.focus();

  }

  delete() {

    this.orderRef.set(null);

  }

  static print(orderRef, socket) {

    if (socket) {

      orderRef.once('value', snap => {

        console.log('enviando dados para impressao via socket...');
        socket.emit('print order', snap.val());

      });

    }

  }

  static create(ordersRef) {

    let createdTime = moment().toISOString();

    const orderRef = ordersRef.push({
      createdTime: createdTime
    }).ref;
    orderRef.child('items').push({
      itemPrice: 0.00,
      quantity: 1
    });

    return orderRef;

  }

}
class OrderApp {

  constructor(element, ordersRef, socket) {

    this.element = element;
    this.ordersRef = ordersRef;
    this.socket = socket;

    this.activeOrderKey = false;

    this.init();

  }

  init() {

    this.build();

    this.ordersRef.orderByChild('createdTime').on('child_added', snap => {

      this.pushOrder(snap.ref);

    });

  }

  build() {

    this.innerElement = document.createElement('div');
    this.innerElement.className = 'OrderApp-inner';
    this.element.append(this.innerElement);

    this.element.orderListElement = document.createElement('div');
    this.element.orderListElement.className = 'OrderApp-orderList';
    this.innerElement.append(this.element.orderListElement);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.innerElement.append(this.actionButtons);

    this.floatingActionButton = this.buildFloatingActionButton();
    this.actionButtons.appendChild(this.floatingActionButton);

  }

  buildFloatingActionButton() {

    const element = document.createElement('div');
    element.className = 'fixed-action-btn';

    // btn element
    element.btn = document.createElement('a');
    element.btn.className = 'waves-effect waves-light btn-floating btn-large orange light-1';
    element.appendChild(element.btn);
    // icon
    element.btn.icon = document.createElement('i');
    element.btn.icon.className = 'large material-icons';
    element.btn.icon.innerHTML = 'add';
    element.btn.append(element.btn.icon);
    element.btn.addEventListener('click', event => {
      this.createOrder();
    });

    // TODO criar items no botao flutuante principal para produtos
    // list element
    // element.list = document.createElement('ul');
    // element.appendChild(element.list);

    // fist link option
    // element.list.first = document.createElement('li');
    // element.list.first.btn = document.createElement('a');
    // element.list.first.btn.className = 'btn-floating red ';
    // element.list.first.btn.icon = document.createElement('i');
    // element.list.first.btn.icon.className = 'material-icons';
    // element.list.first.btn.icon.innerHTML = 'insert_chart';
    // element.list.first.btn.appendChild(element.list.first.btn.icon);
    // element.list.first.appendChild(element.list.first.btn);
    // element.list.appendChild(element.list.first);

    element.instance = M.FloatingActionButton.init(element);

    return element;

  }

  createOrder() {

    this.activeOrderKey = Order.create(this.ordersRef).key;

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushOrder(orderRef) {

    let self = this;

    if (orderRef) {

      let order = new Order(orderRef, this.socket);
      this.element.orderListElement.insertBefore(order.element, this.element.orderListElement.firstChild);
      order.init();

      // seta o focus para o pedido
      setTimeout(function () {

        if (self.activeOrderKey === orderRef.key)
          order.focus();

      }, 1);

    }

  }

}
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
class OrderConsumer {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.build();

  }

  build() {

    this.element.className = 'OrderConsumer row';

    this.element.appendChild(this.buildConsumerNameField());

  }

  buildConsumerNameField() {

    this.nameFieldElement = document.createElement('div');
    this.nameFieldElement.className = 'OrderConsumer-consumerNameField input-field col s12';

    // input
    this.nameFieldElement.inputElement = document.createElement('input');
    this.nameFieldElement.inputElement.className = 'validate';
    this.nameFieldElement.inputElement.id = this.orderRef.key + '-consumerName';
    this.nameFieldElement.inputElement.type = 'text';
    this.nameFieldElement.inputElement.addEventListener('input', () => {

      this.orderRef.child('consumerName').set(this.nameFieldElement.inputElement.value);

    });
    this.orderRef.child('consumerName').on('value', snap => {

      this.nameFieldElement.inputElement.value = snap.val();

    });
    this.nameFieldElement.appendChild(this.nameFieldElement.inputElement);

    // label
    this.nameFieldElement.labelElement = document.createElement('label');
    this.nameFieldElement.labelElement.className = 'active';
    this.nameFieldElement.labelElement.htmlFor = this.nameFieldElement.inputElement.id;
    this.nameFieldElement.labelElement.innerHTML = 'Nome';
    this.nameFieldElement.appendChild(this.nameFieldElement.labelElement);

    M.updateTextFields();

    return this.nameFieldElement;

  }

  focus() {

    this.nameFieldElement.inputElement.focus();

  }

}
class OrderDelivery {

  constructor() {

  }

}
class OrderItem {

  constructor(orderItemRef) {

    this.orderItemRef = orderItemRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

    // action listener
    this.orderItemRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'OrderItem row';
    this.element.dataset.orderItemKey = this.orderItemRef.key;

    this.element.itemNameFieldElement = this.buildItemNameFieldElement();
    this.element.itemQuantityFieldElement = this.buildItemQuantityFieldElement();
    this.element.itemPriceFieldElement = this.buildItemPriceFieldElement();
    this.element.deleteItemButtonElement = this.buildDeleteItemButtonElement();

  }

  buildItemNameFieldElement() {

    let self = this;

    const element = document.createElement('div');
    element.className = 'input-field col s5';

    element.inputElement = document.createElement('input');
    element.inputElement.className = 'autocomplete';
    element.inputElement.type = 'text';
    element.inputElement.id = this.orderItemRef.key + '-itemName';
    element.inputElement.addEventListener('focus', event => {

      element.inputElement.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.inputElement, {
          data: {
            "Marmita P": null,
            "Marmita M": null,
            "Marmita G": null,
            "Marmita F": null,
            "Coca Lata 220ml": null,
            "Coca Lata 350ml": null,
            "Fanta Lata 350ml": null,
            "Sprite Lata 350ml": null,
            "Fanta Guarana Lata 350ml": null,
            "Coca 600ml": null,
            "Coca 1 Litro": null,
            "Coca 2 Litros": null,
            "Conquista 2 Litros": null,
            "Suco Prats 330ml": null,
            "Suco DeLVale Uva": null,
            "Suco DeLVale Laranja": null
          },
          minLength: 0,
          limit: 6,
          onAutocomplete: function(select) {
            switch (select) {
              case 'Marmita P': {
                self.element.itemPriceFieldElement.inputElement.value = 8.00
              }
                break;
              case 'Marmita M': {
                self.element.itemPriceFieldElement.inputElement.value = 9.00
              }
                break;
              case 'Marmita G': {
                self.element.itemPriceFieldElement.inputElement.value = 11.00
              }
                break;
              case 'Marmita F': {
                self.element.itemPriceFieldElement.inputElement.value = 14.00
              }
                break;
              default: {
                console.log('hehe');
              }
            }
          }
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('itemName').set(element.inputElement.value);

    });
    this.orderItemRef.child('itemName').on('value', snap => {

      element.inputElement.value = snap.val();

    });
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.className = 'active';
    element.labelElement.innerHTML = 'Produto';
    element.appendChild(element.labelElement);

    this.element.appendChild(element);

    return element;

  }

  buildItemQuantityFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s2';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 1;
    element.inputElement.value = 1;
    element.inputElement.id = this.orderItemRef.key + 'itemQuantity';
    element.inputElement.addEventListener('focus', event => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('quantity').set(element.inputElement.value);

    });
    this.orderItemRef.child('quantity').on('value', snap => {

      element.inputElement.value = snap.val();

    });
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.className = 'active';
    element.labelElement.innerHTML = 'Qtde';
    element.appendChild(element.labelElement);

    this.element.appendChild(element);

    return element;

  }

  buildItemPriceFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s3';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 0;
    element.inputElement.step = 1;
    element.inputElement.value = 0.00.toFixed(2);
    element.inputElement.id = this.orderItemRef.key + 'itemPrice';
    element.inputElement.addEventListener('focus', event => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('blur', event => {

      try {
        element.inputElement.value = parseFloat(element.inputElement.value).toFixed(2);
      } catch (e) {
        console.log(e);
      }

      this.orderItemRef.child('itemPrice').set(element.inputElement.value);

    });
    element.inputElement.addEventListener('change', event => {

      try {
        element.inputElement.value = parseFloat(element.inputElement.value).toFixed(2);
      } catch (e) {
        console.log(e);
      }

      this.orderItemRef.child('itemPrice').set(element.inputElement.value);

    });
    this.orderItemRef.child('itemPrice').on('value', snap => {

      element.inputElement.value = snap.val();


    });
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.className = 'active';
    element.labelElement.innerHTML = 'Preço';
    element.appendChild(element.labelElement);

    this.element.appendChild(element);

    return element;

  }

  buildDeleteItemButtonElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-actions col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect waves-light btn-floating btn-small red';
    element.buttonElement.innerHTML = '<i class="material-icons">remove</i>';
    // element.buttonElement.innerHTML = '<span class="new badge red">drop</span>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.appendChild(element);

    return element;

  }

  delete() {

    this.orderItemRef.set(null);

  }

}
class OrderItemList {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');
    this.itemList = [];

    this.init();

  }

  init() {

    this.build();

    this.orderRef.child('items').once('value', snap => {

      // if (snap.val() == null)
      //   this.addItem('Marmita P');

    });

    this.orderRef.child('items').on('child_added', snap => {

      this.pushItem(snap.ref);

    });

    this.orderRef.child('items').on('child_removed', snap => {

      this.delete(snap.ref);

    });

  }

  build() {

    this.element.className = 'OrderItemList row';

    this.buildItemListElement();

    this.buildActionsElement();

  }

  buildItemListElement() {

    this.element.itemListElement = document.createElement('div');
    this.element.itemListElement.className = 'OrderItemList-list';
    this.element.appendChild(this.element.itemListElement);

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'OrderItems-actions';
    this.element.appendChild(this.element.actionsElement);

    this.element.addItemButton = document.createElement('button');
    this.element.addItemButton.className = 'waves-effect waves-light btn orange light-1';
    this.element.addItemButton.innerHTML = 'Adicionar Produto';
    this.element.addItemButton.addEventListener('click', () => {

      this.addItem();

    });
    this.element.actionsElement.appendChild(this.element.addItemButton);

  }

  addItem(itemName, itemPrice) {

    this.orderRef.child('items').push({
      itemName: itemName || '',
      itemPrice: itemPrice ||  0.00,
      quantity: 1
    });

    try {

      if (this.orderRef)
        M.toast({
          html: 'Item Adicionado!'
        });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushItem(orderItemRef) {

    if (orderItemRef) {

      let orderItem = new OrderItem(orderItemRef);
      this.itemList.push(orderItem);
      this.element.itemListElement.appendChild(orderItem.element);

    }

  }

  delete(orderItemRef) {

    for (let i = this.itemList.length; i--; ) {

      if (this.itemList[i].orderItemRef.key === orderItemRef.key)
        this.itemList.splice(i, 1);

    }

  }

}
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

    this.inputFieldElement = this.buildInputFieldElement();
    this.switcherElement = this.buildSwitcherElement();

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

  setPriceAmount(priceAmount) {

    const self = this;

    this.priceAmount = priceAmount;

    // isso evita que seja criado novamente o objeto no firebase
    this.orderRef.once('value', snap => {

      if (snap.val() != null && !this.priceAmountUnlocked)
          self.orderRef.child('priceAmount').set(self.priceAmount);

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
/*!
 * Du Lago {ProjectName} Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2018 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/
