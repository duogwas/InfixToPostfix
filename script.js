function push_stack(stackArr, ele) {
    stackArr[stackArr.length] = ele;
}

function pop_stack(stackArr) {
    var _temp = stackArr[stackArr.length - 1];
    delete stackArr[stackArr.length - 1];
    stackArr.length--;
    return (_temp);
}

function isOperand(who) {
    return (!isOperator(who) ? true : false);
}

function isOperator(who) {
    return ((who == "+" || who == "-" || who == "*" || who == "/" || who == "(" || who == ")") ? true : false);
}

function topStack(stackArr) {
    return (stackArr[stackArr.length - 1]);
}

function isEmpty(stackArr) {
    return ((stackArr.length == 0) ? true : false);
}

/* Check for Precedence */
function prcd(char1, char2) {
    var char1_index, char2_index;
    var _def_prcd = "-+*/";
    for (var i = 0; i < _def_prcd.length; i++) {
        if (char1 == _def_prcd.charAt(i)) char1_index = i;
        if (char2 == _def_prcd.charAt(i)) char2_index = i;
    }
    if (((char1_index == 0) || (char1_index == 1)) && (char2_index > 1)) return false;
    else return true;
}

function isValidInput(infixStr) {
    // Check for empty input
    if (infixStr.trim() === "") {
        displayErrorMessage("Dữ liệu đầu vào không được để trống");
        return false;
    }

    // Check for consecutive operands or operators
    for (var i = 0; i < infixStr.length - 1; i++) {
        if (isOperand(infixStr[i]) && isOperand(infixStr[i + 1])) {
            displayErrorMessage("Dữ liệu đầu vào không phải là biểu thức");
            return false;
        }
        if (isOperator(infixStr[i]) && isOperator(infixStr[i + 1])) {
            displayErrorMessage("Dữ liệu đầu vào không phải là biểu thức");
            return false;
        }
    }

    // Check if the input only contains valid characters
    var validInputPattern = /^[\d+\-\/*\(\)]+$/;
    if (!validInputPattern.test(infixStr)) {
        displayErrorMessage("Dữ liệu đầu vào không phải là biểu thức");
        return false;
    }

    // Check if the input only contains valid characters
    // for (var i = 0; i < infixStr.length; i++) {
    //     if (!isOperand(infixStr[i]) && !isOperator(infixStr[i]) && !/[0-9]/.test(infixStr[i])) {
    //         displayErrorMessage("Dữ liệu đầu vào không phải là biểu thức");
    //         return false;
    //     }
    // }

    return true;
}

function displayErrorMessage(message) {
    var errorMessageDiv = document.getElementById("error_message");
    errorMessageDiv.innerHTML = message;
    setTimeout(function () {
        errorMessageDiv.innerHTML = "";
    }, 5000);
}

function InfixToPostfix() {
    var infixStr = document.input_form.infixVal.value;
    if (!isValidInput(infixStr)) {
        return;
    }
    var postfixStr = new Array();
    var stackArr = new Array();
    var postfixPtr = 0;
    infixStr = infixStr.split('');
    for (var i = 0; i < infixStr.length; i++) {
        if (isOperand(infixStr[i])) {
            postfixStr[postfixPtr] = infixStr[i];
            postfixPtr++;
        } else {
            while ((!isEmpty(stackArr)) && (prcd(topStack(stackArr), infixStr[i]))) {
                postfixStr[postfixPtr] = topStack(stackArr);
                pop_stack(stackArr);
                postfixPtr++;
            }
            if ((!isEmpty(stackArr)) && (infixStr[i] == ")")) {
                pop_stack(stackArr);
            } else {
                push_stack(stackArr, infixStr[i]);
            }
        }
    }
    while (!isEmpty(stackArr)) {
        postfixStr[postfixStr.length] = topStack(stackArr);
        pop_stack(stackArr);
    }

    var returnVal = '';
    for (var i = 0; i < postfixStr.length; i++) {
        returnVal += postfixStr[i];
    }
    document.input_form.postfixVal.value = returnVal;

    var result = PostfixEval(returnVal);
    document.input_form.resultVal.value = result;
}

function PostfixSubEval(num1, num2, sym) {
    var returnVal;
    if (sym == "+")
        returnVal = num1 + num2;
    if (sym == "-")
        returnVal = num1 - num2;
    if (sym == "*")
        returnVal = num1 * num2;
    if (sym == "/")
        returnVal = num1 / num2;
    return (returnVal);
}

function PostfixEval(postfixStr) {
    var stackArr = new Array();
    postfixStr = postfixStr.split('');
    for (var i = 0; i < postfixStr.length; i++) {
        if (isOperand(postfixStr[i])) {
            push_stack(stackArr, postfixStr[i]);
        } else {
            var temp = parseFloat(topStack(stackArr));
            pop_stack(stackArr);
            var pushVal = PostfixSubEval(parseFloat(topStack(stackArr)), temp, postfixStr[i]);
            pop_stack(stackArr);
            push_stack(stackArr, pushVal);
        }
    }
    return topStack(stackArr);
}

function Reset(){
    document.input_form.infixVal.value = "";
    document.input_form.postfixVal.value = "";
    document.input_form.resultVal.value = "";
    var errorMessageDiv = document.getElementById("error_message");
    errorMessageDiv.innerHTML = "";
}