const AddToDom = (text) => {
    let par = document.createElement("p");
    let text_element = document.createTextNode(text);
    par.appendChild(text_element);
    document.getElementsByTagName('body')[0].appendChild(par);
}

AddToDom("Hello world");
export { AddToDom };
