class OrderList {

  pushOrder(orderRef) {

    let self = this;

    if (orderRef) {

      let order = new Order(orderRef, this.socket);
      this.element.ordersGrid.insertBefore(order.element, this.element.ordersGrid.firstChild);
      order.init();

      if (this.activeOrderKey === orderRef.key)
        self.activeOrderElement = order.element;

      // seta o focus para o pedido
      setTimeout(function () {

        if (self.activeOrderKey === orderRef.key)
          order.focus();

      }, 1);

    }

  }

}