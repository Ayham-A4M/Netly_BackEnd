const getRandomColor=()=>{
    const colors=["#5c6bc0","#26a69a","#66bb6a","#ffb74d","#ff7043","#f06292","#7e57c2","#006064","#448aff"];
    return colors[parseInt(Math.random()*colors.length)];
}
module.exports=getRandomColor

