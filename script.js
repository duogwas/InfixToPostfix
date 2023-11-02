var stackarr = [];
var topp = -1;

function push(e) {
    topp++;
    stackarr[topp] = e;
}

function pop() {
    if (topp == -1)
        return 0;
    else {
        var popped_ele = stackarr[topp];
        topp--;
        return popped_ele;
    }
}

function operator(op) {
    if (op == '+' || op == '-' || op == '^' || op == '*' || op == '/' || op == '(' || op == ')' || op == '^') {
        return true;
    }
    else
        return false;
}

function operatorCheckInput(op) {
    if (op == '+' || op == '-' || op == '^' || op == '*' || op == '/' || op == '^') {
        return true;
    }
    else
        return false;
}

function precedency(pre) {
    if (pre == '@' || pre == '(' || pre == ')') {
        return 1;
    }
    else if (pre == '+' || pre == '-') {
        return 2;
    }
    else if (pre == '/' || pre == '*') {
        return 3;
    }
    else if (pre == '^') {
        return 4;
    }
    else
        return 0;
}

function isValidInput(infixStr) {
    // Check input rỗng
    if (infixStr.trim() === "") {
        displayErrorMessage("Dữ liệu đầu vào không được để trống");
        return false;
    }

    //check chỉ nhận số và toán tử
    var validInputPattern = /^[\d\s+\-\/*\(\)\^]+$/;
    if (!validInputPattern.test(infixStr)) {
        displayErrorMessage("Dữ liệu đầu vào không phải là biểu thức");
        return false;
    }

    //check không nhận liên tiếp 2 toán tử
    for (var i = 0; i < infixStr.length - 1; i++) {

        if (operatorCheckInput(infixStr[i]) && operatorCheckInput(infixStr[i + 1])) {
            displayErrorMessage("Không được nhập liên tục hai toán tử");
            return false;
        }
    }

    return true;
}

function displayErrorMessage(message) {
    var errorMessageDiv = document.getElementById("error_message");
    errorMessageDiv.innerHTML = message;
    setTimeout(function () {
        errorMessageDiv.innerHTML = "";
    }, 5000);
}

function infixToPostfix(infix) {
    var postfix = [];
    var stack = [];

    if (!isValidInput(infix)) {
        return;
    }

    for (var i = 0; i < infix.length; i++) {
        var token = infix[i];

        if (token === ' ') {
            continue; // Skip spaces
        }

        if (!isNaN(parseFloat(token))) {
            // Token is a number, accumulate digits and append to postfix
            var num = token;
            while (i + 1 < infix.length && !isNaN(parseFloat(infix[i + 1]))) {
                num += infix[i + 1];
                i++;
            }
            postfix.push(num);

        } else if (!operator(token)) {
            postfix.push(token);

        } else if (token === '(') {
            stack.push(token);

        } else if (token === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                postfix.push(stack.pop());
            }
            stack.pop(); // Remove the '('
        } else {
            while (stack.length > 0 && precedency(token) <= precedency(stack[stack.length - 1])) {
                postfix.push(stack.pop());
            }
            stack.push(token);
        }

    }

    while (stack.length > 0) {
        postfix.push(stack.pop());
    }

    return postfix.join(' '); // Join the postfix expression with spaces
}

function evaluatePostfix(postfix) {
    var stack = [];
    var tokens = postfix.trim().split(/\s+/); // Split the postfix expression by spaces

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (!operator(token)) {
            // If it's a number, push it to the stack
            stack.push(parseFloat(token));
        } else {
            // If it's an operator, perform the operation
            var operand2 = stack.pop();
            var operand1 = stack.pop();
            var result;
            switch (token) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '-':
                    result = operand1 - operand2;
                    break;
                case '*':
                    result = operand1 * operand2;
                    break;
                case '/':
                    result = operand1 / operand2;
                    break;
                case '^':
                    result = Math.pow(operand1, operand2);
                    break;
            }
            stack.push(result);
        }
    }

    return stack[0];
}

function convertAndCalculate() {
    var infixValue = document.getElementById("infixvalue").value;
    var postfix = infixToPostfix(infixValue);
    if (postfix == undefined) {
        document.getElementById("postfix").innerHTML = "";
    }
    else {
        document.getElementById("postfix").innerHTML = postfix;
    }
    var result = evaluatePostfix(postfix);
    document.getElementById("result").innerHTML = result;
}

function Reset() {
    document.getElementById("postfix").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("infixvalue").value="";
    var infixPlacehoder = document.getElementById("infixvalue");
    infixPlacehoder.placeholder = "Infix Expression";
    var errorMessageDiv = document.getElementById("error_message");
    errorMessageDiv.innerHTML = "";
}


