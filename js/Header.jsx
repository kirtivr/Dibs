/** @jsx React.DOM */
define(['react'],function(React){
var Header = React.createClass({
            render: function()
            {
            var title = this.props.title;

            var header = <div className="dibsHeader">
                         <div className="header">
                         <div className="headerTitle">{title}</div>
                         </div>
                         </div>;
            return header;
            }
});
    return Header;
});




