function fillHTML(html,data){
    for(const key in data){
       html=html.replaceAll(`{{${key}}}`,data[key]);
    }
    return html;
}

export default fillHTML;