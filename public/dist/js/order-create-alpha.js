class Order {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.orderKey = this.orderRef.key;

    this.element = document.createElement('div');

    this.consumer = new OrderConsumer(this.orderRef);
    this.items = new OrderItemList(this.orderRef);
    this.payment = new OrderPayment();
    this.delivery = new OrderDelivery();

    this.init();

  }

  init() {

    this.build();

    // action listener
    this.orderRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

      // is new
      if (snap.val() === true) {

        this.focus();

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

    this.buildActionsElement();

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'Order-inner card-action';
    this.element.appendChild(this.element.actionsElement);

    this.element.deleteOrderButtonElement = document.createElement('button');
    this.element.deleteOrderButtonElement.className = 'waves-effect waves-red btn-flat';
    this.element.deleteOrderButtonElement.innerHTML = '<i class="material-icons left">delete</i>Excluir';
    this.element.deleteOrderButtonElement.addEventListener('click', () => {

      this.delete();

    });
    this.element.actionsElement.appendChild(this.element.deleteOrderButtonElement);

    this.element.printOrderButtonElement = document.createElement('button');
    this.element.printOrderButtonElement.className = 'waves-effect waves-light-blue btn light-blue';
    this.element.printOrderButtonElement.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    this.element.printOrderButtonElement.addEventListener('click', () => {

      this.delete();

    });
    this.element.actionsElement.appendChild(this.element.printOrderButtonElement);

  }

  focus() {

    this.consumer.focus();

  }

  delete() {

    this.orderRef.set(null);

  }

}
class OrderApp {

  constructor(element, ordersRef) {

    this.element = element;
    this.ordersRef = ordersRef;
    this.orderList = [];

    this.init();

  }

  init() {

    this.build();

    this.ordersRef.on('child_added', snap => {

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

    this.createOrderButton = document.createElement('a');
    this.createOrderButton.className = 'waves-effect waves-light btn orange light-1';
    this.createOrderButton.innerHTML = 'Criar pedido';
    this.createOrderButton.addEventListener('click', () => {
      this.createOrder();
    });
    this.actionButtons.append(this.createOrderButton);

    this.floatingActionButton = this.buildFloatingActionButton();
    this.actionButtons.appendChild(this.floatingActionButton);

  }

  buildFloatingActionButton() {

    const element = document.createElement('div');
    element.className = 'fixed-action-btn';

    // btn element
    element.btn = document.createElement('a');
    element.btn.className = 'btn-floating btn-large orange light-1';
    element.appendChild(element.btn);
    // icon
    element.btn.icon = document.createElement('i');
    element.btn.icon.className = 'large material-icons';
    element.btn.icon.innerHTML = 'add';
    element.btn.append(element.btn.icon);

    // list element
    element.list = document.createElement('ul');
    element.appendChild(element.list);

    // fist link option
    element.list.first = document.createElement('li');
    element.list.first.btn = document.createElement('a');
    element.list.first.btn.className = 'btn-floating red ';
    element.list.first.btn.icon = document.createElement('i');
    element.list.first.btn.icon.innerText = 'P';
    // element.list.first.btn.icon.className = 'material-icons';
    // element.list.first.btn.icon.innerHTML = 'insert_chart';
    element.list.first.btn.appendChild(element.list.first.btn.icon);
    element.list.first.appendChild(element.list.first.btn);
    element.list.appendChild(element.list.first);
    element.list.first.btn.addEventListener('click', event => {
      this.createOrder();
    });

    element.instance = M.FloatingActionButton.init(element);

    return element;

  }

  createOrder() {

    this.ordersRef.push(true);

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushOrder(orderRef) {

    if (orderRef) {

      let order = new Order(orderRef);
      this.orderList.push(order);
      this.element.orderListElement.insertBefore(order.element, this.element.orderListElement.firstChild);

    }

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

    var self = this;

    const element = document.createElement('div');
    element.className = 'input-field col s6';

    element.inputElement = document.createElement('input');
    element.inputElement.className = 'autocomplete';
    element.inputElement.type = 'text';
    element.inputElement.id = this.orderItemRef.key + '-itemName';
    element.inputElement.addEventListener('focus', event => {

      element.inputElement.select();

    });
    setTimeout(function () {

      try {

        var instance = M.Autocomplete.init(element.inputElement, {
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
          minLength: 2,
          limit: 6,
          onAutocomplete: function(event, asf) {
            console.log(event);
            console.log(element);
            console.log(self);
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

    element.label = document.createElement('label');
    element.label.htmlFor = element.inputElement.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Produto';
    element.appendChild(element.label);

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
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('quantity').set(element.inputElement.value);

    });
    this.orderItemRef.child('quantity').on('value', snap => {

      element.inputElement.value = snap.val();

    });
    element.appendChild(element.inputElement);

    element.label = document.createElement('label');
    element.label.htmlFor = element.inputElement.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Qtde';
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildItemPriceFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s3';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 0;
    element.inputElement.step = .01;
    element.inputElement.value = 0.00.toFixed(2);
    element.inputElement.id = this.orderItemRef.key + 'itemPrice';
    element.inputElement.addEventListener('focus', event => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('change', event => {
      try {
        element.inputElement.value = parseFloat(element.inputElement.value).toFixed(2)
      } catch (e) {
        console.log(e);
      }
      this.orderItemRef.child('itemPrice').set(element.inputElement.value);
    });
    this.orderItemRef.child('itemPrice').on('value', snap => {

      element.inputElement.value = snap.val();


    });
    element.appendChild(element.inputElement);

    element.label = document.createElement('label');
    element.label.htmlFor = element.inputElement.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Preço';
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildDeleteItemButtonElement() {

    const element = document.createElement('div');
    element.className = 'col s1';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect waves-light btn-floating red';
    element.buttonElement.innerHTML = '<i class="material-icons">delete</i>';
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

      if (snap.val() == null)
        this.addItem('Marmita P');

    });

    this.orderRef.child('items').on('child_added', snap => {

      this.pushItem(snap.ref);

    });

    this.orderRef.child('items').on('child_removed', snap => {

      this.delete(snap.ref);

    });

  }

  build() {

    this.element.className = 'OrderItemList';

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

  addItem(itemName, itemPrie) {

    this.orderRef.child('items').push({
      itemName: itemName || '',
      itemPrice: itemPrie || 0.00,
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
class OrderPayment {

  constructor() {

  }

}
/*!
 * Du Lago {ProjectName} Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2018 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/
