var stackarr=[];
var topp=-1;

function push(e)
{
   topp++;
   stackarr[topp]=e;
}

function pop()
{
    if(topp==-1)
    return 0;
    else
    {
        var popped_ele=stackarr[topp];
        topp--;
        return popped_ele;
    }
}

function operator(op)
{
    if(op=='+' || op=='-' || op=='^' || op=='*' || op=='/' || op=='(' || op==')')
    {
        return true;
    }
    else
    return false;
}

function precedency(pre)
{
    if(pre=='@' || pre=='(' || pre==')')
    {
        return 1;
    }
    else if(pre=='+' || pre=='-')
    {
        return 2;
    }
    else if (pre=='/' || pre=='*')
    {
        return 3;
    }
    else if(pre=='^')
    {
        return 4;
    }
    else
    return 0;
}

function infixToPostfix(infix) {
    var postfix = [];
    var stack = [];

    for (var i = 0; i < infix.length; i++) {
        var token = infix[i];

        if (!operator(token)) {
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

    return postfix.join('');
}


 
function evaluatePostfix(postfix) {
    var stack = [];
    for (var i = 0; i < postfix.length; i++) {
        var token = postfix[i];
        if (!operator(token)) {
            stack.push(parseFloat(token));
        } else {
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
            }
            stack.push(result);
        }
    }
    return stack[0];
}

function convertAndCalculate() {
    var infixValue = document.getElementById("infixvalue").value;
    var postfix = infixToPostfix(infixValue);
    document.getElementById("postfix").innerHTML = postfix;
    var result = evaluatePostfix(postfix);
    document.getElementById("result").innerHTML = result;
}


