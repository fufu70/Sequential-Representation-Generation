/**
 * JavaScript Binary Expression Tree
 * 
 * @author Christopher Stoll
 * @copyright Christopher Stoll 2010
 * @version 1.0
 * 2010-10-10
 */


module.exports = (expr) => {

/**
 * This is a node data type
 *
 * @constructor
 * @param {string} pVal The value the node holds
 * @param {node} pLeft The left child node
 * @param {node} pRight The right child node
 * @param {bool} pParend The node is in parentheses
 */
function node(pVal, pLeft, pRight, pParend) {
 this.val = pVal || 0;
 this.left = pLeft || 0;
 this.right = pRight || 0;
 this.weight = this.weigh(this.val);
 this.isparend = pParend || false;
}
 /**
  * This is the order of operations scale
  * (parenthese would score 1 and operands 0)
  */
 node.prototype.scale = {
  '-': 4,
  '+': 4,
  '/': 3,
  '*': 3,
  '^': 2
 } 

 /**
  * Calculates node weight
  * (based upon order of operations scale)
  *
  * @this {node}
  * @param {string} pVal The node value
  * @returns {numeric} The weight type
  */
 node.prototype.weigh = function(pVal){
  var result = 0;
  if(pVal){
   if(this.scale[pVal]){
    result = this.scale[pVal];
   }
  }
  return result;
 }
 
 /**
  * Set the node value
  * (triggers weight recalculation)
  *
  * @this {node}
  * @param {string} pVal The new node value
  */
 node.prototype.setVal = function(pVal){
  this.val = pVal;
  this.weight = this.weigh(this.val);
 }
 
 /**
  * Set this node as parenthesized
  *
  * @this {node}
  */
 node.prototype.setParend = function(pVal){
  if(pVal){
   this.isparend = true;
  }else{
   this.isparend = false;
  }
 }



/**
 * This is a binary expression tree class (object)
 *
 * @constructor
 * @param {string} pVal The string to be evaluated
 */
function binetree(pExpr) {
 this._tree;
 this._is_expr = true;
 this._ignored = '.,';
 this._operators = '()^*xX/+-';
 this.expr = pExpr || '';
 this.exprArray = new Array();
 this.result = 0;
 
 if(this.expr){
  this.parse();
  
  // if we have an expression build a tree
  if(this._is_expr){
   this._tree = this.buildtree(this.exprArray);
  }
  
  // if we have a tree calculate a value
  if(this._tree){
   this._tree = this.balance(this._tree);
  }
  
  // if we have a tree calculate a value
  if(this._tree){
   this.result = this.evaluate(this._tree);
  }
 }
}
 /**
  * Parse the string expresion into an
  * array of operators and operands
  *
  * @this {binetree}
  */
 binetree.prototype.parse = function(){
  var tmp_txt = '',
   tmp_tmp_txt = '',
   tmp_expr = new Array(),
   tmp_was_operator = false;
  
  // build array of operands and operators
  // process expression character by character
  for(i=0; i<this.expr.length; i++){
   tmp_txt = this.expr.substring(i, i+1);
   
   // ignore spaces
   if((tmp_txt != ' ') && (tmp_txt != ' ')){
    // this character is an operator
    if(this._operators.indexOf(tmp_txt) >= 0){
     // replace the multiplication symbols
     if((tmp_txt == 'x') || (tmp_txt == 'X')){
      tmp_txt = '*';
     }
     // the last pass was not for an operator
     if(!tmp_was_operator){
      // this is not the first pass
      if(tmp_expr.length > 0){
       // store the operator
       tmp_expr.push(tmp_txt);
       tmp_was_operator = true;
      // this is the first pass
      }else{
       // it is not negation
       if(tmp_txt != '-'){
        // store the operator
        tmp_expr.push(tmp_txt);
        tmp_was_operator = true;
       // it is negation
       }else{
        // store the operand (negation of)
        tmp_expr.push(tmp_txt);
        tmp_was_operator = false;
       }
      }
     // two operators in a row
     }else{
      // it is negation
      if(tmp_txt == '-'){
       // store the operand (negation of)
       tmp_expr.push(tmp_txt);
       tmp_was_operator = false;
      }else{
       // store the operator
       tmp_expr.push(tmp_txt);
       tmp_was_operator = true;
      }
     }
    // this character is an operand
    }else{
     // is this operand a non-number
     if(isNaN(parseInt(tmp_txt))){
      // can we saefly ignore this character
      if(this._ignored.indexOf(tmp_txt) < 0){
       // TODO remove this debug info
       alert('crap: "'+tmp_txt+'"');
       // just quit now
       this._is_expr = false;
       break;
      }
     }
     
     // strip out any commas
     if(tmp_txt != ','){
      // last pass was an operator
      if(tmp_was_operator){
       // store the operand
       tmp_expr.push(tmp_txt);
       tmp_was_operator = false;
      // last pass was an operand (this is a continuation)
      }else{
       // this is not the first pass
       if(tmp_expr.length > 0){
        // get the last operand
        tmp_tmp_txt = tmp_expr.pop();
        // append this portion
        tmp_tmp_txt += tmp_txt;
        // store the operand
        tmp_expr.push(tmp_tmp_txt);
        tmp_was_operator = false;
       // this is the first pass
       }else{
        // store the operand
        tmp_expr.push(tmp_txt);
        tmp_was_operator = false;
       }
      }
     }
    }
   }
   
   if(this._is_expr){
    this.exprArray = tmp_expr;
   }
  }
 }
 
 /**
  * Build an expression treee from expresion array
  *
  * @this {binetree}
  * @param {string} pExprAry The expression array
  * @returns {node} The resulting tree
  */
 binetree.prototype.buildtree = function(pExprAry){
  var tmp_expr = pExprAry || new Array(),
   i = 0,
   tmp_txt = '',
   tmp_operand_stack = new Array(),
   tmp_operator_stack = new Array(),
   tmp_nobj = new node();
  
  // process each term in the expression
  for(i=0; i<tmp_expr.length; i++){
   tmp_txt = tmp_expr[i];
   
   // this is not a parentheses
   if((tmp_txt != '(') && (tmp_txt != ')')){
    // this is an operator
    if(this._operators.indexOf(tmp_txt) >= 0){
     // add the operator to the operator stack
     tmp_operator_stack.push(tmp_txt);
    // this is an operand
    }else{
     // create a node and add it to the operand stack (leaf node)
     tmp_operand_stack.push(new node(tmp_txt));
    }
   // this is a parentheses
   }else{
    // we are entering a parentheses
    if(tmp_txt == '('){
     // start a recursion into the parentheses
     tmp_nobj = this.buildtree(tmp_expr.slice(i+1, tmp_expr.length));
     // go forward in the loop
     i = i + tmp_nobj.loop + 1;
     // mark the node as in parentheses
     tmp_nobj.node.setParend(true);
     // save the nodes from inside the parentheses
     tmp_operand_stack.push(tmp_nobj.node);
    // we are leaving a parentheses
    }else if(tmp_txt == ')'){
     // return from recusion into parentheses
     return {'loop':i, 'node':tmp_operand_stack.pop()};
    }
   }
   
   // there is an operator to work with
   if(tmp_operator_stack.length >= 1){
    // there are two opaerand waiting
    if(tmp_operand_stack.length >= 2){
     tmp_node_r = tmp_operand_stack.pop();
     tmp_node_l = tmp_operand_stack.pop();
     tmp_operator = tmp_operator_stack.pop();
     // create a node and add it to the operand stack (internal node)
     tmp_operand_stack.push(new node(tmp_operator, tmp_node_l, tmp_node_r));
    }
   }
  }
  return tmp_operand_stack.pop();
 }
 
 /**
  * Balance an expression tree
  *
  * @this {binetree}
  * @param {node} pNode The starting tree
  * @returns {node} The resulting, balanced tree
  */
 binetree.prototype.balance = function(pNode){
  if(typeof pNode != 'undefined'){
   // if there is a left and right node
   if(pNode.left && pNode.right){
    // only reorder if they are not in parentheses
    if(!pNode.left.isparend && !pNode.isparend){
     //lower weight, higher order of precedence, lower in tree
     if(pNode.weight < pNode.left.weight){
      var tmp_node_val = '',
       tmp_node_r = new node(),
       tmp_node_l = new node();
      
      tmp_node_val = pNode.left.val;
      tmp_node_l = pNode.left.left;
      tmp_node_r = new node(pNode.val, pNode.left.right, pNode.right);
      
      pNode.setVal(tmp_node_val);
      pNode.left = tmp_node_l;
      pNode.right = tmp_node_r;
     }
    }
    // keep moving left and balancing
    this.balance(pNode.left);
    
    // AND THE RIGHT SIDE?
    // we don't need it here
   }
   return pNode;
  }
 }
 
 /**
  * Evalute the expression tree
  *
  * @this {binetree}
  * @param {node} pNode The tree to evaluate
  * @returns {numeric} The result of the expression
  */
 binetree.prototype.evaluate = function(pNode){
  if(typeof pNode != 'undefined'){
   // if there is a left and right node
   if(pNode.left && pNode.right){
    var tLeftVal = 0,
     tRightVal = 0;
    
    // process the left node
    tLeftVal = this.evaluate(pNode.left);
    // process the right node
    tRightVal = this.evaluate(pNode.right);
    
    //return the results for this node
    if(pNode.val != '^'){
     return eval(tLeftVal + pNode.val + tRightVal);
    }else{
     if(pNode.val == '^'){
      return Math.pow(tLeftVal, tRightVal);
     }
    }
   // this is the left leaf
   }else{
    // return node value
    return pNode.val;
   }
  }else{
   return Number.NaN;
  }
 }
 return new binetree(expr);
};