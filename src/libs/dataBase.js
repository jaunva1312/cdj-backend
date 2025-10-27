

export function createUniqueID() {
    var max = 4294967295;
    var min = 0;
    var randomNumber = (Math.floor(min+ Math.random()*(max-min+1))).toString(16);
    //console.log(randomNumber);
    return randomNumber;
}