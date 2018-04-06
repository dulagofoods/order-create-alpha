class OrdersGridItem extends GridItem {

  constructor(order, parentGrid) {

    super(parentGrid, order.orderKey, false);

    this.order = order;

    this.orderKey = order.orderKey;
    this.element = order.element;
    this.element.classList.add('OrdersGridItem');


  }

}