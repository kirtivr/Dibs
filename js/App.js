

require.config({
    baseUrl: '../dibs/libs',
    paths:{
        app: '../js/App',
        header: '../js/Header',
        footer: '../js/Footer',
        base: '../js/Base',
        matrix: '../js/MatrixContent',
        jquery: 'jquery',
        filestyle: "filestyle"
    },
    jsx: {
        fileExtension: '.jsx'
    }
});


Array.prototype.last = function() {
    return this[this.length-1];
}

function App(callback){
    if(callback){
        callback.call(this);
    }

}

App.prototype.resize = function(){
    require(['jquery'], function($){
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var headerHeight = parseInt(0.10* parseFloat(windowHeight),10);
        var contentHeight = parseInt(0.80* parseFloat(windowHeight),10) ;
        var footerHeight = parseInt(0.10* parseFloat(windowHeight),10);

        $('.dibsHeader').css('height',headerHeight);
        $('.dibsHeader').css('width',windowWidth);
        $('.dibsContent').css('height',contentHeight);
        $('.dibsContent').css('width',windowWidth);
        $('.goingsOnContent').css('height',contentHeight);
        $('.goingsOnContent').css('width',windowWidth/4);
        $('.dibsFooter').css('height',footerHeight);
        $('.dibsFooter').css('width',windowWidth);

    });
};

var app = new App();

App.prototype.showAuthorizePopup = function(props)
{
    require(['jquery'], function($){
    var options = $.extend({
        height : "150",
        width : "500",
        title:"'Enter' the passcode",
        description: "Example of how to create a modal box.",
        top: "40%",
        left: "30%"
    },props);

    add_block_page();
    add_popup_box(options);
    add_events();
    add_styles();

    function add_block_page()
    {
        var block_page = $('<div class="blocking_page"></div>');

        $(block_page).appendTo('body');

    };
    function add_popup_box(options)
    {
        var popup_box = $('<div class="authorize_popup_container"><div class="authorize_popup_content"><div class="authTitle">'+options.title+'</div><input id="authTextbox"  type="password"></div>');

        $(popup_box).appendTo('.blocking_page');

    };
    function add_events()
    {
      $('#authTextbox').keypress(
          function(eventData)
          {
            if(eventData.keyCode == 13)
            {
                var secretKey = $(this).val();
                // later , make a call to php to validate with backend user information
                var userCode = app.getUserCode(secretKey);
          }
          }
      );
    };
    function add_styles()
    {
        $('.authorize_popup_container').css({
            'margin-left':'auto',
            'margin-right':'auto',
            'margin-top':'250px',
            'display':'block',
            'height': options.height + 'px',
            'width': options.width + 'px',
            'border':'1px solid #fff',
            'box-shadow': '0px 2px 7px #292929',
            '-moz-box-shadow': '0px 2px 7px #292929',
            '-webkit-box-shadow': '0px 2px 7px #292929',
            'border-radius':'10px',
            '-moz-border-radius':'10px',
            '-webkit-border-radius':'10px',
            'background': '#000000',
            'z-index':'50'
        });

        /*Block page overlay*/
        var pageHeight = $(document).height();
        var pageWidth = $(window).width();

        $('.blocking_page').css({
            'position':'absolute',
            'top':'0',
            'left':'0',
            'background-color':'rgba(0,0,0,0.1)',
            'height':pageHeight,
            'width':pageWidth,
            'z-index':'10'
        });

        $('.authorize_popup_content').css({
            'background-color':'#cccccc',
            'height':(options.height - 50) + 'px',
            'width':(options.width - 50) + 'px',
            'textAlign':'center',
            'padding':'10px',
            'margin':'15px',
            'color':'black',
            'border-radius':'10px',
            '-moz-border-radius':'10px',
            '-webkit-border-radius':'10px'
        });

        $('#authTextbox').css({
            'height': 40 + 'px',
            'width':(options.width - 100) + 'px',
            'fontSize':'20px',
            'margin-top': '10px',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'display': 'block',
            'text-align': 'center'
        });

        $('.authTitle').css({
            'padding':'5px',
            'fontSize':'20px',
            'width':(options.width - 100) + 'px'
        });

    };
    });
}

app.showAuthorizePopup();

App.prototype.getUserCode = function(secretKey)
{
    var userCode = -1 ;
    var data = {"secretKey": secretKey};
    $.ajax({
        url: 'login.php',
        type:"POST",
        //dataType: 'json',
        data:data,
        processData: true,
        success: function(response){
            var jsonResponse = JSON.parse(response);
            var userData = jsonResponse[0];
            var allUserData = jsonResponse[1];
            if(userData.secretKey == secretKey)
                {
                    userCode = parseInt(userData.userCode,10);
                    var userName = userData.userName;
                    app.launchApp(userCode,userName,allUserData);
                }
        }.bind(this),
        error: function(a,b,c){
            //debugger;
        }
    });

};

App.prototype.launchApp = function(userCode,userName,userData)
{
    require(['react','jsx!header','jsx!footer', 'jsx!base', 'jsx!matrix'],
        function(React,Header,Footer,Base,MatrixContent){
            $('.blocking_page').hide();
            window.onresize = app.resize;
            var container_view = React.DOM.div({className:"dibsContainer"},Header({title:userName+"'s Dibs"}),Base({userCode: userCode,userName:userName,userData:userData}),Footer({name:userName}));
            React.renderComponent(container_view,document.getElementById("dibsBody"));
            app.resize();
        });
};
