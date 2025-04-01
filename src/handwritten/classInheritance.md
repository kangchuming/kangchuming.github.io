class Parent {
    constructor(val) {
        this.val = val;
    }

   getValue() {
        console.log(this.val)
    }
}

Class Child extends Parent {
    constructor(val) {
        super(val);
    }
}

let child = new Child(1);
child.getValue();

console.log(child instanceof Parent);
