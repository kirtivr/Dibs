
define(['react','jquery'],function (React,$){

var floatingContent = React.createClass({
                                        render: function(){
                                            var componentToBeReturned;
                                            //debugger;
                                            if(this.props.addType == "addnew")
                                            {
                                            componentToBeReturned =
                                            <table className = "floatingContent">

                                            <tr className = "dibAddLineItem">
                                            <td><input name="dibToTradeInput" className = "dibToAddName" type="text" placeholder="Type a dib to trade">
                                            </input></td>

                                             </tr>
                                             </table>
                                            }
                                            else if(this.props.addType == "added")
                                            {
                                               componentToBeReturned =
                                                         <table className = "floatingContent">
                                                         <tr className = "dibAddLineItem">
                                                         <td><div className = "dibAddedName"></div></td>
                                                         <td><img className = "addNewButton" src = "./img/deleteButton.png"></img></td>
                                                         </tr>
                                                         </table>
                                            }

                                            return componentToBeReturned;
                                            }
                                        });


var matrixContent = React.createClass({
                                        render: function(){

                                        return <div className = "matrixContainer">
                                               Trade your dibs with

                                               <div className="tradeSelectUser"><select className="tradeSelectUserBox"><option value='kvr'>Kirti the foresighted </option></select></div>
                                               <floatingContent addType = "addnew"> </floatingContent>
                                               </div>;

                                        }
                                    });
return matrixContent;
});