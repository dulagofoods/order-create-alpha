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
    this.element.actionsElement.className = 'OrderItems-actions row';
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