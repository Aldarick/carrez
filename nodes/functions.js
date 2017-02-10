function cleanArray(arrayToClean, valueToClean) {
    for (var i = 0; i < arrayToClean.length; i++) {
        if (arrayToClean[i] == deleteValue) {
            // If the value is the one we want to chop off, 
            // we suppress it from the array
            arrayToClean.splice(i, 1);
            
            // We suppress one element so the ones after it will have their index
            // decreased by one. 
            //  i  i+1 i+2 i+3       i  i+1 i+2  i+3       i  i+1 i+2 
            //| w | x | y | z | -> | w | x | __ | z | -> | w | x | z | 
            //Since the i variable will get increased, we decreased 
            // right before it, to avoid missing an element
            i--;
        }
    }
    return arrayToClean;
}