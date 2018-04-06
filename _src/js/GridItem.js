class GridItem {

  constructor(parentGrid, id, buildElement) {

    this.parentGrid = parentGrid;

    if (buildElement)
      this.build(id);

  }

  build() {

    this.element = document.createElement('div');
    this.element.className = 'Item';
    this.element.dataset.id = this.id;

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Item-inner';
    this.element.inner.innerHTML = this.id;
    this.element.appendChild(this.element.inner);

  }

  resize(width, height) {

    this.element.style.width = width + 'px';

  }

  translate(tx, ty) {

    tx = tx + 'px';
    ty = ty + 'px';

    this.element.style.transform = 'translate3d(' + tx + ', ' + ty + ',0)';

  }

}