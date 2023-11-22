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

document.addEventListener("DOMContentLoaded", function () {
    // Lắng nghe sự kiện input trên ô mật khẩu
    document.getElementById("infixValue").addEventListener("input", function () {
        validateInfix();
    });
});

function validateInfix() {
    var infixStr = document.getElementById("infixValue").value;
    document.getElementById("infixError").innerHTML = "";
    var button = document.getElementById("btnConvert");

    // Biến để kiểm tra xem có lỗi hay không
    var hasError = false;
    // Vô hiệu hóa button
    button.disabled = false;

    // Kiểm tra nếu để trống
    if (infixStr === "") {
        document.getElementById("infixError").innerHTML += "Không được để trống biểu thức<br>";
        hasError = true;
        button.disabled = true;
    }

    // Kiểm tra nếu nhập chữ cái
    var validInputPattern = /^[\d\s+\-\/*\(\)\^]+$/;
    if (!validInputPattern.test(infixStr)) {
        document.getElementById("infixError").innerHTML += "Biểu thức trung tố phải là số<br>";
        hasError = true;
        button.disabled = true;
    }

    // Kiểm tra nhập liên tục 2 toán tử
    for (var i = 0; i < infixStr.length - 1; i++) {

        if (operatorCheckInput(infixStr[i]) && operatorCheckInput(infixStr[i + 1])) {
            document.getElementById("infixError").innerHTML += "Không được phép nhập liên tiếp 2 toán tử<br>";
            hasError = true;
            button.disabled = true;
        }
    }

    //kiểm tra đằng sau toán tử phải là toán hạng
    if (operatorCheckInput(infixStr[infixStr.length - 1])) {
        document.getElementById("infixError").innerHTML += "Biểu thức không được kết thúc hoặc băt đầu bằng một toán tử<br>";
        hasError = true;
        button.disabled = true;
    }

    //kiểm tra biểu thức phải có ít nhất 1 toán tử và 2 toán hạng
    var operandCount = (infixStr.match(/[\d]+/g) || []).length;
    var operatorCount = (infixStr.match(/[+\-*/^]+/g) || []).length;
    if (operandCount < 2 || operatorCount < 1) {
        document.getElementById("infixError").innerHTML += "Biểu thức phải có ít nhất 1 toán tử và 2 toán hạng<br>";
        hasError = true;
        button.disabled = true;
    }

    // Đặt màu sắc cho thông báo lỗi
    document.getElementById("infixError").style.color = "red";

    // Nếu biểu thức hợp lệ
    return !hasError;
}

function infixToPostfix(infix) {
    var postfix = [];
    var stack = [];

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

function roundToDecimalPlaces(number, decimalPlaces) {
    var factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}

function convertAndCalculate() {
    var infixValue = document.getElementById("infixValue").value;
    var postfixValue = infixToPostfix(infixValue);
    document.getElementById("postfixArea").hidden = false;
    document.getElementById("postfixValue").value = "Biểu thức hậu tố: " + postfixValue;

    var result = evaluatePostfix(postfixValue);
    document.getElementById("postfixResultArea").hidden = false;
    var roundedResult = Number.isInteger(result) ? result : roundToDecimalPlaces(result, 2);
    document.getElementById("postfixCal").value = "Kết quả biểu thức: " + roundedResult;
}

function resetValue() {
    document.getElementById("infixValue").value = ""
    document.getElementById("postfixArea").hidden = true;
    document.getElementById("postfixResultArea").hidden = true;
    document.getElementById("infixError").innerHTML = "";
}

