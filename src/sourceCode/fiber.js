// 开始工作循环
let A = {
    type: 'div',
    key: 'A',
    props: {
        children: [
            'A',
            {type: 'div','key': 'B',props: {
                children: ['B', {type: 'div','key': 'B',children: null}]
            }}
        ]
    }
}

let workInprogress; // 表示一个工作单元，正在处理的fiber
const TAG_ROOT = 'TAG_ROOT';
const TAG_HOST = 'TAG_HOST'; // 原生dom节点 div span 
const Placement = 'Placement';
let root = document.getElementById('root');
let rootFiber = {
    tag: TAG_ROOT, // fiber类型
    key: 'Root', // 唯一标签
    stateNode: root, // fiber对应的真实dom节点
    props: {children: [A]}
}
/**
 * 根据当前的fiber和虚拟dom构建fiber树
*/
function beginwork(workInprogress) {
    let nextChild = workInprogress.props.children;
    // 会根据父fiber和所有的儿子虚拟dom儿子们构建出fiber树
    return reconcileChildren(workInprogress,nextChild) // 父fiber 和儿子
}
// 根据父 fiber和子虚拟dom数组构建当前returFiber的子fiber树
function reconcileChildren(returnFiber, nextChildren){
    let previousNewFiber; // 上一个fiber儿子
    let firstChildFiber; // 当前returnFiber的大儿子
    for(let newChild = 0;newChild < nextChildren.length; newChild++){
        let newFiber = createFiber(nextChildren[newChild]);
        newFiber.flags = Placement; // 这是一个新节点，肯定要插入到dom中
        newFiber.return = returnFiber;
        if(!firstChildFiber){
            firstChildFiber = newFiber;
        }else{
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber; 
    }
    returnFiber.child = firstChildFiber;
    return firstChildFiber; // 构建完子fiber后，返回大儿子
}
/**
 * fiber的创建和执行可以暂停
*/
function workLoop(deadline) {
    while(workInprogress) {
        workInprogress= performUnitOfwork(workInprogress);
    }
    console.log(rootFiber); // 工作循环结束以后看rootFiber的fiber结构
    commitRoot(rootFiber)
} 

function commitRoot(rootFiber) {
    let currentEffect = rootFiber.firstEffect;
    while(currentEffect){
        let flags = currentEffect.flags;
        switch(flags) {
            case Placement:
                commitPlacement(currentEffect)
        }
        currentEffect = currentEffect.nextEffect;
    }
}

function commitPlacement(currentEffect) {

}

/*
* 副作用链表，并不包含所有节点，而是包含有副作用的fiber节点，对于初次渲染而言，需要全部包含
  单链表结构，firstEffect->nextEffect->nextEffect->lastEffect,向上归并的过程
*/ 
function makeEffectList(complateWork) {
    let returnFiber = complateWork.return;
    if(returnFiber){
        if(!returnFiber.firstEffect) {
            returnFiber.firstEffect = complateWork.firstEffect;
        }
        if(complateWork.lastEffect) {
            if(returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = complateWork.firstEffect;
            }
            returnFiber.lastEffect = complateWork.lastEffect;
        }
        if(complateWork.flags) {
            if(returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect =complateWork;
            }else{
                returnFiber.firstEffect = complateWork;
            }
            returnFiber.lastEffect = complateWork;
        }
    }
}
function performUnitOfwork(workInprogress) {
    beginwork(workInprogress); // 构建子fiebr树
    if(workInprogress.child) { // 如果有儿子，继续构建儿子
        return workInprogress.child;
    }
    
    while(workInprogress){
        complateUnitOfWork(); // 如果没有儿子自己的工作单元任务就完成了，然后去创建真实的dom元素,父亲没有弟弟，父亲在此也会完成
        if(workInprogress.sibling)return workInprogress.sibling; // 如果没有儿子找弟弟
        workInprogress = workInprogress.return; // 如果没有弟弟返回父亲根据父亲找叔叔，如果再没有就是一直到return结束
    }
}
// fiber再创建时要构建真实的dom元素
function complateUnitOfWork(workInprogress) {
    let stateNode;
    switch(workInprogress.tag) {
        case TAG_HOST: 
            stateNode = createStateNode(workInprogress);
            break;
    }
    // 再完成工作单元的时候要判断当前的fiber节点有没有对应的dom操作
    makeEffectList(workInprogress);
}
function createStateNode(fiber) {
    if(fiber.tag === TAG_HOST) {
        let stateNode = document.createElement(fiber.type);
        fiber.stateNode = stateNode;
    }
    return fiber.stateNode;
}
function createFiber(element) {
    return {
        tag: TAG_HOST, // 原生dom节点
        type: element.type, // 标签 div span 
        key: element.key, // 唯一标识
        props: element.props // 属性对象
    }
}
// 当前正在执行的工作单元
workInprogress = rootFiber;
workLoop();