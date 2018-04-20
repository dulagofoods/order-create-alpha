class Tag {

  constructor(text = '', optionalClass = ['font-green', 'border-green']) {

    this.text = text;
    this.optionalClass = optionalClass;

    this.element = document.createElement('li');

    this.build();

  }

  build() {

    this.element.className = 'Tag';

    if (Array.isArray(this.optionalClass))
      this.optionalClass.forEach(optionalClass => this.element.classList.add(optionalClass));
    else
      this.element.classList.add(this.optionalClass);

    this.element.span = document.createElement('span');
    this.element.span.innerHTML = this.text;
    this.element.appendChild(this.element.span);

  }

}