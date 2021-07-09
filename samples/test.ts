interface SomeInterface {
    propFromIntf: number[];
};

class SomeClass implements SomeInterface {
    propFromIntf: number[];
    someProp: string;
}

class CompositionClass {
    someClass: SomeClass;
}

const constFunc = function(test: string) {
    console.log(test);
};

function normalFunc() {
    console.log(undefined, null, 123, true, new String('string'), {}, [],
        Symbol("yo"), globalThis, window, /^#?([\w-]+)$/);
    let unused = "faded";
    const dotAccess = window.document.querySelector;
}
