function Parent(val) {
    this.val = val;
}

Parent.prototype.getValue = function() {
    console.log(this.val);
}

function Child(val) {
    Parent.call(this, val);
}

Child.prototype = Object.create(Parent.prototype, {
    constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true
    },
})

let child = new Child(1);
child.getValue();

console.log(child instanceof Parent);